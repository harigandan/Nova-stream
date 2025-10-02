
"use client";

import { ArrowLeft, Image } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import  Image1 from "next/image";

export function SimpleHeader() {
  return (
    <header className="w-full max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Image1 src="/logo.png" alt="Logo" width={40} height={40} />
                 <h1 className="flex text-2xl font-extrabold text-center tracking-wide">
                    <span className="text-white">Nova</span><span className="text-accent">Stream</span>
                </h1>
            </div>
            <Link href="/home">
            <Button variant="ghost" className="text-white hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Button>
            </Link>
        </div>
    </header>
  );
}

    