'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false); // State for loading spinner

  const router = useRouter();

  // Update the form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Redirect to login if token is missing
      router.push('/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });

        // Log the token to ensure it's being returned
        console.log('Received token:', data.token);

        // Store the token using js-cookie
        Cookies.set('token', data.token, { path: '/' });

        // Reset the form fields
        setFormData({
          email: '',
          password: '',
        });

        // Redirect to the dashboard page if login is successful
        console.log('Redirecting to dashboard page');
        router.push('/dash/home');
      } else {
        setMessage({ text: data.message || 'Invalid credentials. No account found', type: 'error' });
      }
    } catch (err) {
      console.log('Error submitting form:', err);
      setMessage({ text: 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false); // Reset loading to false after submission attempt
    }
  };

  // Check if all fields are filled out
  useEffect(() => {
    const { email, password } = formData;
    if (email && password) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formData]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-[100vh] font-[family-name:var(--font-geist-sans)]">
      <div className="mb-10 text-center">
        <h1 className="lg:text-4xl text-[30px] font-bold mb-3">Welcome back</h1>
        <p>Kindly login to your account</p>
      </div>

      {/* Display success/error messages */}
      {message.text && (
        <div
          className={`w-[400px] py-3 px-4 text-center ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white rounded-md mb-5`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col w-[400px] mb-5">
        <label htmlFor="email" className="mb-3">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          required
          onChange={handleChange}
          className="py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30 mb-5"
        />

        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            placeholder="Must be 6+ characters"
            required
            className="py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30 w-full mb-5"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className={`${
            isDisabled ? 'bg-gray-500' : 'bg-[#000]'
          } py-4 w-full mt-5 rounded-md text-white flex justify-center items-center`}
          disabled={isDisabled}
        >
          {loading ? (
            // Spinner shown when loading
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v4m0 0V4m0 0h4m-4 0H4m16 8v4m0 0v-4m0 0h4m-4 0h-4"
              />
            </svg>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <p className='mt-5 text-center'>
                Don&apos;t have an account? <a href='/register' className='text-black font-semibold'>Sign up</a>
      </p>
    </div>
  );
}

export default Page;
