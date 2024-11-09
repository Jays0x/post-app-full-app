import Post from "@/models/Post";
import User from "@/models/User"; 
import connectDB from "@/utils/ConnectDb";
import { parse } from 'cookie'; // Use named import here
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    // Connect to the database
    await connectDB();

    try {
        // Destructure and validate request body
        const { title, message } = await req.json();

        if (!title || !message) {
            return NextResponse.json(
                { message: 'Title and content are required.' },
                { status: 400 }
            );
        }

        // Extract cookies safely
        const cookieHeader = req.headers.get("cookie") || "";
        const cookies = cookieHeader ? parse(cookieHeader) : {};

        const token = cookies.token;

        if (!token) {
            return NextResponse.json(
                { message: 'User not authenticated.' },
                { status: 401 }
            );
        }

        // Decode the token to get the user ID
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        const userId = decoded.userId;
        console.log(userId);

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        const newPost = await Post.create({
            title,
            message,
            author: user._id,
            authorName: user.fullName,
        });

        return NextResponse.json(
            { message: 'Post created successfully', post: newPost },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    // Connect to the database
    await connectDB();

    try {
        // Extract cookies safely
        const cookieHeader = req.headers.get("cookie") || "";
        const cookies = cookieHeader ? parse(cookieHeader) : {};

        const token = cookies.token;

        if (!token) {
            return NextResponse.json(
                { message: 'User not authenticated.' },
                { status: 401 }
            );
        }

        // Decode the token to get the user ID
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        const userId = decoded.userId;
        console.log(userId);

        // Find all posts by the user
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

        if (posts.length > 0) {
            return NextResponse.json(
                { posts },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: 'No posts found' },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
