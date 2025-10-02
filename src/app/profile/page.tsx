
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Home, User, Mail, Phone, Calendar, Clock, Film, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { SimpleHeader } from '@/components/ui/simple-header';
import { Footer } from '@/components/ui/footer';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAccount, saveAccount, setActiveProfileId as setActiveProfileIdInStorage, Account, Profile, getActiveProfileId, removeWatchedActivity } from '@/lib/profile-manager';


export default function ProfilePage() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [activeProfileId, setActiveProfileIdState] = useState<number | null>(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const accountData = getAccount();
    const activeId = getActiveProfileId();
    setAccount(accountData);
    setActiveProfileIdState(activeId || (accountData.profiles.length > 0 ? accountData.profiles[0].id : null));
  }, []);
  
  const activeProfile = account?.profiles.find(p => p.id === activeProfileId);
  
  const updateAccount = (newAccount: Account) => {
      setAccount(newAccount);
      saveAccount(newAccount);
  }

  const handleSetActiveProfileId = (profileId: number) => {
    setActiveProfileIdState(profileId);
    setActiveProfileIdInStorage(profileId);
  }

  const addProfile = () => {
    if (!account) return;
    const newId = account.profiles.length > 0 ? Math.max(...account.profiles.map(p => p.id)) + 1 : 1;
    const newProfile: Profile = {
        id: newId,
        firstName: 'New Profile',
        middleName: '',
        lastName: '',
        email: account.profiles[0]?.email || `new${newId}@example.com`,
        phone: account.profiles[0]?.phone || '',
        avatar: '',
        lastProfileUpdate: new Date().toISOString().split('T')[0],
        recentActivity: [],
        notificationSettings: {
            liveMatchAlerts: true,
            upcomingMatchReminders: true,
            highlightsReady: true,
            weeklyNewsletter: true,
            promotions: false,
        }
    };
    const newAccount = { ...account, profiles: [...account.profiles, newProfile] };
    updateAccount(newAccount);
    handleSetActiveProfileId(newProfile.id);
  }

  const removeProfile = (profileId: number) => {
    if (!account || account.profiles.length <= 1) {
        alert("You cannot remove the last profile.");
        return;
    }
    const newProfiles = account.profiles.filter(p => p.id !== profileId);
    const newAccount = { ...account, profiles: newProfiles };
    
    if (activeProfileId === profileId) {
        handleSetActiveProfileId(newProfiles[0].id);
    }
    updateAccount(newAccount);
  }
  
  const handleRemoveActivity = (activityId: number) => {
    if (!account || !activeProfile) return;
    
    const updatedProfiles = account.profiles.map(p => {
        if (p.id === activeProfileId) {
            return {
                ...p,
                recentActivity: p.recentActivity.filter(activity => activity.id !== activityId)
            };
        }
        return p;
    });

    const newAccount = { ...account, profiles: updatedProfiles };
    updateAccount(newAccount);
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeProfile || !account) return;
    const { id, value } = e.target;
    const updatedProfiles = account.profiles.map(p => 
        p.id === activeProfileId ? { ...p, [id]: value, lastProfileUpdate: new Date().toISOString().split('T')[0] } : p
    );
    const newAccount = { ...account, profiles: updatedProfiles };
    updateAccount(newAccount);
  }

  const handleProfileDoubleClick = (profileId: number) => {
      handleSetActiveProfileId(profileId);
      router.push('/home');
  }

  if (!isClient || !account || !activeProfile) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center">
        <SimpleHeader />
        <div className="flex-1 flex items-center justify-center">
            <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const displayedActivity = showAllActivity ? activeProfile.recentActivity : activeProfile.recentActivity.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
    <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl mt-4">
         <SimpleHeader />
        <Card className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 shadow-2xl animate-fade-in">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Manage Profiles</CardTitle>
                <CardDescription>You are on the <span className="text-accent">{account.plan}</span>. Double-click a profile to start watching.</CardDescription>
                 <div className="flex items-center gap-6 pt-4">
                    {account.profiles.map(profile => (
                        <div key={profile.id} 
                            onClick={() => handleSetActiveProfileId(profile.id)} 
                            onDoubleClick={() => handleProfileDoubleClick(profile.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 p-2 rounded-lg relative group",
                                activeProfileId === profile.id ? 'bg-accent/20' : 'hover:bg-gray-700/50'
                            )}>
                            <Avatar className={cn(
                                "h-20 w-20 border-2",
                                activeProfileId === profile.id ? 'border-accent' : 'border-transparent'
                            )}>
                                <AvatarImage src={profile.avatar} alt={profile.firstName} data-ai-hint="profile picture" />
                                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                                    {profile.firstName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className={cn("font-medium", activeProfileId === profile.id && "text-accent")}>{profile.firstName}</span>
                            {account.profiles.length > 1 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-80 hover:!opacity-100">
                                            <Trash2 size={16} />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the profile for {profile.firstName}.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeProfile(profile.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    ))}
                     <div onClick={addProfile} className="flex flex-col items-center gap-2 cursor-pointer text-gray-400 hover:text-accent p-2 rounded-lg transition-colors">
                        <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-600 hover:border-accent flex items-center justify-center">
                            <PlusCircle size={32}/>
                        </div>
                        <span className="font-medium">Add Profile</span>
                    </div>
                 </div>
            </CardHeader>
            <CardContent className="space-y-6">
            <Separator />
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className='md:col-span-1'>
                    <Label htmlFor="firstName" className="flex items-center text-white/80">
                    <User className="mr-2 h-4 w-4" /> First Name
                    </Label>
                    <Input id="firstName" value={activeProfile.firstName} onChange={handleInputChange} className="mt-1 bg-gray-700/50 border-gray-600" />
                </div>
                <div className='md:col-span-1'>
                    <Label htmlFor="middleName" className="flex items-center text-white/80">
                    <User className="mr-2 h-4 w-4" /> Middle Name
                    </Label>
                    <Input id="middleName" value={activeProfile.middleName} onChange={handleInputChange} className="mt-1 bg-gray-700/50 border-gray-600" />
                </div>
                <div className='md:col-span-1'>
                    <Label htmlFor="lastName" className="flex items-center text-white/80">
                    <User className="mr-2 h-4 w-4" /> Last Name
                    </Label>
                    <Input id="lastName" value={activeProfile.lastName} onChange={handleInputChange} className="mt-1 bg-gray-700/50 border-gray-600" />
                </div>
                </div>
                <div>
                <Label htmlFor="email" className="flex items-center text-white/80">
                    <Mail className="mr-2 h-4 w-4" /> Email Address
                </Label>
                <Input id="email" type="email" value={activeProfile.email} disabled className="mt-1 bg-gray-900/50 border-gray-600" />
                </div>
                <div>
                <Label htmlFor="phone" className="flex items-center text-white/80">
                    <Phone className="mr-2 h-4 w-4" /> Phone Number
                </Label>
                <Input id="phone" type="tel" value={activeProfile.phone} disabled className="mt-1 bg-gray-900/50 border-gray-600" />
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                    Membership Details
                </h3>
                <div className="flex justify-between text-sm text-white/80">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        <span>Member Since</span>
                    </div>
                    <span>{account.memberSince}</span>
                </div>
                <div className="flex justify-between text-sm text-white/80">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        <span>Last Profile Update</span>
                    </div>
                    <span>{activeProfile.lastProfileUpdate}</span>
                </div>
            </div>
            <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        Recent Activity
                    </h3>
                    {activeProfile.recentActivity.length > 0 ? (
                        <>
                         <ul className="space-y-2">
                            {displayedActivity.map((activity) => (
                                <li key={activity.id} className="flex items-center justify-between text-sm text-white/80 animate-fade-in group">
                                    <div className="flex items-center">
                                        <Film className="mr-3 h-4 w-4 text-accent" />
                                        <div className="flex flex-col">
                                            <span>{activity.type}: <strong>{activity.title}</strong></span>
                                            <span className="text-xs text-gray-400">{activity.date}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400" onClick={() => handleRemoveActivity(activity.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        {activeProfile.recentActivity.length > 3 && (
                            <button onClick={() => setShowAllActivity(!showAllActivity)} className="w-full text-accent hover:text-accent/90 flex items-center justify-center text-sm mt-2">
                                {showAllActivity ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                                {showAllActivity ? 'Show Less' : 'View Full History'}
                            </button>
                        )}
                        </>
                    ) : (
                        <p className="text-sm text-white/70">No recent activity for this profile.</p>
                    )}
                </div>
            <Separator />
            <Button className="w-full bg-accent text-primary-foreground hover:bg-accent/90" onClick={() => alert('Profile Saved!')}>Save Changes</Button>
            </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
  );
}

    