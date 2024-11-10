'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Page() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [postData, setPostData] = useState({
    title: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)  // New loading state
  const [message, setMessage] = useState('')  // State for displaying messages

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when the form is submitting
    setMessage('');  // Clear any previous message before submitting

    // Make a POST request to your API
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      const data = await response.json();

      if (response.ok) {
        // If the API request is successful, clear the form inputs and reset the count
        setText('')
        setCount(0)
        setPostData({ title: '', message: '' })
        setMessage('Post submitted successfully!');  // Display success message
        router.push('/dash/home')
      } else {
        console.error('Error:', data.message)
        setMessage('Failed to create post. Please try again.');  // Display error message
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again later.');  // Display error message in case of network error
    } finally {
      setLoading(false);  // Reset loading to false after the submission is done
    }
  };

  const counter = (e) => {
    const newText = e.target.value
    setText(newText)
    setCount(newText.length)

    // Update the message inside postData
    setPostData({ ...postData, message: newText })

    if (newText.length > 120) {
      alert('Your message is too long!')
      setText(newText.slice(0, 120))  // Truncate text to 120 characters
      setCount(120)  // Set the count to 120
    }
  }

  useEffect(() => {
    const { title, message } = postData;
    if (!title || !message) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [postData])  // Dependency on postData to check if both fields are filled

  return (
    <div className='flex flex-col items-center justify-center h-[100vh] font-[family-name:var(--font-geist-sans)] px-5'>

      <h1 className='text-2xl mb-10 font-semibold tracking-tight'>What&apos;s Happening?</h1>

       {/* Display the success or error message */}
       {message && (
        <div className={`mb-10 ${message.includes('successfully') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} py-3 text-center w-[400px]`}>
          {message}
        </div>
      )}

      <div className='flex flex-col w-[400px] mb-5'>
        <label htmlFor='title'>Your title</label>
        <input
          type="text"
          value={postData.title}
          name='title'
          placeholder='Enter your title'
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          className="py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30 mb-5"
        />

        <label htmlFor='message'>Your message</label>
        <textarea
          placeholder='What do you think?'
          rows='4'
          maxLength={120}
          name='message'
          value={text}
          onChange={counter}
          className="py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30 mb-2"
        />
        <p className='text-right'>{count}/120</p>
      </div>

      <button
        disabled={isDisabled || loading}  // Disable the button when submitting
        className={`${isDisabled || loading ? 'bg-gray-300' : 'bg-[#000] text-white'} w-[400px] py-3 rounded-md mb-10`}
        onClick={handleSubmit}
      >
        {loading ? (
          <span>Loading...</span>  // Show loading text or spinner
        ) : (
          'Post now'
        )}
      </button>

     

      {/* Optional: Add a loading spinner */}
      {loading && (
        <div className="mt-4">
          <div className="spinner-border animate-spin border-4 border-t-4 border-gray-900 rounded-full w-6 h-6"></div>
        </div>
      )}

      <Link 
      href='/dash/home' 
      className='bg-transparent text-center border-b py-1 border-black border-opacity-10 rounded-md'
      >
        Nothing&apos;s Happening. Back to home
      </Link>
    </div>
  )
}

export default Page
