import { NextResponse } from 'next/server';
import dbConnect from '@/utils/ConnectDb';
import User from '@/models/User';
import { generateVerificationCode, sendVerificationCodeEmail } from '@/utils/verification';

export async function POST(req) {
  try {
    // Parse the request body to get the email
    const { userId } = await req.json();

    console.log('Email received:', userId);

    // Check if email is provided
    if (!userId) {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email: userId });
    if (!user) {
      return NextResponse.json(
        { message: 'User with this email not found.' },
        { status: 404 }
      );
    }

    // Generate a new verification code
    const newVerificationCode = generateVerificationCode();

    // Update the user's verification code and set expiry (10 minutes)
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();

    // Send the new verification code to the user's email
    await sendVerificationCodeEmail(user.email, newVerificationCode);

    return NextResponse.json(
      { message: 'Verification code resent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in resend verification:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
