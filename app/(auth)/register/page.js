'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function Page() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(""); // State to store backend message
    const [loading, setLoading] = useState(false); // State for loading status

    const router = useRouter();

    // Update the form data when input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Check if all fields are filled out
    useEffect(() => {
        const { fullName, email, password } = formData;
        if (fullName && email && password) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Redirect to the verification page if registration is successful
            if (response.status === 201) {
                setMessage({ text: result.message, type: 'success' });  // Success message
                localStorage.setItem('userId', formData.email);
                console.log(formData);
                console.log('Signup successful');
                router.push('/verification');
            } else {
                setMessage({ text: result.message || 'Something went wrong', type: 'error' });  // Error message
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <div className='flex flex-col justify-center items-center w-full h-[100vh] font-[family-name:var(--font-geist-sans)]'>
            <div className='mb-10 text-center'>
                <h1 className='text-4xl font-bold mb-3'>Welcome to our website!</h1>
                <p>Please fill out the form below to create an account.</p>
            </div>

            {/* Display success/error messages */}
            {message && (
                <div className={`w-[400px] py-3 px-4 text-center ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-md mb-5`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col w-[400px] mb-5'>
                <label htmlFor='fullName' className='mb-3'>Full name</label>
                <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    value={formData.fullName}
                    placeholder='Enter full name'
                    required
                    className='py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30'
                    onChange={handleChange}
                />
                
                <label htmlFor='email' className='mb-3 mt-5'>Email address</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    placeholder='Enter email address'
                    required
                    className='py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30'
                    onChange={handleChange}
                />
                
                <label htmlFor='password' className='mb-3 mt-5'>Password</label>
                <div className='relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        placeholder='Must be 6+ characters'
                        required
                        value={formData.password}
                        className='py-3 px-3 bg-[#f5f5f5] placeholder:text-black placeholder:opacity-30 w-full'
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-3 text-sm text-gray-600'
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button
                    type="submit"
                    className={`${isDisabled ? 'bg-gray-500' : 'bg-[#000]'} py-4 w-full mt-5 rounded-md text-white flex justify-center items-center text-center`}
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
                        'Submit'
                    )}
                </button>
            </form>

            <p className='mt-5 text-center'>
                Already have an account? <a href='/login' className='text-black font-semibold'>Login</a>
            </p>
        </div>
    );
}

export default Page;
