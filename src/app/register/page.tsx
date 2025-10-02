
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import  Image from "next/image";

const subscriptionPlans = [
  {
    name: "Free",
    price: 0,
    priceString: "$0/mo",
    features: ["Basic access", "Limited streams", "Ad-supported"],
  },
  {
    name: "Pro",
    price: 9.99,
    priceString: "$9.99/mo",
    features: ["Full access", "Ad-free streaming", "HD quality"],
  },
  {
    name: "Enterprise",
    price: 19.99,
    priceString: "$19.99/mo",
    features: ["Multi-user access", "4K quality", "Priority support"],
  }
];

export default function RegisterPage() {
  const [step, setStep] = useState('details'); // 'details', 'plans', 'payment'
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setStep('plans');
  };

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);
    const plan = subscriptionPlans.find(p => p.name === planName);
    if (plan && plan.price === 0) {
      // Free plan, so create account and redirect
      alert(`Account created with Free plan!`);
      window.location.href = "/";
    } else {
      // Paid plan, proceed to payment simulation
      setShowPaymentDialog(true);
    }
  };
  
  const handlePaymentConfirmation = () => {
    setShowPaymentDialog(false);
    // Simulate successful payment
    alert(`Payment successful! Account created with ${selectedPlan} plan.`);
    window.location.href = "/";
  }

  const renderDetailsForm = () => (
     <form className="space-y-4" onSubmit={handleDetailsSubmit}>
        <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Full Name</label>
          <input type="text" placeholder="Alex Doe" required className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>
        <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Email</label>
          <input type="email" placeholder="you@example.com" required className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>
        <div>
            <label className="text-white/80 text-sm mb-2 block font-headline">Phone Number</label>
            <input type="tel" placeholder="+91 12345 67890" required className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>
        <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Password</label>
          <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>
         <div>
          <label className="text-white/80 text-sm mb-2 block font-headline">Confirm Password</label>
          <input type="password" placeholder="••••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>

        <button type="submit" 
            className="w-full bg-accent text-accent-foreground font-headline font-semibold py-2 rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg !mt-6">
          Create Account
        </button>
        <Link href="/" className="mt-4 w-full block text-center text-white/70 hover:underline hover:text-accent">
          &larr; Back to Login
        </Link>
      </form>
  );

  const renderPlans = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-white font-headline">Subscribe to Watch</h2>
      <p className="text-center text-white/70">Choose a plan to continue</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {subscriptionPlans.map(plan => (
          <div key={plan.name} onClick={() => handlePlanSelection(plan.name)} className={cn("rounded-lg border p-4 cursor-pointer transition-all duration-200 flex flex-col text-center items-center justify-between hover:border-accent hover:bg-accent/10")}>
            <div>
              <h3 className="font-semibold text-white text-lg font-headline">{plan.name}</h3>
              <p className="text-2xl text-accent font-bold my-2">{plan.priceString}</p>
              <ul className="text-xs text-white/60 mt-2 space-y-1">
                {plan.features.map(f => <li key={f} className="flex items-center gap-1.5"><CheckCircle2 size={12}/>{f}</li>)}
              </ul>
            </div>
            <button className="mt-4 w-full bg-accent/20 text-accent font-semibold py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg border border-accent font-headline">
              {plan.price > 0 ? `Pay with GPay` : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
       <button onClick={() => setStep('details')} className="mt-4 w-full block text-center text-white/70 hover:underline hover:text-accent">
          &larr; Back
        </button>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'details':
        return renderDetailsForm();
      case 'plans':
        return renderPlans();
      default:
        return renderDetailsForm();
    }
  }


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
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
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


      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
          <div className="flex items-center justify-center mb-6">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
             <h1 className="flex text-3xl font-headline font-extrabold text-white text-center tracking-wide">
              {step === 'details' ? 'Create Your Account' : 'NovaStream'}
            </h1>
          </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
       <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription>
              A payment request for {subscriptionPlans.find(p => p.name === selectedPlan)?.priceString} has been sent to your mobile number. Please approve the transaction to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handlePaymentConfirmation}>
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    