
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import { SimpleHeader } from '@/components/ui/simple-header';
import { Footer } from '@/components/ui/footer';

const settingsOptions = [
  {
    icon: User,
    title: 'Edit Profile',
    description: 'Update your name, email, and personal details.',
    href: '/profile',
  },
  {
    icon: CreditCard,
    title: 'Manage Subscription',
    description: 'Change your plan, update payment methods, and view invoices.',
    href: '/settings/plan',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Choose how you receive notifications.',
    href: '/settings/notification',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Change your password and enable 2FA.',
    href: '/settings/security',
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
       <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <SimpleHeader />
          <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settingsOptions.map((option, index) => (
                <Link href={option.href} key={index}>
                  <div className="bg-gray-800/80 p-4 rounded-lg hover:bg-gray-700/80 transition-all cursor-pointer flex items-start gap-4 h-full">
                    <option.icon className="h-6 w-6 text-accent mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">{option.title}</h3>
                      <p className="text-sm text-white/70">{option.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
