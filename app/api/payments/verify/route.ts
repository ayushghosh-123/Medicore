import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Patient from '@/models/Patient';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      consultationFee
    } = body;

    // Verify signature
    const bodyStr = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(bodyStr.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    await connectDB();

    // Find the patient
    const patient = await Patient.findOne({ clerkId: userId });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    const patientId = patient._id;

    // Check if appointment already exists for this payment/slot
    const existingAppointment = await Appointment.findOne({
      $or: [
        { paymentIntentId: razorpay_payment_id },
        {
          patientId,
          doctorId,
          appointmentDate: new Date(appointmentDate),
          appointmentTime,
        }
      ]
    });

    if (existingAppointment) {
      return NextResponse.json({ success: true, message: 'Appointment already exists' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      consultationFee: parseFloat(consultationFee),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentIntentId: razorpay_payment_id,
      paymentMethod: 'razorpay',
    });

    await appointment.save();

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
