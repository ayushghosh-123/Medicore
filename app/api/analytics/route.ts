import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    
    // Determine the image type from the file
    const mimeType = file.type || "image/jpeg";

    // Use chat.completions.create with vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" for better accuracy
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this medical report image.
            Identify:
            - Patient name
            - Report date
            - Test names
            - Key findings
            - Diagnosis (if any)
            Summarize clearly in bullet points.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const summary = response.choices[0]?.message?.content || "No summary generated";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze medical report" },
      { status: 500 }
    );
  }
}