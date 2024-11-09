import Post from "@/models/Post";
import User from "@/models/User";  // Assuming you have a User model
import connectDB from "@/utils/ConnectDb";
import cookie from "cookie";
import jwt from "jsonwebtoken";  // Import jwt to decode the token
import { NextResponse } from "next/server";

export async function POST(req) {
    // Connect to the database
    await connectDB();

    try {
        // Destructure and validate request body
        const { title, message } = await req.json();

        // Validate that title and message are provided
        if (!title || !message) {
            return NextResponse.json(
                { message: 'Title and content are required.' },
                { status: 400 }
            );
        }

        // Extract user ID from the cookies
        const cookies = cookie.parse(req.headers.get("cookie") || "");
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
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Use your JWT secret here
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        // Get the userId from the decoded JWT
        const userId = decoded.userId;

        console.log(userId);

        // const userId = '672e42539bc18b4d48d336d8';

        // Find the user by ID to get the author's name
        const user = await User.findById(userId);

        if (!user) {
            console.log('User ID not found')
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        // Create a new post with the author information
        const newPost = await Post.create({
            title: title,
            message: message,  // Pass content here
            author: user._id,  // Set the author as the user ID
            authorName: user.fullName,  // Assuming "fullName" is the field for the user's name
        });

        // Send the response with the created post
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

export async function GET(req, res) {
    // Connect to the database
    await connectDB();

    try {

        // Extract user ID from the cookies
        const cookies = cookie.parse(req.headers.get("cookie") || "");
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
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Use your JWT secret here
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        // Get the userId from the decoded JWT
        const userId = decoded.userId;
        
        console.log(userId);
        // Find all posts in descending order of creation date
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

        if(posts.length > 0) {
            return NextResponse.json({'posts': posts}, { status: 200 }, { message: 'Post found successfully' } );
        }
        
        if(!posts){
            return NextResponse.json({ message: 'No posts found' }, { status: 404 });
        }
      
    } 
    catch (error) {
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
