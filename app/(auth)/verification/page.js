'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

function VerificationPage() {
  // State variables for managing form inputs and messages
  const [message, setMessage] = useState({ text: '', type: '' });
  const [token, setToken] = useState({
    token1: '',
    token2: '',
    token3: '',
    token4: '',
    token5: '',
    token6: '',
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [counter, setCounter] = useState(10); // Countdown timer starting at 10 seconds
  const [canResend, setCanResend] = useState(false); // Can the user resend the code?

  const router = useRouter(); // For navigation after successful verification

  // Refs for each input field to easily focus the next input
  const inputRefs = useRef([]);

  // Handle input change (only allowing numbers)
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // Only allow single digit entry
    if (value.match(/^[0-9]$/)) {
      setToken({
        ...token,
        [name]: value,
      });

      // Move to the next input field if there is one
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to move focus to the previous field if it's empty
  const handleKeyDown = (e, index) => {
    const { name, value } = e.target;

    if (e.key === 'Backspace') {
      if (value === '') {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        // Clear the current token input if there's a value
        setToken({
          ...token,
          [name]: '',
        });
      }
    }
  };

  // Handle paste of the code (allow 6 digits)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text');

    // If the pasted data is exactly 6 digits, populate the token state
    if (pasteData.length === 6 && /^[0-9]{6}$/.test(pasteData)) {
      const newToken = {
        token1: pasteData[0],
        token2: pasteData[1],
        token3: pasteData[2],
        token4: pasteData[3],
        token5: pasteData[4],
        token6: pasteData[5],
      };
      setToken(newToken);

      // Focus on the last input field
      inputRefs.current[5].focus();
    }
  };

  // Submit verification request to the backend
  const handleClick = async () => {
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });

      const data = await response.json();

      // Handle success or error messages based on the response
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        router.push('/login'); // Redirect after successful verification
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to verify code', type: 'error' });
    }
  };

  // Enable/disable the verify button if all token fields are filled
  useEffect(() => {
    const { token1, token2, token3, token4, token5, token6 } = token;
    setIsDisabled(!(token1 && token2 && token3 && token4 && token5 && token6));
  }, []);

  // Countdown timer for resend code functionality
  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear timer when counter reaches 0
    } else {
      setCanResend(true); // Allow resend when countdown is over
    }
  }, [counter]);

  // Handle resend verification code
  const handleResend = async () => {
    try {
      // Reset the timer
      setCounter(10);
      setCanResend(false);

      const userId = localStorage.getItem('userId'); // Get the userId (email)

      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), // Send the userId to the backend
      });

      const data = await response.json();
      setMessage({ text: data.message, type: response.ok ? 'success' : 'error' });
    } catch (error) {
      setMessage({ text: 'Failed to resend code', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-4xl font-bold mb-5">Email Verification</h1>

      {message.text && (
        <p
          className={`${
            message.type === 'success' ? 'bg-green-400' : 'bg-red-400'
          } text-white w-[370px] text-xl my-4 py-3 text-center rounded-md text-[15px]`}
        >
          {message.text}
        </p>
      )}

      {/* Token Inputs */}
      <div className="text-xl mt-4 flex gap-2 mb-10">
        {['token1', 'token2', 'token3', 'token4', 'token5', 'token6'].map(
          (field, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign refs to inputs
              type="text"
              name={field}
              value={token[field]}
              onChange={(e) => handleChange(e, index)} // Handle value change
              onKeyDown={(e) => handleKeyDown(e, index)} // Handle key events
              onPaste={handlePaste} // Handle paste functionality
              className="w-14 py-4 rounded-md bg-[#f5f5f5] text-center"
              maxLength={1}
              required
            />
          )
        )}
      </div>

      {/* Verify Button */}
      <button
        type="button"
        disabled={isDisabled} // Disable button if not all token fields are filled
        className={`${
          isDisabled ? 'bg-gray-300 text-black opacity-70' : 'bg-black text-white'
        } py-3 px-6 w-[370px] rounded-md font-bold`}
        onClick={handleClick} // Trigger verification on click
      >
        Verify Email
      </button>

      {/* Resend Section */}
      <div className="mt-5 flex gap-2">
        <p>Didn&apos;t receive the code?</p>
        <button
          onClick={handleResend} // Handle resend button click
          disabled={!canResend} // Disable if resend is not allowed
          className={`${
            canResend ? 'text-blue-500' : 'text-gray-500 cursor-not-allowed'
          }`}
        >
          {canResend ? 'Resend Code' : `Resend in ${counter}s`} {/* Show countdown */}
        </button>
      </div>
    </div>
  );
}

export default VerificationPage;
