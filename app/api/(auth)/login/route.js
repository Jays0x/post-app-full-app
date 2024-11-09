import connectDB from "@/utils/ConnectDb";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exist");
      return NextResponse.json(
        { error: "Invalid credentials. Please check your email or password" },
        { status: 401 }
      );
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { message: "Wrong password. Please reset if you forgot your password" },
        { status: 401 }
      );
    }

    // Generate JWT for the user
    const JWT_TOKEN = process.env.JWT_SECRET_KEY;
    if (!JWT_TOKEN) {
      console.log("JWT_SECRET_KEY is not defined");
      return NextResponse.json(
        { message: "No token found in your .env file" },
        { status: 500 }
      );
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_TOKEN, { expiresIn: '1h' });

    return NextResponse.json(
      { message: 'Login successful', token: jwtToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: 'Login failed', error: error.message },
      { status: 500 }
    );
  }
}
