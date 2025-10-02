
"use client";

import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image  from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
             <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                 <h1 className="flex text-2xl font-extrabold text-white text-center tracking-wide">
                    <span className="text-white">Nova</span><span className="text-accent">Stream</span>
                </h1>
            </div>
            <p className="text-gray-400">
              Your universe of live sports streaming.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-accent">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-accent">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-accent">
                <Instagram size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Analytics</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Marketing</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Commerce</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Pricing</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Documentation</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Guides</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">API Status</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">About</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Blog</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Jobs</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Press</Link></li>
              <li><Link href="#" className="text-base text-gray-300 hover:text-accent">Partners</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-base text-gray-400 md:order-1">&copy; 2025 Nova Stream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
