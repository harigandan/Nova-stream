
"use client";

import React, { useEffect, useState } from 'react';

// Define the types for widget props
type Sport = 'football' | 'cricket';
type WidgetType = 'games' | 'scoreboard';

interface WidgetProps {
  type: WidgetType;
  sport: Sport;
  options?: Record<string, string | number | boolean>;
}

// Define the mapping from widget type to element ID
const WIDGET_ID_MAP: Record<Sport, Record<WidgetType, string>> = {
  football: {
      games: 'wg-api-football-games',
      scoreboard: 'wg-api-football-scoreboard',
  },
  cricket: {
      games: 'wg-api-cricket-games',
      scoreboard: 'wg-api-cricket-scoreboard',
  }
};

const HOST_MAP: Record<Sport, string> = {
    football: 'v3.football.api-sports.io',
    cricket: 'v1.cricket.api-sports.io'
}

export function SportsWidget({ type, sport, options = {} }: WidgetProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Determine which API key to use based on the sport
    const key = sport === 'cricket' 
        ? process.env.NEXT_PUBLIC_CRICAPI_KEY 
        : process.env.NEXT_PUBLIC_API_SPORTS_KEY;
    setApiKey(key || null);
  }, [sport]);

  const widgetId = WIDGET_ID_MAP[sport][type];
  const host = HOST_MAP[sport];

  // Default widget settings
  const defaultOptions = {
    host: host,
    theme: "dark",
    refresh: "15",
    "show-toolbar": "true",
    "show-errors": "false",
    "show-logos": "true",
    "modal-game": "true",
    "modal-standings": "true",
    "modal-show-logos": "true",
  };
  
  if (!apiKey) {
    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg text-center">
          <p>API Key not configured for {sport}.</p>
          <p className="text-sm text-gray-400">Please set the required API key in your environment.</p>
        </div>
    );
  }

  const dataAttributes = {
    id: widgetId,
    "data-key": apiKey,
    ...defaultOptions,
    ...options,
  };

  Object.keys(dataAttributes).forEach(key => {
    const attrKey = key as keyof typeof dataAttributes;
    if (dataAttributes[attrKey] === null || dataAttributes[attrKey] === undefined) {
      delete dataAttributes[attrKey];
    }
  });

  return React.createElement('div', dataAttributes);
}
