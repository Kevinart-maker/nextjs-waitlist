'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { pirulen } from '@/ui/fonts';
import Image from 'next/image';
import hero from './hero.jpg';

type FormData = {
  name: string;
  email: string;
};

export default function Home() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage('You have been added to the waitlist!');
        reset();
      } else {
        setMessage(result.error || 'Something went wrong.');
      }
    } catch (error) {
      setLoading(false);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='md:m-[2rem] rounded-[0.5rem] bg-white flex md:flex-row flex-col-reverse shadow-md self-center overflow-hidden relative'>
      <div className='p-[1rem] py-[2rem] pb-[5rem] flex flex-col justify-between gap-8'>
        <div className='flex items-center gap-2'>
          <Image 
            src='/c.png'
            alt='clabed_logo'
            width={40}
            height={50}
          />
          <h1 className={`${pirulen.className} text-2xl font-bold`}>Clabed</h1>
        </div>

        <div className='flex flex-col gap-4'>
          <span className='bg-[#e2e8f0] px-[0.7rem] py-[0.1rem] text-xs font-bold rounded w-fit'>Coming soon</span>

          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl font-bold'>The Game-Changer for Car Dealers is Coming!</h2>
            <span className='text-xs'>Something powerful is on the horizon, built to help car dealers move faster, connect smarter, and close more deals. Get ahead of the curve. Join the waitlist now.</span>
          </div>
          
          {message ? <p>{message}</p> : (
            <form className='flex flex-col gap-4 text-xs' onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register('name', { required: true })}
                type='text'
                placeholder='John Doe'
                required
                className='outline-none border-b-1 p-[0.5rem]'
              />
              <input
                {...register('email', { required: true })}
                type='email'
                placeholder='john@example.com'
                required
                className='outline-none border-b-1 border-black p-[0.5rem]'
              />
              <button type='submit' disabled={loading} className='bg-black text-white p-[0.5rem] rounded'>
                {loading ? 'Submitting...' : 'Join'}
              </button>
            </form>
          )}
          <span className='absolute left-[1rem] bottom-[1rem] text-xs font-medium'>Created by dealers, for dealers.</span>
        </div>
      </div>

      <div className='w-fit flex justify-end'>
        <Image 
          src={hero}
          alt='hero_image'
          className='md:max-w-[80%] md:mt-0 mt-[-5rem] flex self-end'
        />
      </div>
    </div>
  );
}