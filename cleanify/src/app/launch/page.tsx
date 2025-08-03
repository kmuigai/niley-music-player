'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  TestTube2, 
  Bug, 
  Rocket, 
  Video, 
  FileText, 
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';

const DAY_5_TASKS = [
  {
    id: 'testing',
    title: '🧪 Filter Testing',
    description: 'Test filtering with variety of content (explicit vs clean songs)',
    action: 'Go to Test Suite',
    link: '/test',
    icon: <TestTube2 className="w-5 h-5" />,
    status: 'in_progress'
  },
  {
    id: 'bug-fixes',
    title: '🐛 Bug Fixes',
    description: 'Fix critical bugs and performance issues',
    action: 'Review Issues',
    link: '#',
    icon: <Bug className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'deploy',
    title: '🚀 Deploy to Production',
    description: 'Deploy to Vercel with environment variables',
    action: 'Deploy Now',
    link: 'https://vercel.com',
    icon: <Rocket className="w-5 h-5" />,
    external: true,
    status: 'pending'
  },
  {
    id: 'demo-video',
    title: '🎥 Demo Video',
    description: 'Create demo video showing filtering in action',
    action: 'Record Demo',
    link: '#',
    icon: <Video className="w-5 h-5" />,
    status: 'pending'
  },
  {
    id: 'landing-page',
    title: '📄 Landing Page',
    description: 'Write simple landing page explaining the product',
    action: 'Create Page',
    link: '#',
    icon: <FileText className="w-5 h-5" />,
    status: 'pending'
  }
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-[#2d3436] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🚀 Day 5: Launch Preparation</h1>
          <p className="text-xl text-gray-400 mb-6">
            Final testing, deployment, and launch materials for your family-safe music player
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-500">4</div>
              <div className="text-sm text-gray-400">Days Complete</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-500">1</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-500">4</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DAY_5_TASKS.map((task) => (
            <Card key={task.id} className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {task.icon}
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {task.status.replace('_', ' ')}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{task.description}</p>

              {task.link !== '#' ? (
                task.external ? (
                  <a 
                    href={task.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Button variant="outline" className="w-full">
                      {task.action}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                ) : (
                  <Link href={task.link}>
                    <Button variant="outline" className="w-full">
                      {task.action}
                    </Button>
                  </Link>
                )
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  {task.action}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start">
                ← Back to Dashboard
              </Button>
            </Link>
            <Link href="/test">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                🧪 Start Testing Suite
              </Button>
            </Link>
          </div>
        </div>

        {/* MVP Status */}
        <div className="mt-8 bg-green-900/20 border border-green-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">✅ MVP Status: Ready for Launch!</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">✅ Completed Features:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Spotify Integration & Authentication</li>
                <li>• Real Music Playback</li>
                <li>• Lyrics Analysis & Filtering</li>
                <li>• Family Safe Mode Toggle</li>
                <li>• Auto-Skip Explicit Content</li>
                <li>• Real-time Safety Indicators</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">🎯 Launch Checklist:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Test with variety of content</li>
                <li>• Fix any critical bugs</li>
                <li>• Deploy to production</li>
                <li>• Create demo video</li>
                <li>• Write landing page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 