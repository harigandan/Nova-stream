"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Fingerprint } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SimpleHeader } from '@/components/ui/simple-header';
import { Footer } from '@/components/ui/footer';

export default function SecuritySettingsPage() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
       <div className="flex-1 flex flex-col items-center p-4">
       <div className="w-full max-w-2xl mx-auto">
        <SimpleHeader />
        <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Security</CardTitle>
            <CardDescription>Manage your account's security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 border border-gray-700/50 rounded-lg bg-gray-800/30">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Lock className="h-5 w-5 text-accent"/> Password</h3>
                <p className="text-sm text-white/70">It's a good idea to use a strong password that you're not using elsewhere.</p>
                <Button variant="outline" className="w-full justify-center border-gray-600 hover:bg-gray-700">Change Password</Button>
            </div>
            <Separator />
             <div className="space-y-4 p-4 border border-gray-700/50 rounded-lg bg-gray-800/30">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Fingerprint className="h-5 w-5 text-accent"/> Two-Factor Authentication</h3>
                 <p className="text-sm text-white/70">Add an extra layer of security to your account by using two-factor authentication.</p>
                <Button variant="outline" className="w-full justify-center border-gray-600 hover:bg-gray-700">Enable Two-Factor Authentication</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
  );
}
