'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

function VerificationPage() {
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
  const [counter, setCounter] = useState(10);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (value.match(/^[0-9]$/)) {
      setToken({
        ...token,
        [name]: value,
      });

      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const { name, value } = e.target;

    if (e.key === 'Backspace') {
      if (value === '') {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        setToken({
          ...token,
          [name]: '',
        });
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text');

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
      inputRefs.current[5].focus();
    }
  };

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

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        router.push('/login');
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to verify code', type: 'error' });
    }
  };

  // Updated useEffect to check if all token inputs are filled
  useEffect(() => {
    const allFilled = Object.values(token).every((value) => value !== '');
    setIsDisabled(!allFilled);
  }, [token]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [counter]);

  const handleResend = async () => {
    try {
      setCounter(10);
      setCanResend(false);

      const userId = localStorage.getItem('userId');

      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
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

      <div className="text-xl mt-4 flex gap-2 mb-10">
        {['token1', 'token2', 'token3', 'token4', 'token5', 'token6'].map(
          (field, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              name={field}
              value={token[field]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-14 py-4 rounded-md bg-[#f5f5f5] text-center"
              maxLength={1}
              required
            />
          )
        )}
      </div>

      <button
        type="button"
        disabled={isDisabled}
        className={`${
          isDisabled ? 'bg-gray-300 text-black opacity-70' : 'bg-black text-white'
        } py-3 px-6 w-[370px] rounded-md font-bold`}
        onClick={handleClick}
      >
        Verify Email
      </button>

      <div className="mt-5 flex gap-2">
        <p>Didn&apos;t receive the code?</p>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`${
            canResend ? 'text-blue-500' : 'text-gray-500 cursor-not-allowed'
          }`}
        >
          {canResend ? 'Resend Code' : `Resend in ${counter}s`}
        </button>
      </div>
    </div>
  );
}

export default VerificationPage;
