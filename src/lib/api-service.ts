

// 🔑 Keys
const API_KEY = process.env.NEXT_PUBLIC_API_SPORTS_KEY || "e488ffe354mshe8513fbfe710789p1d288bjsna746a41822cb";
const CRICAPI_KEY = process.env.NEXT_PUBLIC_CRICAPI_KEY || "e65ca5e5-d9ce-4f9e-a65b-e42a3462445e";
const API_BASE = "https://x0xso2pa9i.execute-api.ap-south-1.amazonaws.com"; 

// 🌍 Hosts for API-Sports
const HOSTS: Record<string, string> = {
  football: "https://v3.football.api-sports.io",
  basketball: "https://v1.basketball.api-sports.io",
  nba: "https://v1.basketball.api-sports.io",
  volleyball: "https://v1.volleyball.api-sports.io",
  tennis: "https://v1.tennis.api-sports.io",
  "formula-1": "https://v1.formula-1.api-sports.io",
};

// ✅ Generic fetch for API-Sports
async function fetchFromAPI(sport: string, endpoint: string, params: Record<string, string | number> = {}) {
  const host = HOSTS[sport.toLowerCase()];
  if (!host) {
    console.error(`Unsupported sport: ${sport}`);
    return { response: [] };
  }
  const urlParams = new URLSearchParams();
  for (const key in params) {
    urlParams.append(key, String(params[key]));
  }
  
  const res = await fetch(`${host}/${endpoint}?${urlParams.toString()}`, {
    method: 'GET',
    headers: { "x-apisports-key": API_KEY },
    cache: "no-store",
  });
  if (!res.ok) {
      console.error(`API error for ${sport}: ${res.status} ${res.statusText}`);
      const errorBody = await res.text();
      console.error('Error body:', errorBody);
      return { response: [] };
  }
  return res.json();
}


// 🏏 CricAPI fetcher
async function fetchCricket(endpoint: string, params: Record<string, string | number> = {}) {
  const urlParams = new URLSearchParams({
    apikey: CRICAPI_KEY,
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
  });
  const url = `https://api.cricapi.com/v1/${endpoint}?${urlParams.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Cricket API error: ${res.status}`);
    return { data: [] };
  }
  return res.json();
}

function getIplImageAsset(match: any): string {
    const defaultImage = "https://placehold.co/256x144.png";
    if (!match.name || !match.name.includes("Indian Premier League")) {
        return match.teamInfo?.[0]?.img || defaultImage;
    }

    // Example match name: "Sunrisers Hyderabad vs Punjab Kings, 69th Match"
    const teamsPart = match.name.split(',')[0];
    const teams = teamsPart.split(' vs ');
    if (teams.length !== 2) return defaultImage;

    // A simple mapping from full team names to the abbreviations used in image URLs
    const teamAbbreviationMap: { [key: string]: string } = {
        "Chennai Super Kings": "CSK",
        "Delhi Capitals": "DC",
        "Punjab Kings": "PK",
        "Kolkata Knight Riders": "KKR",
        "Mumbai Indians": "MI",
        "Rajasthan Royals": "RR",
        "Royal Challengers Bangalore": "RCB",
        "Sunrisers Hyderabad": "SH",
        "Gujarat Titans": "GT",
        "Lucknow Super Giants": "LSG",
    };

    const team1Abbr = teamAbbreviationMap[teams[0].trim()];
    const team2Abbr = teamAbbreviationMap[teams[1].trim()];

    if (!team1Abbr || !team2Abbr) return defaultImage;
    
    // This is a guess based on the provided image. The actual match number might not be available.
    // We'll use a placeholder match number or derive it if possible.
    const matchNumber = match.name.match(/(\d+)(st|nd|rd|th) Match/)?.[1] || '1';

    return `https://cricketdata.org/images/ipl/IPL-Match-${matchNumber}-${team1Abbr}-vs-${team2Abbr}.jpg`;
}


// 🟢 Live matches (merged shape)
export async function fetchLiveMatches(sport: string, leagueId?: string) {
  if (sport.toLowerCase() === "cricket" || sport.toLowerCase() === 'ipl') {
    const data = await fetchCricket("currentMatches", { offset: "0" });
    const filteredData = (data?.data || []).filter((item: any) => {
        if (leagueId === 'ipl' || sport.toLowerCase() === 'ipl') {
            return item.name && item.name.includes("Indian Premier League");
        }
        return true;
    });

    return filteredData.map((item: any) => ({
      id: item.id || item.matchId,
      sport,
      title:
        item?.teams?.length === 2
          ? `${item.teams[0]} vs ${item.teams[1]}`
          : item?.name || item?.matchType || "Cricket Match",
      image: getIplImageAsset(item),
      description: `${item.series || "Cricket"} - ${item.status || "Live"}`,
      hint: 'cricket match'
    }));
  }
  
  let endpoint = sport.toLowerCase() === 'formula-1' ? "races?status=live" : "fixtures?live=all";
  if (leagueId) {
    endpoint += `&league=${leagueId}`
  }

  const data = await fetchFromAPI(sport, endpoint);

  if (["football", "basketball", "volleyball", "tennis"].includes(sport.toLowerCase())) {
    return (data.response || []).map((item: any) => ({
      id: item.fixture?.id.toString() || item.id.toString(),
      sport,
      title: `${item.teams.home.name} vs ${item.teams.away.name}`,
      image: item.teams.home.logo || "https://placehold.co/256x144.png",
      description: `${item.league.name} - ${item.fixture?.status?.long || item.status?.long}`,
      hint: `${sport.toLowerCase()} action`
    }));
  }
  
  if (sport.toLowerCase() === 'formula-1') {
    return (data.response || []).map((item: any) => ({
      id: item.id.toString(),
      sport,
      title: item.race.name,
      image: "https://placehold.co/256x144.png",
      description: `${item.competition.name} - ${item.status}`,
      hint: `formula 1 race`
    }));
  }

  return [];
}
export async function fetchAwsMatch(id: string) {
  const res = await fetch(`${API_BASE}/matches/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch AWS match: ${res.statusText}`);
  }

  return res.json();
}

// 🔵 Upcoming matches (merged shape)
export async function fetchUpcomingMatches(sport: string, leagueId?: string) {
  if (sport.toLowerCase() === "cricket" || sport.toLowerCase() === 'ipl') {
     const data = await fetchCricket("matches", { offset: "0" });
     const filteredData = (data?.data || [])
        .filter((item: any) => new Date(item.dateTimeGMT) > new Date())
        .filter((item: any) => {
            if (leagueId === 'ipl' || sport.toLowerCase() === 'ipl') {
                return item.name && item.name.includes("Indian Premier League");
            }
            return true;
        });
    
    return filteredData
      .slice(0, 5)
      .map((item: any) => ({
        teams:
          item?.teams?.length === 2
            ? `${item.teams[0]} vs ${item.teams[1]}`
            : item?.name || item?.matchType || "Cricket Match",
        sport: "Cricket",
      }));
  }

  const today = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 7); // 1 week ahead

  const fromDate = today.toISOString().split('T')[0];
  const toDate = to.toISOString().split('T')[0];
  
  let endpoint = `fixtures?from=${fromDate}&to=${toDate}&season=${today.getFullYear()}`;
  if (sport.toLowerCase() !== 'football') {
      endpoint = `games?from=${fromDate}&to=${toDate}&season=${today.getFullYear()}`;
  }

  if (leagueId) {
    endpoint += `&league=${leagueId}`
  }


  const data = await fetchFromAPI(sport, endpoint);

  return (data.response || []).slice(0,5).map((item: any) => ({
      teams: `${item.teams.home.name} vs ${item.teams.away.name}`,
      sport: item.league.name,
  }));
}


export async function fetchSlides(sport: string, leagueId?: string) {
    if (sport.toLowerCase() === "cricket" || sport.toLowerCase() === 'ipl') {
        const data = await fetchCricket("matches", { offset: "0" }); 
        const filteredData = (data?.data || []).filter((item: any) => {
            if (leagueId === 'ipl' || sport.toLowerCase() === 'ipl') {
                return item.name && item.name.includes("Indian Premier League");
            }
            return true;
        });
        
        const matches = filteredData.slice(0, 5).map((item: any) => ({
            id: item.id,
            title: item?.teams?.length === 2 ? `${item.teams[0]} vs ${item.teams[1]}` : item.name,
            description: `Starts on ${new Date(item.dateTimeGMT).toLocaleDateString()} - ${item.matchType}`,
            image: getIplImageAsset(item),
            isLive: item.status.toLowerCase() !== "match not started",
            category: 'Cricket',
            hint: 'cricket stadium'
        }));

        if (matches.length > 0) {
            return matches;
        }
        
        // Fallback for cricket if no matches are available
        return [
            { id: 'cricket-fallback-1', title: 'Major Tournaments Coming Soon', description: 'Stay tuned for the biggest events in cricket.', image: "https://placehold.co/1280x720.png", hint: 'cricket action', isLive: false, category: 'Cricket' },
            { id: 'cricket-fallback-2', title: 'Get Ready for the Action', description: 'All the live matches and highlights will appear here.', image: "https://placehold.co/1280x720.png", hint: 'cricket players', isLive: false, category: 'Cricket' },
        ];
    }

    if (sport.toLowerCase() === "football") {
        const data = await fetchFromAPI(sport, `leagues?${leagueId ? `id=${leagueId}` : 'current=true'}`);
        return (data.response || []).slice(0, 4).map((item: any) => ({
            id: item.league.id.toString(),
            title: item.league.name,
            description: `Watch live matches from ${item.country.name}`,
            image: item.league.logo || "https://placehold.co/1280x720.png",
            isLive: true,
            category: 'Football',
            hint: 'football stadium'
        }));
    }

    // Fallback for other categories
    return [
        { id: 'slide-fallback-1', title: `Featured in ${sport}`, description: `Top matches and highlights from the world of ${sport}.`, image: "https://placehold.co/1280x720.png", hint: `${sport.toLowerCase()} action`, isLive: false, category: sport },
    ];
}

// 🟣 Highlights (derived)
export async function fetchHighlights(sport: string, leagueId?: string) {
  const liveMatches = await fetchLiveMatches(sport, leagueId);
  return liveMatches.map((m: any) => ({
    ...m,
    id: m.id + "-h",
    title: m.title + " Highlights",
  }));
}

// 🏆 Popular Tournaments (+ Cricket card)
export async function fetchPopularTournaments() {
  const staticTournaments = [
    { id: "39", name: "Premier League", image: "https://media.api-sports.io/football/leagues/39.png", hint: 'football league' },
    { id: "140", name: "La Liga", image: "https://media.api-sports.io/football/leagues/140.png", hint: 'football league' },
    { id: "78", name: "Bundesliga", image: "https://media.api-sports.io/football/leagues/78.png", hint: 'football league' },
    { id: "nba", name: "NBA", image: "https://media.api-sports.io/basketball/leagues/12.png", hint: 'basketball league' },
    { id: "ipl", name: "IPL", image: "https://cricketdata.org/images/ipl/ipl-logo.png", hint: 'cricket league' },
  ];
  try {
      const [cricketSeries, iplHighlights] = await Promise.all([
        fetchCricket("series", { matchType: "odi,t20,test" }),
        fetchHighlights('ipl')
      ]);

      const cricketItems = (cricketSeries?.data || []).slice(0, 2).map((series: any) => ({
        id: `cricket-${series.id}`,
        name: series.name,
        image: series.shieldImageUrl || "https://placehold.co/200x120.png",
        hint: 'cricket series',
        isCricket: true
      }));

      const highlightItems = iplHighlights.slice(0, 4).map((highlight: any) => ({
        id: highlight.id,
        name: highlight.title,
        image: highlight.image,
        hint: highlight.hint,
        isHighlight: true,
      }));

      return [...staticTournaments, ...highlightItems, ...cricketItems];

  } catch(e) {
      console.error("Failed to fetch dynamic tournament data", e);
      return [...staticTournaments, { id: "cricket", name: "Cricket", image: "https://placehold.co/200x120.png", hint: 'cricket' }];
  }
}


export async function getMatchDetails(id: string) {
    // Check if it's a cricket match ID (UUID format)
    const isCricketId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isCricketId) {
        try {
            const matchInfoData = await fetchCricket('match_info', { id });
            const match = matchInfoData?.data;
            if (match) {
                const team1Flag = match.teamInfo?.find((t:any) => t.name === match.teams[0])?.img;
                const team2Flag = match.teamInfo?.find((t:any) => t.name === match.teams[1])?.img;
                
                const fullScorecard = match.scorecard?.map((inning: any) => ({
                    teamName: inning.inning.split(" Inning")[0],
                    teamFlag: inning.inning.includes(match.teams[0]) ? team1Flag : team2Flag,
                    score: inning.r,
                    wickets: inning.w,
                    overs: inning.o,
                    batting: (inning.batting || []).map((batter: any) => ({
                        name: batter.batsman,
                        outStatus: batter['dismissal-text'],
                        r: batter.r,
                        b: batter.b,
                        fours: batter['4s'],
                        sixes: batter['6s'],
                        sr: batter.sr
                    })),
                    bowling: (inning.bowling || []).map((bowler: any) => ({
                        name: bowler.bowler,
                        o: bowler.o,
                        m: bowler.m,
                        r: bowler.r,
                        w: bowler.w,
                        econ: bowler.e
                    }))
                }));

                return {
                    id: match.id,
                    title: match.name,
                    description: match.status,
                    image: getIplImageAsset(match),
                    hint: "cricket match",
                    isLive: !match.status.includes("won"),
                    category: "Cricket",
                    tournament: match.series,
                    seriesId: match.series_id,
                    scorecard: match.score?.map((s:any) => ({...s, flag: s.inning.includes(match.teams[0]) ? team1Flag : team2Flag })),
                    fullScorecard: fullScorecard
                };
            }
        } catch (e) {
            console.error("Failed to fetch cricket match details:", e);
        }
    }


    // Fallback to football or other sports
    try {
        const fixtureData = await fetchFromAPI('football', `fixtures?id=${id}`);
        const fixture = fixtureData.response[0];
        if (fixture) {
            return {
                id: fixture.fixture.id.toString(),
                title: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
                description: `${fixture.league.name} - ${fixture.fixture.status.long}`,
                image: fixture.teams.home.logo || "https://placehold.co/1280x720.png",
                hint: "football match",
                isLive: fixture.fixture.status.long !== "Match Finished",
                category: "Football",
                tournament: fixture.league.name,
                scorecard: null,
                fullScorecard: null
            };
        }
    } catch(e) {
        // ignore
    }
    
    // Generic fallback if all else fails
    return {
        id: id,
        title: "Match Details",
        description: "Live stream or highlight",
        image: "https://placehold.co/1280x720.png",
        hint: "sports event",
        isLive: true,
        category: "General",
        scorecard: null,
        fullScorecard: null,
    };
}


export async function fetchPlayingXI(matchId: string) {
    const data = await fetchCricket('match_squad', { id: matchId });
    return data?.data || [];
}

export async function fetchSeriesPoints(seriesId: string) {
    const data = await fetchCricket('series_points', { id: seriesId });
    return (data?.data || []).map((item: any) => ({
        teamName: item.teamname,
        img: item.img,
        matches: item.matches,
        wins: item.wins,
        loss: item.loss,
        ties: item.ties,
        nr: item.nr,
        points: item.points,
    }));
}

export async function fetchCommentary(matchId: string) {
    const data = await fetchCricket('commentary', { id: matchId });
    return (data?.data || []).map((item: any) => ({
        over: item.over,
        comment: item.commentary,
    }));
}
    