'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Page() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setAllPosts(data.posts || []);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = `${cookie
        .split('=')[0]
        .trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });

    // Redirect to login page
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-[100vh]'>
        <div className='mb-10 text-center'>
          <div className='animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-black'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh] font-[family-name:var(--font-geist-sans)]'>
      <h1 className='text-4xl mb-10 font-semibold tracking-tight'>List of all posts</h1>

      <div className='grid grid-cols-3 mx-auto gap-5 mb-20 justify-center items-center'>
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div key={post._id} className='bg-[#fff] border border-black border-opacity-10 p-4 rounded-lg w-[300px]'>
              <h2 className='text-[20px] font-bold'>{post.title}</h2>
              <p className='mb-4'>{post.message}</p>
              <p className='text-black opacity-50 text-[12px]'>
                {new Date(post.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))
        ) : (
          <div className='absolute mx-auto text-center ml-[-72px]'>
            <h1 className='text-[20px] mb-2'>No posts yet</h1>
            <p>Fetching all your posts here</p>
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <button
          onClick={handleLogout}
          className='bg-transparent px-10 hover:bg-[#f5f5f5] text-center border border-black border-opacity-10 py-3 rounded-md'
        >
          Log out
        </button>

        <Link
          href='/dash/all-posts'
          className='bg-transparent w-[400px] hover:bg-[#f5f5f5] text-center border border-black border-opacity-10 py-3 rounded-md'
        >
          Click here to post
        </Link>
      </div>
    </div>
  );
}

export default Page;
