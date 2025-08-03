'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldX, AlertTriangle, Loader2 } from 'lucide-react';
import { TrackFilterResult } from '@/lib/filtering/filter-engine';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SafetyIndicatorProps {
  filterResult?: TrackFilterResult;
  isAnalyzing?: boolean;
  currentTrack?: {
    name: string;
    artist: string;
  };
  className?: string;
}

type SafetyStatus = 'safe' | 'blocked' | 'analyzing' | 'unknown' | 'error';

export default function SafetyIndicator({ 
  filterResult, 
  isAnalyzing = false,
  currentTrack,
  className = "" 
}: SafetyIndicatorProps) {
  const [lastAction, setLastAction] = useState<string>('');

  // Determine safety status
  const getSafetyStatus = (): SafetyStatus => {
    if (isAnalyzing) return 'analyzing';
    if (!filterResult) return 'unknown';
    if (filterResult.shouldBlock) return 'blocked';
    if (filterResult.hasLyrics) return 'safe';
    return 'unknown';
  };

  const status = getSafetyStatus();

  // Update last action when filter result changes
  useEffect(() => {
    if (filterResult && currentTrack) {
      if (filterResult.shouldBlock) {
        setLastAction(`Blocked: ${currentTrack.artist} - ${currentTrack.name}`);
      } else {
        setLastAction(`Safe: ${currentTrack.artist} - ${currentTrack.name}`);
      }
    }
  }, [filterResult, currentTrack]);

  // Get icon and styling based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'safe':
        return <ShieldCheck className="h-4 w-4 text-green-600" />;
      case 'blocked':
        return <ShieldX className="h-4 w-4 text-red-600" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'unknown':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <Shield className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'analyzing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unknown':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return 'Family Safe';
      case 'blocked':
        return 'Content Blocked';
      case 'analyzing':
        return 'Analyzing...';
      case 'unknown':
        return 'Unknown Content';
      case 'error':
        return 'Analysis Error';
      default:
        return 'No Filter';
    }
  };

  const getTooltipContent = () => {
    if (!filterResult) {
      return 'No content analysis available';
    }

    const flaggedCount = filterResult.filterResult?.flaggedWords?.length || 0;

    return (
      <div className="space-y-2 max-w-xs">
        <div className="font-semibold">{getStatusText()}</div>
        
        {filterResult.reason && (
          <div className="text-sm">
            <strong>Reason:</strong> {filterResult.reason}
          </div>
        )}
        
        <div className="text-sm">
          <strong>Confidence:</strong> {Math.round(filterResult.confidence * 100)}%
        </div>
        
        {filterResult.hasLyrics ? (
          <div className="text-xs text-green-600">✓ Lyrics analyzed</div>
        ) : (
          <div className="text-xs text-yellow-600">⚠ No lyrics found</div>
        )}
        
        {flaggedCount > 0 && (
          <div className="text-xs">
            <strong>Flagged content:</strong> {flaggedCount} items
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Main Status Indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1.5 px-3 py-1 cursor-help ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="text-xs font-medium">{getStatusText()}</span>
              
              {/* Confidence indicator for blocked content */}
              {status === 'blocked' && filterResult && (
                <span className="text-xs opacity-75">
                  ({Math.round(filterResult.confidence * 100)}%)
                </span>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>

        {/* Last Action Indicator */}
        {lastAction && status !== 'analyzing' && (
          <div className="text-xs text-gray-500 max-w-48 truncate">
            {lastAction}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 