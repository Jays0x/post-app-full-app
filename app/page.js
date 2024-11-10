import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[100vh] px-5 flex flex-col justify-center items-center font-[family-name:var(--font-geist-sans)]">

      <Image  
      src='/avatar.png' 
      alt="avatar" 
      width={80} 
      height={80}
      className="rounded-lg mb-10"
      />

     <h1 className="lg:text-4xl text-[30px] mb-3 tracking-tight">Easily create a post for your love one</h1>
     <p className="mb-10">
       Here is a platform to create a post for your favorite people
     </p>

     <div className='flex lg:flex-row gap-4 flex-col'>
        <Link href='/login'
          className='bg-transparent px-10 hover:bg-[#f5f5f5] text-center border border-black border-opacity-10 py-3 rounded-md'
        >
          Log in
        </Link>

        <Link
          href='/register'
          className='bg-transparent w-[400px] hover:bg-[#f5f5f5] text-center border border-black border-opacity-10 py-3 rounded-md'
        >
          Register
        </Link>
      </div>

    </div>
  );
}
