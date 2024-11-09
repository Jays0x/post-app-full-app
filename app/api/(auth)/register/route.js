import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { generateVerificationCode, sendVerificationCodeEmail } from '@/utils/verification';
import connectDB from '@/utils/ConnectDb';
import { MongoCryptInvalidArgumentError } from 'mongodb';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Destructure and validate request body
    const { fullName, email, password } = await req.json();

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }


    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'This user already exists. Please use another email or login.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    console.log(verificationCode);

    // Set expiration time for the verification code (10 minutes)
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now


    const firstUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false, // User is not verified initially
      verificationCode,
      verificationCodeExpires,
    })

    if(firstUser) {
      console.log({ message: firstUser })
    }

    // Send the verification code to the user's email
    await sendVerificationCodeEmail(email, verificationCode);

    return NextResponse.json(
      { message: 'Registration successful. A verification code has been sent to your email.' },
      { status: 201 }
    );
  } catch (error) {
    // Log and return detailed error message
    console.log(error);
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
