
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import  Image from "next/image";

export default function LoginPage() {
  const [phoneLoginActive, setPhoneLoginActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    window.location.href = "/home";
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert("Please enter phone number");
      return;
    }
    setOtpSent(true);
    // In a real app, you'd send an OTP here.
    alert(`OTP sent to ${phoneNumber}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    // In a real app, you'd verify the OTP here.
    alert(`Verifying OTP: ${otp}`);
     window.location.href = "/home";
  };

  const renderLoginForm = () => (
    <>
      <form className="space-y-5" onSubmit={handleEmailLoginSubmit}>
        <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-accent-foreground font-headline font-semibold py-2 rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg"
        >
          Login
        </button>
      </form>
      <div className="mt-6 flex flex-col items-center space-y-3">
        <a href="#" className="text-sm text-white/70 hover:underline hover:text-accent">
          Forgot password?
        </a>
        <button
          type="button"
          onClick={() => setPhoneLoginActive(true)}
          className="w-full bg-secondary text-secondary-foreground font-headline font-semibold py-2 rounded-lg hover:bg-secondary/80 transition-all duration-300 shadow-lg"
        >
          Sign in with Phone No
        </button>
        <Link
          href="/register"
          className="w-full text-center text-accent font-headline font-semibold py-2 rounded-lg border border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer"
        >
          Create Account
        </Link>
      </div>
    </>
  );

  const renderPhoneLoginForm = () => (
     <>
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="text-white/80 text-sm mb-2 block font-headline">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 12345 67890"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground font-headline font-semibold py-2 rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="text-white/80 text-sm mb-2 block font-headline">Enter OTP</label>
            <input
              type="text"
              placeholder="123456"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-accent-foreground font-headline font-semibold py-2 rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg"
          >
            Verify OTP
          </button>
        </form>
      )}

      <button
        onClick={() => {
          setPhoneLoginActive(false);
          setOtpSent(false);
          setPhoneNumber("");
          setOtp("");
        }}
        className="mt-4 w-full text-center text-white/70 hover:underline hover:text-accent"
        type="button"
      >
        &larr; Back to Email Login
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-background text-foreground">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(221, 39%, 11%, 1)" />
              <stop offset="100%" stopColor="hsla(19, 97%, 52%, 1)" />
            </linearGradient>
            <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsla(19, 97%, 52%, 1)" />
              <stop offset="100%" stopColor="hsla(221, 39%, 21%, 1)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#g1)"
            fillOpacity="0.7"
            d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,122.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,122.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,245.3C672,267,768,277,864,256C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,122.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <path
            fill="url(#g2)"
            fillOpacity="0.7"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,245.3C672,267,768,277,864,256C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,245.3C672,267,768,277,864,256C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,122.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                    M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,245.3C672,267,768,277,864,256C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
        </svg>
      </div>
      
      {/* Left Side Content */}
      <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center px-8 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
                <Image src="/logo.png" alt="Logo" width={80} height={80} />
                </div>
            <h1 className="text-4xl font-headline font-bold">Welcome to NovaStream</h1>
            <p className="text-lg opacity-80 mt-2">
              Connect, compete, and share your passion for the game.
            </p>
        </motion.div>
      </div>

       {/* Vertical Separator */}
       <div className="hidden md:flex items-center justify-center relative z-10">
        <div className="w-px h-2/3 bg-gray-700/50 rounded-full"></div>
      </div>


      {/* Right Side Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
          <div className="flex items-center justify-center mb-6">
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <h1 className="flex text-3xl font-headline font-extrabold text-white text-center tracking-wide">
              Nova<span className="text-accent">Stream</span>
            </h1>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={phoneLoginActive ? 'phone' : 'login'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {phoneLoginActive
                ? renderPhoneLoginForm()
                : renderLoginForm()}
            </motion.div>
          </AnimatePresence>
          <>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-gray-600" />
              <span className="mx-3 text-gray-400 font-semibold text-sm">OR</span>
              <hr className="flex-grow border-t border-gray-600" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white/90 text-gray-800 font-headline font-semibold py-2 rounded-lg hover:bg-white transition-all duration-300 shadow-md"
              onClick={() => alert("Google Sign-in Clicked!")}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.5-1.5-34.3-4.4-50.7H272v95.9h146.9c-6.3 34-25 62.9-53.7 82.2v68h86.7c50.8-46.8 80.6-115.7 80.6-195.4z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c72.7 0 133.7-24 178.3-65.2l-86.7-68c-24.1 16.2-55.1 25.7-91.6 25.7-70.3 0-130-47.5-151.4-111.1h-89.2v69.7c44.7 88.2 136 149.9 240.6 149.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M120.6 324.1c-11.4-33.3-11.4-69.5 0-102.8v-69.7h-89.2c-37.6 73.7-37.6 161.3 0 235l89.2-62.5z"
                />
                <path
                  fill="#EA4335"
                  d="M272 107.1c38.3 0 72.8 13.2 99.9 39.1l74.8-74.8C402.3 24 344.7 0 272 0 167.4 0 76.1 61.7 31.4 149.9l89.2 69.7c21.4-63.6 81.1-111.1 151.4-111.1z"
                />
              </svg>
              Sign in with Google
            </button>
          </>
        </div>
      </div>
    </div>
  );
}

    