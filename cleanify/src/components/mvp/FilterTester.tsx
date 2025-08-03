'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { FilterEngine } from '@/lib/filtering/filter-engine';
import { FILTER_LEVELS } from '@/lib/filtering/word-lists';

// Test tracks with known explicit content for testing
const TEST_TRACKS = {
  explicit: [
    { artist: 'Eminem', title: 'The Real Slim Shady', expected: 'blocked' },
    { artist: 'Cardi B', title: 'WAP', expected: 'blocked' },
    { artist: 'N.W.A', title: 'F*** Tha Police', expected: 'blocked' },
    { artist: 'Lil Wayne', title: 'A Milli', expected: 'blocked' },
  ],
  clean: [
    { artist: 'Taylor Swift', title: 'Shake It Off', expected: 'safe' },
    { artist: 'Ed Sheeran', title: 'Perfect', expected: 'safe' },
    { artist: 'Adele', title: 'Hello', expected: 'safe' },
    { artist: 'The Beatles', title: 'Here Comes The Sun', expected: 'safe' },
  ],
  borderline: [
    { artist: 'Maroon 5', title: 'Animals', expected: 'depends' },
    { artist: 'The Weeknd', title: 'Can\'t Feel My Face', expected: 'depends' },
    { artist: 'Ariana Grande', title: 'Side to Side', expected: 'depends' },
  ]
};

interface TestResult {
  track: any;
  result: any;
  status: 'pass' | 'fail' | 'pending' | 'error';
  timing: number;
}

export default function FilterTester() {
  const [testResults, setTestResults] = useState<Record<string, TestResult[]>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof FILTER_LEVELS>('family-friendly');
  const [filterEngine] = useState(() => new FilterEngine());

  const runTestSuite = async (category: keyof typeof TEST_TRACKS) => {
    setIsRunning(true);
    const tracks = TEST_TRACKS[category];
    const results: TestResult[] = [];

    setTestResults(prev => ({ ...prev, [category]: [] }));

    for (const track of tracks) {
      const startTime = Date.now();
      
      try {
        // Update test result to pending
        const pendingResult: TestResult = {
          track,
          result: null,
          status: 'pending',
          timing: 0
        };
        
        setTestResults(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), pendingResult]
        }));

        // Run the actual filter test
                 const filterResult = await filterEngine.shouldBlockTrack(
           `test-${Date.now()}`,
           track.title,
           track.artist,
           {
             level: selectedLevel,
             strictMode: selectedLevel === 'squeaky-clean',
             blockUnknown: true,
             minConfidence: selectedLevel === 'squeaky-clean' ? 0.5 : selectedLevel === 'family-friendly' ? 0.7 : 0.8
           }
         );

        const timing = Date.now() - startTime;
        
        // Determine if test passed
        let status: 'pass' | 'fail' = 'pass';
        if (track.expected === 'blocked' && !filterResult.shouldBlock) status = 'fail';
        if (track.expected === 'safe' && filterResult.shouldBlock) status = 'fail';

        const result: TestResult = {
          track,
          result: filterResult,
          status,
          timing
        };

        results.push(result);
        
        // Update results
        setTestResults(prev => ({
          ...prev,
          [category]: prev[category].map((r, i) => 
            i === results.length - 1 ? result : r
          )
        }));

      } catch (error) {
        const result: TestResult = {
          track,
          result: { error: error instanceof Error ? error.message : 'Unknown error' },
          status: 'error',
          timing: Date.now() - startTime
        };
        
        results.push(result);
        setTestResults(prev => ({
          ...prev,
          [category]: prev[category].map((r, i) => 
            i === results.length - 1 ? result : r
          )
        }));
      }
    }

    setIsRunning(false);
  };

  const runAllTests = async () => {
    for (const category of Object.keys(TEST_TRACKS) as (keyof typeof TEST_TRACKS)[]) {
      await runTestSuite(category);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (result: TestResult) => {
    if (result.status === 'pending') return <Badge variant="outline">Testing...</Badge>;
    if (result.status === 'error') return <Badge variant="destructive">Error</Badge>;
    
    const shouldBlock = result.result?.shouldBlock;
    if (shouldBlock) {
      return <Badge variant="destructive">Blocked ({result.result.confidence?.toFixed(2)})</Badge>;
    } else {
      return <Badge variant="secondary">Safe ({result.result?.confidence?.toFixed(2)})</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 Filter Testing Suite</h2>
        <p className="text-gray-400 mb-4">
          Test your family-safe filtering with known explicit and clean content
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value as keyof typeof FILTER_LEVELS)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
          >
            {Object.keys(FILTER_LEVELS).map(level => (
              <option key={level} value={level}>
                {level.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="explicit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="explicit" className="text-white">Explicit Content</TabsTrigger>
          <TabsTrigger value="clean" className="text-white">Clean Content</TabsTrigger>
          <TabsTrigger value="borderline" className="text-white">Borderline Content</TabsTrigger>
        </TabsList>

        {Object.entries(TEST_TRACKS).map(([category, tracks]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white capitalize">
                {category} Songs ({tracks.length} tracks)
              </h3>
              <Button 
                onClick={() => runTestSuite(category as keyof typeof TEST_TRACKS)}
                disabled={isRunning}
                variant="outline"
              >
                Test {category}
              </Button>
            </div>

            <div className="grid gap-3">
              {tracks.map((track, index) => {
                const result = testResults[category]?.[index];
                
                return (
                  <Card key={`${track.artist}-${track.title}`} className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">
                          {track.title} - {track.artist}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Expected: {track.expected}
                          {result?.timing && ` • ${result.timing}ms`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {result && getStatusBadge(result)}
                        {result && getStatusIcon(result.status)}
                      </div>
                    </div>
                    
                    {result?.result?.reason && (
                      <p className="text-xs text-gray-500 mt-2">
                        Reason: {result.result.reason}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 