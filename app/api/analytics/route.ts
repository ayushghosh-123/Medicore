import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 10;

function resolveMimeType(file: Blob): string {
  const name = (file as File).name ?? "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const extMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
  };
  return file.type || extMap[ext] || "";
}

// ─── Doctor-Focused Clinical Prompt ──────────────────────────────────
const ANALYSIS_PROMPT = `You are a senior consultant physician summarizing a patient's medical report 
for the treating doctor. Your goal is to provide a fast, clinically actionable summary so the 
doctor can make treatment decisions immediately upon reading.

Write like a consultant handing over a case to a colleague — precise, prioritized, no fluff.

Use this EXACT structure with clear spacing between every section:

---

## 🏥 Clinical Summary

Write 2–3 sentences. State: who the patient is, the chief complaint or reason for the report, 
and the single most important clinical finding. This is the "30-second handover" a doctor reads first.

---

## 👤 Patient Profile

- **Name:** [Full name as written]
- **Age / Sex:** [Age] / [M or F]
- **ID / Ref No:** [If present, else — Not recorded]
- **Presenting Complaint:** [What the patient came in for, if mentioned]
- **Referred By / Facility:** [Doctor name / Hospital name]
- **Report Date:** [Date]

---

## 🔬 Investigations Performed

List every test done. One line each. Format:
- [Test Name] — [Type: Blood / Imaging / Urine / Other]

---

## 📊 Findings & Values

For each test, present a clean clinical table:

### [Test Name]
Parameter: [Name]
Value: [Value]
Reference Range: [Range]
Flag: 🔴 HIGH / 🟡 BORDERLINE / ✅ NORMAL

---

## ⚠️ Critical & Abnormal Findings

This is the most important section for rapid treatment. List ONLY abnormal values:

Parameter: [Name]
Patient Value: [Value]
Normal Range: [Range]
Severity: 🔴 Critical / 🟡 Mild / ✅ Normal

---

## 🩺 Diagnosis / Clinical Impression

State the diagnosis exactly as written. Then add a brief clinical expansion:

1. **[Primary Diagnosis]** — [Brief clinical note: what this means, typical presentation]
2. **[Secondary / Comorbidity]** — [Note if present]

If diagnosis is not stated, write: *"No formal diagnosis documented. Findings suggest: [your clinical inference based on results]."*

---

## 💊 Current Medications & Prescriptions

Parameter: [Name]
Patient Value: [Value]
Normal Range: [Range]
Severity: 🔴 Critical / 🟡 Mild / ✅ Normal


---

## 🚨 Immediate Action Required

This section tells the treating doctor exactly what to do next.
Be direct. Use clinical language. Prioritize by urgency:

**Urgent (Do Today):**
- [Action 1]
- [Action 2]

**Short-term (This Week):**
- [Action 1]
- [Action 2]

**Follow-up / Monitoring:**
- [Action 1]
- [Action 2]

---

## 📌 Treatment Considerations

Suggest clinically relevant treatment directions based on the findings:
- **Pharmacological:** [Drug classes or specific agents to consider]
- **Non-Pharmacological:** [Physiotherapy, dietary changes, rest, etc.]
- **Referrals:** [Which specialist to refer to, if indicated]
- **Investigations to Order:** [Any additional tests that would help]


---

STRICT CLINICAL RULES:
- Use proper medical terminology throughout — this is for a doctor, not a patient.
- Never simplify drug names, test names, or diagnostic terms.
- Flag values as 🔴 Critical if they require same-day action, 🟡 Mild if monitoring is sufficient.
- The "Immediate Action Required" section must always be filled — never write "N/A".
- If handwriting is unclear: write "Partially legible: [best reading]" — never skip a value.
- Keep every section cleanly separated with --- dividers.
- Prioritize speed of comprehension — a doctor must be able to act within 60 seconds of reading this.`;

// ─── POST Handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let uploadedFileId: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_FILE_SIZE_MB} MB limit.` },
        { status: 413 }
      );
    }

    const mimeType = resolveMimeType(file);
    const isPDF = mimeType === "application/pdf";
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);

    if (!isPDF && !isImage) {
      return NextResponse.json(
        { error: `Unsupported file type: "${mimeType}". Please upload JPG, PNG, WebP, GIF, or PDF.` },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    let summary: string;

    if (isPDF) {
      const fileName = (file as File).name || "report.pdf";
      const uploadedFile = await openai.files.create({
        file: await toFile(buffer, fileName, { type: "application/pdf" }),
        purpose: "user_data",
      });
      uploadedFileId = uploadedFile.id;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "file", file: { file_id: uploadedFileId } } as never,
              { type: "text", text: ANALYSIS_PROMPT },
            ],
          },
        ],
        max_tokens: 3500,
      });

      summary = response.choices[0]?.message?.content ?? "No summary generated.";
      await openai.files.delete(uploadedFileId);
      uploadedFileId = null;

    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`,
                  detail: "high",
                },
              },
              { type: "text", text: ANALYSIS_PROMPT },
            ],
          },
        ],
        max_tokens: 3500,
      });

      summary = response.choices[0]?.message?.content ?? "No summary generated.";
    }

    return NextResponse.json({ summary });

  } catch (error: unknown) {
    if (uploadedFileId) {
      try { await openai.files.delete(uploadedFileId); } catch { /* silent */ }
    }
    console.error("OpenAI API error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze the medical report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}