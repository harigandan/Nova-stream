
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { isPlayerSupported, create, PlayerEventType } from "amazon-ivs-player";
import dynamic from "next/dynamic";


import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Wifi, Cast, Settings, Dot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Footer } from '@/components/ui/footer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { summarizeMatch } from '@/ai/flows/summarize-match-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { getMatchDetails, fetchPlayingXI, fetchSeriesPoints, fetchCommentary } from '@/lib/api-service';
import { SportsWidget } from '@/components/ui/sports-widget';


type ContentItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  isLive?: boolean;
  category: string;
  tournament?: string;
  seriesId?: string;
  scorecard?: any[] | null;
  fullScorecard?: any | null;
  playbackUrl?: string;
};

const commentaryData = [
    { over: '19.6', text: 'SIX! What a finish! The batsman hits it out of the park to win the game!' },
    { over: '19.5', text: 'FOUR! Smashed through the covers. 2 runs needed off the last ball.' },
    { over: '19.4', text: 'WICKET! Bowled him! A perfect yorker right at the death.' },
    { over: '19.3', text: 'Two runs. Great running between the wickets.' },
    { over: '19.2', text: 'Dot ball. The pressure is mounting.' },
    { over: '19.1', text: 'One run. A good start to the over for the batting team.' }
];

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const playbackUrl =
    "https://bb50c35e1d09.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.135326432772.channel.UUH2TCTW0mOW.m3u8";

  const [content, setContent] = useState<ContentItem | null>(null);
  const [playingXI, setPlayingXI] = useState<any[]>([]);
  const [leagueTableData, setLeagueTableData] = useState<any[]>([]);
  const [liveCommentary, setLiveCommentary] = useState<any[]>([]);
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const [quality, setQuality] = useState("720");
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying);

  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof id !== 'string') return;
    
    const fetchContent = async () => {
        setIsLoadingContent(true);
        const item = await getMatchDetails(id);
        if (item) {
            setContent(item);
            if(item.category?.toLowerCase() === 'cricket') {
                const squad = await fetchPlayingXI(id);
                setPlayingXI(squad);
                if (item.seriesId) {
                    const points = await fetchSeriesPoints(item.seriesId);
                    setLeagueTableData(points);
                }
            }
        } else {
            router.push('/home');
        }
        setIsLoadingContent(false);
    }
    fetchContent();

  }, [id, router]);


  

  // ✅ Add these listeners here
  const WatchPlayer = dynamic(() => import("./watchplayer").then((mod) => mod.WatchPlayer), {
    ssr: false,
  });

  


  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);
  
  const hideControls = useCallback(() => {
    if (isPlayingRef.current) {
      setShowControls(false);
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);
  }, [hideControls]);
  
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.addEventListener('mousemove', handleMouseMove);
      player.addEventListener('mouseleave', hideControls);
      return () => {
        player.removeEventListener('mousemove', handleMouseMove);
        player.removeEventListener('mouseleave', hideControls);
      }
    }
  }, [handleMouseMove, hideControls]);

  useEffect(() => {
    if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    } else {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    }
    return () => {
        if(controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    }
  }, [isPlaying, hideControls]);

  useEffect(() => {
    const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = !!document.fullscreenElement;
        setIsFullscreen(isCurrentlyFullscreen);
        setShowControls(true); 
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
        if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            handleFullscreen();
        }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, handleFullscreen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const speed = parseFloat(playbackSpeed);
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + (0.1 * speed)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleTabChange = useCallback(async (tab: string) => {
    if (tab === 'ai-summary' && !summary && !isLoadingSummary && content) {
        setIsLoadingSummary(true);
        try {
             if (!content.scorecard) {
                setSummary("AI Summary can only be generated for matches with a valid scorecard.");
                return;
            }
            const result = await summarizeMatch({
                title: content.title,
                scorecard: JSON.stringify(content.scorecard),
                commentary: JSON.stringify(commentaryData)
            });
            setSummary(result.summary);
        } catch (error) {
            console.error("Failed to get AI summary:", error);
            setSummary("Sorry, we couldn't generate a summary for this match at the moment.");
        } finally {
            setIsLoadingSummary(false);
        }
    }
    if (tab === 'commentary' && liveCommentary.length === 0 && !isLoadingCommentary && content && content.category?.toLowerCase() === 'cricket') {
        setIsLoadingCommentary(true);
        try {
            const commentary = await fetchCommentary(content.id);
            setLiveCommentary(commentary);
        } catch (error) {
            console.error("Failed to fetch commentary:", error);
        } finally {
            setIsLoadingCommentary(false);
        }
    }
  }, [summary, isLoadingSummary, content, liveCommentary, isLoadingCommentary]);
  
  const Scorecard = () => {
    if (content?.category?.toLowerCase() === 'football') {
        return <SportsWidget type="scoreboard" sport="football" options={{ league: '39', fixture: id, season: '2023' }} />;
    }
    if (content?.category?.toLowerCase() === 'cricket' && content?.fullScorecard) {
        return (
             <div className="space-y-6">
                {content.fullScorecard.map((inning: any, index: number) => (
                    <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={inning.teamFlag} />
                                        <AvatarFallback>{inning.teamName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {inning.teamName}
                                </CardTitle>
                                <div className="text-2xl font-bold">{inning.score}/{inning.wickets} <span className="text-lg font-normal text-gray-400">({inning.overs} overs)</span></div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="batting" className="w-full">
                                <TabsList className="bg-gray-700/50">
                                    <TabsTrigger value="batting">Batting</TabsTrigger>
                                    <TabsTrigger value="bowling">Bowling</TabsTrigger>
                                </TabsList>
                                <TabsContent value="batting" className="mt-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-600 hover:bg-transparent">
                                                <TableHead className="text-white/70 w-[250px]">Batter</TableHead>
                                                <TableHead className="text-white/70 text-right">R</TableHead>
                                                <TableHead className="text-white/70 text-right">B</TableHead>
                                                <TableHead className="text-white/70 text-right">4s</TableHead>
                                                <TableHead className="text-white/70 text-right">6s</TableHead>
                                                <TableHead className="text-white/70 text-right">SR</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inning.batting.map((batter: any, idx: number) => (
                                                <TableRow key={idx} className="border-gray-700 font-mono hover:bg-gray-800/50">
                                                    <TableCell className="font-sans">
                                                        <p className="font-medium text-white">{batter.name}</p>
                                                        <p className="text-xs text-gray-400">{batter.outStatus}</p>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">{batter.r}</TableCell>
                                                    <TableCell className="text-right">{batter.b}</TableCell>
                                                    <TableCell className="text-right">{batter.fours}</TableCell>
                                                    <TableCell className="text-right">{batter.sixes}</TableCell>
                                                    <TableCell className="text-right">{batter.sr}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="bowling" className="mt-4">
                                     <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-600 hover:bg-transparent">
                                                <TableHead className="text-white/70 w-[250px]">Bowler</TableHead>
                                                <TableHead className="text-white/70 text-right">O</TableHead>
                                                <TableHead className="text-white/70 text-right">M</TableHead>
                                                <TableHead className="text-white/70 text-right">R</TableHead>
                                                <TableHead className="text-white/70 text-right">W</TableHead>
                                                <TableHead className="text-white/70 text-right">Econ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inning.bowling.map((bowler: any, idx: number) => (
                                                <TableRow key={idx} className="border-gray-700 font-mono hover:bg-gray-800/50">
                                                    <TableCell className="font-sans font-medium text-white">{bowler.name}</TableCell>
                                                    <TableCell className="text-right">{bowler.o}</TableCell>
                                                    <TableCell className="text-right">{bowler.m}</TableCell>
                                                    <TableCell className="text-right">{bowler.r}</TableCell>
                                                    <TableCell className="text-right font-bold">{bowler.w}</TableCell>
                                                    <TableCell className="text-right">{bowler.econ}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
  
    return (
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="pt-6">
                <p>Scorecard data not available for this match.</p>
            </CardContent>
        </Card>
    );
  };

  if (isLoadingContent || !content) {
    return (
        <div className="bg-background text-white min-h-screen flex flex-col">
            <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-gray-700">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </header>
            <main className="flex-1 flex flex-col items-center p-4 md:p-8">
                <Skeleton className="w-full max-w-7xl aspect-video rounded-lg" />
                <div className="w-full max-w-7xl mt-4">
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="h-96 w-full mt-4" />
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="bg-background text-white min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              <span className="text-white">Nova</span>
              <span className="text-accent">Stream</span>
            </h1>
          </Link>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div
          ref={playerRef}
          className="w-full max-w-7xl aspect-video bg-black relative group shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0">
            {playbackUrl ? (
              <WatchPlayer playbackUrl={playbackUrl} />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-gray-400">Live stream not available</p>
              </div>
            )}
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center z-10 transition-opacity",
              isPlaying && !showControls && "opacity-0",
              "pointer-events-none"
            )}
          ></div>

          <div
            className={cn(
              "absolute inset-0 z-20 bg-gradient-to-t from-black/60 to-transparent transition-opacity",
              isPlaying && !showControls && "opacity-0",
              "pointer-events-none"
            )}
          >
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {content.isLive && (
                <Badge
                  variant="destructive"
                  className="bg-red-600 text-white animate-pulse"
                >
                  LIVE
                </Badge>
              )}
              <h2 className="text-xl font-bold">{content.title}</h2>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              <div className="w-full group/progress px-2 mb-2 cursor-pointer">
                <Progress
                  value={progress}
                  className="h-1.5 bg-gray-600 [&>div]:bg-accent group-hover/progress:h-2 transition-all duration-200"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Wifi size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Cast size={20} />
                  </Button>
                  <Popover
                    onOpenChange={(open) => {
                      /* handle popover */
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Settings size={20} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 bg-gray-800 border-gray-700 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Playback Speed
                          </h4>
                          <RadioGroup
                            defaultValue={playbackSpeed}
                            onValueChange={setPlaybackSpeed}
                            className="flex space-x-2"
                          >
                            {["0.5", "1", "1.5", "2"].map((speed) => (
                              <div
                                key={speed}
                                className="flex items-center space-x-1"
                              >
                                <RadioGroupItem
                                  value={speed}
                                  id={`speed-${speed}`}
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor={`speed-${speed}`}
                                  className={cn(
                                    "px-2 py-1 rounded-md cursor-pointer",
                                    playbackSpeed === speed
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-gray-700"
                                  )}
                                >
                                  {speed}x
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Quality</h4>
                          <RadioGroup
                            defaultValue={quality}
                            onValueChange={setQuality}
                            className="flex flex-col space-y-1"
                          >
                            {["1080p", "720p", "480p", "360p"].map((q) => (
                              <div
                                key={q}
                                className="flex items-center justify-between"
                              >
                                <Label
                                  htmlFor={`q-${q}`}
                                  className="cursor-pointer"
                                >
                                  {q} HD
                                </Label>
                                <RadioGroupItem
                                  value={q.replace("p", "")}
                                  id={`q-${q}`}
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullscreen();
                    }}
                  >
                    {isFullscreen ? (
                      <Minimize size={24} />
                    ) : (
                      <Maximize size={24} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mt-4">
          <Tabs
            defaultValue="scorecard"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="playing-xi">Playing XI</TabsTrigger>
              <TabsTrigger value="league-table">League Table</TabsTrigger>
              <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
            </TabsList>
            <TabsContent value="scorecard" className="mt-4">
              <Scorecard />
            </TabsContent>
            <TabsContent value="playing-xi" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playingXI.length > 0 ? (
                  playingXI.map((team) => (
                    <Card
                      key={team.teamName}
                      className="bg-gray-800/50 backdrop-blur-sm border-gray-700"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={team.teamImage}
                              alt={team.teamName}
                            />
                            <AvatarFallback>
                              {team.teamName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle>{team.teamName}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {team.players.map((player: any) => (
                            <li
                              key={player.id}
                              className="flex items-center gap-2"
                            >
                              <Dot className="text-accent" />
                              {player.name}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>Playing XI information is not available for this match.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="league-table" className="mt-4">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle>League Standings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600 hover:bg-transparent">
                        <TableHead className="text-white/70">Team</TableHead>
                        <TableHead className="text-white/70 text-center">
                          Matches
                        </TableHead>
                        <TableHead className="text-white/70 text-center">
                          Won
                        </TableHead>
                        <TableHead className="text-white/70 text-center">
                          Lost
                        </TableHead>
                        <TableHead className="text-white/70 text-center">
                          Tied
                        </TableHead>
                        <TableHead className="text-white/70 text-center">
                          Points
                        </TableHead>
                        <TableHead className="text-white/70 text-right">
                          NRR
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leagueTableData.map((row) => (
                        <TableRow
                          key={row.teamName}
                          className="border-gray-700 hover:bg-gray-800/50"
                        >
                          <TableCell className="font-medium flex items-center gap-2">
                            <img
                              src={row.img}
                              alt={row.teamName}
                              className="w-6 h-6 object-contain"
                            />
                            {row.teamName}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.matches}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.wins}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.loss}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.ties}
                          </TableCell>
                          <TableCell className="font-bold text-center">
                            {row.points}
                          </TableCell>
                          <TableCell className="text-right">{row.nr}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai-summary" className="mt-4">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle>AI Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSummary ? (
                    <div className="flex flex-col space-y-3">
                      <Skeleton className="h-5 w-4/5 rounded-lg" />
                      <Skeleton className="h-5 w-full rounded-lg" />
                      <Skeleton className="h-5 w-3/4 rounded-lg" />
                      <Skeleton className="h-5 w-4/5 rounded-lg mt-4" />
                      <Skeleton className="h-5 w-full rounded-lg" />
                    </div>
                  ) : (
                    <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                      {summary}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="commentary" className="mt-4">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 max-h-[500px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Live Commentary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCommentary ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                  ) : liveCommentary.length > 0 ? (
                    <ul className="space-y-4">
                      {liveCommentary.map((c, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="font-bold text-accent w-16">
                            {c.over}
                          </div>
                          <div
                            className="flex-1 text-white/90"
                            dangerouslySetInnerHTML={{ __html: c.comment }}
                          ></div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Commentary data not available for this match.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    