import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/utils/ConnectDb';

export async function POST(req) {
  await connectDB();

  try {
    // Extract the OTP tokens from the request body
    const { token1, token2, token3, token4, token5, token6 } = await req.json();
    const verificationCode = `${token1}${token2}${token3}${token4}${token5}${token6}`;

    console.log(verificationCode);

    // Validate OTP length (ensure it is 6 digits)
    if (verificationCode.length !== 6) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    // Find the user by the verification code and check expiration time
    const user = await User.findOne({
      verificationCode,// Match the 'verificationCode' field
      verificationCodeExpires: { $gt: Date.now() }, // Ensure the code is not expired
    });

    // Handle case if user is not found or the verification code is expired
    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationCode = undefined; // Clear the verification code after successful verification
    user.verificationCodeExpires = undefined; // Clear the expiration time
    await user.save(); // Save the updated user data

    return NextResponse.json({ message: 'Verification successful' }, { status: 200 });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}
