'use client';

import { ChevronLeft, ChevronRight, Search, Shield, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  return (
    <div className="relative flex items-center justify-between p-4 bg-[#2d3436]">
      {/* Left: Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#2d3436] border border-gray-700 hover:bg-[#a29bfe]/15 hover:border-[#a29bfe]/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#2d3436] border border-gray-700 hover:bg-[#a29bfe]/15 hover:border-[#a29bfe]/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Center: Absolutely Positioned Search Bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="What do you want to listen to?"
            className="pl-10 bg-white text-black rounded-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
      
      {/* Right: Profile Controls */}
      <div className="flex items-center gap-4">
        <Shield className="h-4 w-4 text-gray-500 opacity-50" />
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-[#2d3436] border border-gray-700 hover:bg-[#a29bfe]/15 hover:border-[#a29bfe]/30"
        >
          <User className="h-4 w-4 mr-2" />
          Profile
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 