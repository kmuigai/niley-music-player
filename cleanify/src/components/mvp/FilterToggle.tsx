'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Shield, ShieldCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { FILTER_LEVELS } from '@/lib/filtering/word-lists';
import { FilterSettings } from '@/lib/filtering/filter-engine';

interface FilterToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  filterSettings: FilterSettings;
  onSettingsChange: (settings: FilterSettings) => void;
  className?: string;
}

export default function FilterToggle({ 
  isEnabled, 
  onToggle, 
  filterSettings,
  onSettingsChange,
  className = "" 
}: FilterToggleProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleLevelChange = (level: string) => {
    onSettingsChange({
      ...filterSettings,
      level: level as keyof typeof FILTER_LEVELS
    });
  };

  const handleStrictModeChange = (strict: boolean) => {
    onSettingsChange({
      ...filterSettings,
      strictMode: strict
    });
  };

  const currentLevel = FILTER_LEVELS[filterSettings.level];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Main Toggle */}
      <div className="flex items-center gap-2">
        {isEnabled ? (
          <ShieldCheck className="h-5 w-5 text-green-600" />
        ) : (
          <Shield className="h-5 w-5 text-gray-400" />
        )}
        
        <div className="flex flex-col">
          <span className="text-sm font-medium">Family Safe Mode</span>
          <span className="text-xs text-gray-500">
            {isEnabled ? `Active - ${currentLevel.name}` : 'Disabled'}
          </span>
        </div>
        
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-green-600"
        />
      </div>

      {/* Settings Button */}
      {isEnabled && (
        <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-purple-100"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Filter Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Filter Level Selection */}
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Filter Level
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup 
              value={filterSettings.level} 
              onValueChange={handleLevelChange}
            >
              {Object.entries(FILTER_LEVELS).map(([key, level]) => (
                <DropdownMenuRadioItem key={key} value={key} className="flex flex-col items-start py-3">
                  <div className="font-medium">{level.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Strictness: {level.strictness}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />
            
            {/* Advanced Options */}
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Advanced Options
            </DropdownMenuLabel>
            
            <div className="p-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Strict Mode</span>
                                 <Switch
                   checked={filterSettings.strictMode}
                   onCheckedChange={handleStrictModeChange}
                 />
              </div>
              <p className="text-xs text-gray-500">
                When enabled, context-sensitive words are always blocked
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Block Unknown</span>
                                 <Switch
                   checked={filterSettings.blockUnknown}
                   onCheckedChange={(checked: boolean) => 
                     onSettingsChange({ ...filterSettings, blockUnknown: checked })
                   }
                 />
              </div>
              <p className="text-xs text-gray-500">
                Block songs when lyrics cannot be found
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
} 