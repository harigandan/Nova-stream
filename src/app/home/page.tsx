
"use client";

import React from "react";
import { Search, Bell, Play, User, LogOut, Settings, UserCircle } from "lucide-react";
import { motion, AnimatePresence,useAnimation} from "framer-motion";
import { useState, useRef,useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/footer";
import { getAccount, getActiveProfileId, addWatchedActivity, Profile } from '@/lib/profile-manager';
import { useRouter } from "next/navigation";
import { fetchPopularTournaments, fetchLiveMatches, fetchUpcomingMatches, fetchHighlights } from '@/lib/api-service';
import { Skeleton } from "@/components/ui/skeleton";
import   Image1  from "next/image";

const allCategories = [
    { name: "Football", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLVY6_gzVLAE0zMeRTgSdcTeCKyU-EFOKP9g&s", hint: "football game" },
    { name: "Cricket", image: "https://tse2.mm.bing.net/th/id/OIP.iErAI7VPbbIrEL2wD7FiZQHaE6?w=1500&h=996&rs=1&pid=ImgDetMain&o=7&rm=3", hint: "cricket match" },
    { name: "Basketball", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfnZ34oOu5ixWLf37ZmH4EUNQFiSjtotqnvA&s", hint: "basketball players" },
    { name: "Volleyball", image: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/v1536936974/primary/exvzqcvorticinejmmel", hint: "volleyball match" },
    { name: "Tennis", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFTYTl7ooutLgRIBk3BZzh-9awape4AQgeFg&s", hint: "tennis court" },
    { name: "Formula 1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYiJaiKCw8VnUrvdCBXG7OxIoxWIqsiuQ3Mw&s", hint: "racing car" },
];

export default function AnimatedSportsHome() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLiveMatch, setHoveredLiveMatch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Highlight reel for NBA finals is ready." },
    { id: 2, message: "Your subscription is expiring soon." },
  ]);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  // API Data State
  const [slides, setSlides] = useState<any[]>([]);
  const [popularTournaments, setPopularTournaments] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const account = getAccount();
    const activeId = getActiveProfileId();
    const profile = account.profiles.find(p => p.id === activeId) || account.profiles[0];
    setActiveProfile(profile);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tournamentsData, liveFootball, liveCricket, upcomingFootball, upcomingCricket, highlightsFootball, highlightsCricket, iplHighlights] = await Promise.all([
                fetchPopularTournaments(),
                fetchLiveMatches('football'),
                fetchLiveMatches('cricket'),
                fetchUpcomingMatches('football'),
                fetchUpcomingMatches('cricket'),
                fetchHighlights('football'),
                fetchHighlights('cricket'),
                fetchHighlights('ipl'),
            ]);
            
            const allHighlights = [...highlightsFootball, ...highlightsCricket];
            const allLive = [...liveFootball, ...liveCricket];
            const allUpcoming = [...upcomingFootball, ...upcomingCricket];

            // Prioritize IPL highlights for the hero section
            const heroSlides = iplHighlights.length > 0 ? iplHighlights : allHighlights;
            setSlides(heroSlides.length > 0 ? heroSlides : [{ id: 'fallback', title: 'Welcome to NovaStream', description: 'Your universe of live sports.', image: 'https://placehold.co/1280x720.png', hint: 'sports collage' }]);
            
            setPopularTournaments(tournamentsData);
            setLiveMatches(allLive);
            setUpcomingMatches(allUpcoming);
            setHighlights(allHighlights);

        } catch (error) {
            console.error("Failed to fetch homepage data:", error);
            toast({ title: "Error", description: "Could not load live sports data. Please try again later.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }
    loadData();

  }, [toast]);
  
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleWatch = (id: string, title: string) => {
    addWatchedActivity(title);
    router.push(`/watch/${id}`);
  };

  const addReminder = (teams: string) => {
    const newNotification = {
      id: notifications.length + 1,
      message: `Reminder set for ${teams}!`,
    };
    setNotifications([newNotification, ...notifications]);
    setHasNewNotification(true);
    toast({
      title: "Reminder Set!",
      description: `You'll be notified when ${teams} starts.`,
    });
  };
  
  useEffect(() => {
    if (slides.length < 1) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const centerEntry = entries.find((entry) => entry.isIntersecting);
        if (centerEntry) {
          const index = Number((centerEntry.target as HTMLElement).dataset.index);
          setActiveIndex(index);
        }
      },
      { root: containerRef.current, threshold: 0.6 }
    );

    const thumbs = containerRef.current?.querySelectorAll(".thumb");
    if(thumbs) {
      thumbs.forEach((el) => observer.observe(el));
    }

    return () => {
        if(thumbs) {
            thumbs.forEach(el => observer.unobserve(el));
        }
    };
  }, [slides]);

  const filteredTournaments = popularTournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLiveMatches = liveMatches.filter((match) =>
    match.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpcomingMatches = upcomingMatches.filter((match) =>
    match.teams.toLowerCase().includes(searchQuery.toLowerCase()) || match.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = allCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHighlights = highlights.filter((highlight) =>
    highlight.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm shadow sticky top-0 z-50">
        <div className="flex items-center justify-between px-10 py-2">
          <motion.div 
            className="text-2xl font-bold cursor-default select-none flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <h1 className="flex text-2xl font-extrabold text-center tracking-wide font-headline">
              <span className="text-white">Nova</span><span className="text-accent">Stream</span>
            </h1>
          </motion.div>
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search matches..."
              className="w-full pl-12 pr-4 py-2 rounded-full bg-secondary text-secondary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
          <DropdownMenu onOpenChange={() => setHasNewNotification(false)}>
              <DropdownMenuTrigger asChild>
                <button className="relative text-xl focus:outline-none">
                  <Bell />
                  {hasNewNotification && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n.id}>{n.message}</DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none rounded-full">
                  {isClient && activeProfile ? (
                    <Avatar>
                      <AvatarImage
                        src={activeProfile.avatar}
                        alt={activeProfile.firstName}
                        data-ai-hint="profile picture"
                      />
                      <AvatarFallback>
                        {activeProfile.firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hero */}
        <div className="relative w-full">
         {loading ? <Skeleton className="w-full h-[650px] bg-muted" /> : (
          <>
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[activeIndex]?.id || activeIndex}
              className="w-full h-[650px] bg-black/50"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={slides[activeIndex]?.image}
                alt={slides[activeIndex]?.title}
                fill
                className="object-cover"
                data-ai-hint={slides[activeIndex]?.hint}
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slides[activeIndex]?.id || activeIndex}`}
              className="absolute bottom-32 left-8 max-w-xl px-4 py-2 text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-3 font-headline">{slides[activeIndex]?.title}</h2>
              {slides[activeIndex]?.isLive && (
                <span className="bg-red-600 text-xs px-2 py-1 rounded-full uppercase tracking-wider">
                  Live
                </span>
              )}
              <p className="mt-4 text-lg text-gray-200">
                {slides[activeIndex]?.description}
              </p>
              <button 
                className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition"
                onClick={() => handleWatch(slides[activeIndex].id, slides[activeIndex].title)}
              >
                <Play size={16} /> Watch Now
              </button>
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <div
                ref={containerRef}
                className="absolute bottom-4 right-4 flex gap-2 overflow-x-auto no-scrollbar w-[320px]"
            >
                {slides.map((slide, index) => (
                    <div
                    key={`${slide.id}-${index}`}
                    className={`thumb min-w-[80px] h-[60px] rounded-md overflow-hidden cursor-pointer border-2 ${
                        index === activeIndex
                        ? "border-accent"
                        : "border-transparent"
                    }`}
                    data-index={index}
                    onClick={() => setActiveIndex(index)}
                    >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        width={80}
                        height={60}
                        data-ai-hint={slide.hint}
                        className="w-full h-full object-cover"
                    />
                    </div>
                ))}
            </div>
          )}
          </>
         )}
        </div>
        
        <main className="px-24 py-6">
          <section>
              <h3 className="text-xl font-bold mb-4 font-headline">Popular Tournaments</h3>
              <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-4">
              {loading ? Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="min-w-[200px] h-[120px] rounded-lg bg-muted" />) :
              filteredTournaments.map((cat, i) => (
                <Link key={cat.id} href={cat.isHighlight ? `/watch/${cat.id}` : `/tournament/${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    className="min-w-[200px] h-[120px] rounded-lg bg-cover bg-center flex items-end p-4 text-white font-bold shadow-lg cursor-pointer relative w-[calc(20%-0.8rem)] flex-shrink-0"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image src={cat.image} alt={cat.name} layout="fill" className="object-cover rounded-lg" data-ai-hint={cat.hint} />
                    <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                     {cat.isHighlight && <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">HIGHLIGHT</div>}
                    <span className="relative z-10 font-headline">{cat.name}</span>
                  </motion.div>
                </Link>
              ))}
              </div>
          </section>

          {filteredLiveMatches.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-bold mb-4 font-headline">Live Now</h3>
            <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-4">
              {loading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="w-64 h-52 rounded-lg flex-shrink-0 bg-muted" />) : 
              filteredLiveMatches.map((match, i) => (
                <motion.div
                  key={match.id}
                  className="bg-card/50 backdrop-blur-sm rounded-lg w-64 flex-shrink-0 overflow-hidden cursor-pointer relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover="hover"
                  onHoverStart={() => setHoveredLiveMatch(i)}
                  onHoverEnd={() => setHoveredLiveMatch(null)}
                  onClick={() => handleWatch(match.id, match.title)}
                >
                  <motion.div
                    variants={{
                      initial: { scale: 1 },
                      hover: { scale: 1.1 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-36"
                  >
                    <Image
                      src={match.image}
                      alt={match.title}
                      width={256}
                      height={144}
                      data-ai-hint={match.hint}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="p-4">
                    <p className="font-semibold truncate font-headline">{match.title}</p>
                    <span className="text-sm text-red-400 font-bold">LIVE</span>
                  </div>
                  <AnimatePresence>
                    {hoveredLiveMatch === i && (
                      <motion.div
                        className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-center text-sm">{match.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
          )}

          {filteredUpcomingMatches.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-bold mb-4 font-headline">Upcoming Matches</h3>
            <ul className="flex flex-wrap gap-5">
              {loading ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-12 w-80 rounded-lg bg-muted" />) :
              filteredUpcomingMatches.map(({ teams, sport }, i) => (
                <motion.li
                  key={i}
                  className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-lg cursor-pointer hover:bg-card/80 gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span>{teams} - {sport}</span>
                  <button 
                    className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-full hover:bg-accent/90 transition"
                    onClick={() => addReminder(teams)}
                  >
                    <Bell size={16} /> Remind Me
                  </button>
                </motion.li>
              ))}
            </ul>
          </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4 font-headline">Categories</h2>
            <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-4">
              {filteredCategories.map((cat, i) => (
                 <Link key={cat.name} href={`/category/${cat.name.toLowerCase().replace(' ', '-')}`}>
                  <motion.div
                    className="min-w-[200px] h-[120px] rounded-lg bg-cover bg-center flex items-end p-4 text-white font-bold shadow-lg cursor-pointer relative"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image src={cat.image} alt={cat.name} layout="fill" className="object-cover rounded-lg" data-ai-hint={cat.hint} />
                    <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                    <span className="relative z-10 font-headline">{cat.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>

          {filteredHighlights.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 font-headline">Highlights</h3>
            <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-4">
              {loading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="w-[320px] h-56 rounded-lg flex-shrink-0 bg-muted" />) :
              filteredHighlights.map((highlight, i) => (
                <motion.div
                  key={highlight.id}
                  className="bg-card/50 backdrop-blur-sm rounded-lg w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:brightness-110 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleWatch(highlight.id, highlight.title)}
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={highlight.image}
                      alt={highlight.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play size={48} className="text-white/80" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold truncate font-headline">{highlight.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

    