
"use client";

export interface RecentActivity {
    id: number;
    type: string;
    title: string;
    date: string;
}

export interface NotificationSettings {
    liveMatchAlerts: boolean;
    upcomingMatchReminders: boolean;
    highlightsReady: boolean;
    weeklyNewsletter: boolean;
    promotions: boolean;
}

export interface Profile {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    lastProfileUpdate: string;
    recentActivity: RecentActivity[];
    notificationSettings: NotificationSettings;
}

export interface Account {
    plan: string;
    memberSince: string;
    profiles: Profile[];
}

const LOCAL_STORAGE_KEY = 'novaStreamAccount';

const initialAccount: Account = {
    plan: 'Premium Plan',
    memberSince: '2023-01-15',
    profiles: [
        {
            id: 1,
            firstName: 'Alex',
            middleName: 'J',
            lastName: 'Doe',
            email: 'alex@example.com',
            phone: '+1 123 456 7890',
            avatar: '',
            lastProfileUpdate: '2024-07-01',
            recentActivity: [
                { id: 10, type: 'Watched', title: 'Man U vs. Chelsea', date: '2024-07-28' },
                { id: 21, type: 'Watched', title: 'Lakers vs. Warriors', date: '2024-07-27' },
                { id: 32, type: 'Watched', title: 'India vs. Pakistan Highlight', date: '2024-07-26' },
                { id: 43, type: 'Watched', title: 'A historic hat-trick that shocked the world.', date: '2024-07-25' },
                { id: 54, type: 'Watched', title: 'Six sixes in an over - a rare feat!', date: '2024-07-24' },
            ],
            notificationSettings: {
                liveMatchAlerts: true,
                upcomingMatchReminders: true,
                highlightsReady: false,
                weeklyNewsletter: true,
                promotions: false,
            }
        },
        {
            id: 2,
            firstName: 'Jane',
            middleName: 'M',
            lastName: 'Smith',
            email: 'alex@example.com',
            phone: '+1 123 456 7890',
            avatar: '',
            lastProfileUpdate: '2024-06-28',
            recentActivity: [
                { id: 65, type: 'Watched', title: 'Wimbledon Finals', date: '2024-07-28' },
                { id: 76, type: 'Watched', title: 'F1: Monaco GP', date: '2024-07-27' },
            ],
            notificationSettings: {
                liveMatchAlerts: true,
                upcomingMatchReminders: false,
                highlightsReady: true,
                weeklyNewsletter: false,
                promotions: true,
            }
        },
        {
            id: 3,
            firstName: 'Junior',
            middleName: '',
            lastName: '',
            email: 'alex@example.com',
            phone: '+1 123 456 7890',
            avatar: '',
            lastProfileUpdate: '2024-07-10',
            recentActivity: [
                 { id: 87, type: 'Watched', title: 'Highlights: Arsenal vs. Spurs', date: '2024-07-28' },
            ],
            notificationSettings: {
                liveMatchAlerts: true,
                upcomingMatchReminders: true,
                highlightsReady: true,
                weeklyNewsletter: true,
                promotions: true,
            }
        }
    ]
};

export function getAccount(): Account {
    if (typeof window === 'undefined') return initialAccount;
    const storedAccount = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAccount) {
        // Simple migration to add notification settings if they don't exist
        const account = JSON.parse(storedAccount);
        let needsUpdate = false;
        account.profiles.forEach((p: Profile) => {
            if (!p.notificationSettings) {
                p.notificationSettings = initialAccount.profiles[0].notificationSettings;
                needsUpdate = true;
            }
        });
        if (needsUpdate) {
            saveAccount(account);
        }
        return account;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialAccount));
    return initialAccount;
}

export function saveAccount(account: Account) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(account));
}

export function setActiveProfileId(profileId: number) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_activeProfile`, profileId.toString());
}

export function getActiveProfileId(): number | null {
    if (typeof window === 'undefined') return null;
    const activeId = localStorage.getItem(`${LOCAL_STORAGE_KEY}_activeProfile`);
    return activeId ? parseInt(activeId, 10) : null;
}

export function addWatchedActivity(title: string) {
    if (typeof window === 'undefined') return;
    const account = getAccount();
    const activeProfileId = getActiveProfileId();
    if (!activeProfileId) return;

    const profileIndex = account.profiles.findIndex(p => p.id === activeProfileId);
    if (profileIndex === -1) return;
    
    const newActivity: RecentActivity = { 
        id: Date.now(),
        type: 'Watched', 
        title,
        date: new Date().toISOString().split('T')[0] 
    };
    
    // Avoid adding duplicate activity by title
    const alreadyExists = account.profiles[profileIndex].recentActivity.some(a => a.title === title);
    if (alreadyExists) return;

    account.profiles[profileIndex].recentActivity.unshift(newActivity);
    // Keep activity list to a reasonable size, but allow for more than 20 for "view full history"
    if (account.profiles[profileIndex].recentActivity.length > 50) {
       account.profiles[profileIndex].recentActivity = account.profiles[profileIndex].recentActivity.slice(0, 50);
    }
    
    saveAccount(account);
}

export function removeWatchedActivity(activityId: number) {
    if (typeof window === 'undefined') return;
    const account = getAccount();
    const activeProfileId = getActiveProfileId();
    if (!activeProfileId) return;

    const profileIndex = account.profiles.findIndex(p => p.id === activeProfileId);
    if (profileIndex === -1) return;

    account.profiles[profileIndex].recentActivity = account.profiles[profileIndex].recentActivity.filter(
        activity => activity.id !== activityId
    );

    saveAccount(account);
}
