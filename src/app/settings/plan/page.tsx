
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
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
import { SimpleHeader } from '@/components/ui/simple-header';
import { Footer } from '@/components/ui/footer';


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

export default function ChangePlanPage() {
    const [currentPlan, setCurrentPlan] = useState("Pro");
    const [selectedPlan, setSelectedPlan] = useState("Pro");
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);


    const handlePlanSelection = (planName: string) => {
        setSelectedPlan(planName);
        if (planName === currentPlan) return;

        const plan = subscriptionPlans.find(p => p.name === planName);
        if (plan && plan.price === 0) {
            alert(`Your plan has been changed to Free!`);
            setCurrentPlan("Free");
        } else {
            setShowPaymentDialog(true);
        }
    };
    
    const handlePaymentConfirmation = () => {
        setShowPaymentDialog(false);
        alert(`Payment successful! Your plan has been upgraded to ${selectedPlan}.`);
        setCurrentPlan(selectedPlan);
    }


  return (
     <div className="min-h-screen bg-transparent text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center p-4">
       <div className="w-full max-w-4xl mx-auto">
        <SimpleHeader />
        <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Manage Subscription</CardTitle>
            <CardDescription>You are currently on the <span className="text-accent font-semibold">{currentPlan}</span> plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map(plan => (
                <div key={plan.name} onClick={() => handlePlanSelection(plan.name)} 
                    className={cn(
                        "rounded-lg border p-6 cursor-pointer transition-all duration-200 flex flex-col text-center items-center justify-between h-full bg-gray-800/30",
                        "hover:border-accent hover:bg-accent/10",
                        selectedPlan === plan.name && "border-accent bg-accent/10 ring-2 ring-accent"
                    )}>
                    <div>
                    <h3 className="font-semibold text-white text-2xl">{plan.name}</h3>
                    <p className="text-3xl text-accent font-bold my-4">{plan.priceString}</p>
                    <ul className="text-sm text-white/70 mt-4 space-y-2">
                        {plan.features.map(f => <li key={f} className="flex items-center gap-2"><CheckCircle2 size={16}/>{f}</li>)}
                    </ul>
                    </div>
                    <Button className="mt-6 w-full bg-accent/20 text-accent font-semibold py-2 rounded-lg hover:bg-accent hover:text-primary-foreground transition-all duration-300 shadow-lg border border-accent">
                        {currentPlan === plan.name ? 'Current Plan' : (plan.price > 0 ? `Switch to ${plan.name}` : 'Switch to Free')}
                    </Button>
                </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Plan Change</AlertDialogTitle>
            <AlertDialogDescription>
              A payment request for the {subscriptionPlans.find(p => p.name === selectedPlan)?.priceString} {selectedPlan} plan has been sent to your mobile number. Please approve the transaction to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <Button variant="ghost" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <AlertDialogAction onClick={handlePaymentConfirmation}>
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    <Footer />
  </div>
  );
}
