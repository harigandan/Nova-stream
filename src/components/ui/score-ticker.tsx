
"use client";

import React, { useEffect, useState } from 'react';
import { fetchLiveMatches } from '@/lib/api-service';
import { Separator } from './separator';
import { RadioTower } from 'lucide-react';

interface TickerItem {
    id: string;
    title: string;
    sport: string;
}

export function ScoreTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTickerData = async () => {
            setLoading(true);
            try {
                const [football, cricket] = await Promise.all([
                    fetchLiveMatches('football'),
                    fetchLiveMatches('cricket'),
                ]);
                const combined = [...football, ...cricket].slice(0, 10); // Limit to 10 items for the ticker
                setItems(combined);
            } catch (error) {
                console.error("Failed to load ticker data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTickerData();
    }, []);

    if (loading || items.length === 0) {
        return null; // Don't render anything if loading or no live matches
    }

    const duplicatedItems = [...items, ...items]; // Duplicate for seamless scrolling

    return (
        <div className="bg-gray-800 text-white text-sm py-2 border-b border-gray-700">
            <div className="ticker-wrap">
                <div className="ticker-move">
                    <div className="flex items-center">
                      {duplicatedItems.map((item, index) => (
                          <React.Fragment key={`${item.id}-${index}`}>
                              <div className="flex items-center gap-2 mx-4 whitespace-nowrap">
                                  <RadioTower className="h-4 w-4 text-accent animate-pulse" />
                                  <span className="font-bold uppercase text-gray-400">{item.sport}</span>
                                  <span>{item.title}</span>
                              </div>
                              <Separator orientation="vertical" className="h-4 bg-gray-600" />
                          </React.Fragment>
                      ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
