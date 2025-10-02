
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mail } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SimpleHeader } from '@/components/ui/simple-header';
import { Footer } from '@/components/ui/footer';
import { useToast } from "@/hooks/use-toast";
import { getAccount, saveAccount, getActiveProfileId, NotificationSettings } from '@/lib/profile-manager';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationSettingsPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const account = getAccount();
        const activeProfileId = getActiveProfileId();
        const activeProfile = account.profiles.find(p => p.id === activeProfileId) || account.profiles[0];
        if (activeProfile) {
            setSettings(activeProfile.notificationSettings);
        }
    }, []);

    const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
        if (settings) {
            setSettings({ ...settings, [key]: value });
        }
    };

    const handleSaveChanges = () => {
        if (!settings) return;

        const account = getAccount();
        const activeProfileId = getActiveProfileId() || account.profiles[0].id;
        const updatedProfiles = account.profiles.map(p => {
            if (p.id === activeProfileId) {
                return { ...p, notificationSettings: settings };
            }
            return p;
        });

        saveAccount({ ...account, profiles: updatedProfiles });

        toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
        });
    };
    
    if (!isClient || !settings) {
        return (
             <div className="min-h-screen bg-transparent text-white flex flex-col">
              <div className="flex-1 flex flex-col items-center p-4">
               <div className="w-full max-w-2xl mx-auto">
                <SimpleHeader />
                <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
              </div>
             </div>
             <Footer />
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center p-4">
       <div className="w-full max-w-2xl mx-auto">
        <SimpleHeader />
        <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Notifications</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-accent"/> Push Notifications</h3>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80">
                    <Label htmlFor="live-now" className="font-medium">Live Match Alerts</Label>
                    <Switch 
                        id="live-now" 
                        checked={settings.liveMatchAlerts} 
                        onCheckedChange={(value) => handleSettingChange('liveMatchAlerts', value)}
                    />
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80">
                    <Label htmlFor="upcoming-reminders" className="font-medium">Upcoming Match Reminders</Label>
                     <Switch 
                        id="upcoming-reminders" 
                        checked={settings.upcomingMatchReminders}
                        onCheckedChange={(value) => handleSettingChange('upcomingMatchReminders', value)}
                    />
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80">
                    <Label htmlFor="highlights-ready" className="font-medium">Highlights Ready</Label>
                    <Switch 
                        id="highlights-ready" 
                        checked={settings.highlightsReady}
                        onCheckedChange={(value) => handleSettingChange('highlightsReady', value)}
                    />
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Mail className="h-5 w-5 text-accent"/> Email Notifications</h3>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80">
                    <Label htmlFor="newsletter" className="font-medium">Weekly Newsletter</Label>
                    <Switch 
                        id="newsletter" 
                        checked={settings.weeklyNewsletter}
                        onCheckedChange={(value) => handleSettingChange('weeklyNewsletter', value)}
                    />
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80">
                    <Label htmlFor="promotions" className="font-medium">Promotions and Offers</Label>
                    <Switch 
                        id="promotions" 
                        checked={settings.promotions}
                        onCheckedChange={(value) => handleSettingChange('promotions', value)}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button className="bg-accent text-primary-foreground hover:bg-accent/90" onClick={handleSaveChanges}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
     </div>
     <Footer />
    </div>
  );
}
