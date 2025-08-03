#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://127.0.0.1:3001';
const ENV_FILE = path.join(__dirname, '..', '.env.local');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  const icon = status ? '✅' : '❌';
  const statusColor = status ? 'green' : 'red';
  log(`${icon} ${name}`, statusColor);
  if (details) {
    log(`   ${details}`, 'blue');
  }
}

// Test functions
async function testServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(TARGET_URL, (res) => {
      resolve({ success: true, status: res.statusCode });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function testEnvironmentVariables() {
  const required = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET', 
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET'
  ];
  
  const optional = ['GENIUS_ACCESS_TOKEN'];
  
  if (!fs.existsSync(ENV_FILE)) {
    return { 
      success: false, 
      missing: required,
      message: '.env.local file not found' 
    };
  }
  
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  const missing = [];
  const present = [];
  
  required.forEach(key => {
    if (!envContent.includes(key)) {
      missing.push(key);
    } else {
      present.push(key);
    }
  });
  
  optional.forEach(key => {
    if (envContent.includes(key)) {
      present.push(`${key} (optional)`);
    }
  });
  
  return {
    success: missing.length === 0,
    missing,
    present,
    message: missing.length === 0 ? 'All required variables present' : `Missing: ${missing.join(', ')}`
  };
}

async function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = `${TARGET_URL}${path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ 
          success: res.statusCode === expectedStatus,
          status: res.statusCode,
          data: data.substring(0, 200) // First 200 chars
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function testCoreFiles() {
  const coreFiles = [
    'src/app/page.tsx',
    'src/app/api/auth/[...nextauth]/route.ts',
    'src/components/dashboard/Dashboard.tsx',
    'src/hooks/useSpotifyData.ts',
    'src/hooks/useSpotifyPlayer.ts',
    'src/hooks/useContentFiltering.ts',
    'src/lib/filtering/filter-engine.ts',
    'src/lib/spotify/api.ts'
  ];
  
  const results = {};
  
  for (const file of coreFiles) {
    const filePath = path.join(__dirname, '..', file);
    results[file] = fs.existsSync(filePath);
  }
  
  const missing = Object.entries(results)
    .filter(([_, exists]) => !exists)
    .map(([file, _]) => file);
    
  return {
    success: missing.length === 0,
    missing,
    total: coreFiles.length,
    present: coreFiles.length - missing.length
  };
}

async function runMVPTests() {
  log('\n🧪 NILEY MVP READINESS TEST', 'bold');
  log('=====================================', 'blue');
  log(`Testing: ${TARGET_URL}`, 'yellow');
  log('');
  
  // Test 1: Environment Variables
  log('1. Environment Configuration', 'bold');
  const envTest = await testEnvironmentVariables();
  logTest('Environment Variables', envTest.success, envTest.message);
  if (envTest.present && envTest.present.length > 0) {
    log(`   Present: ${envTest.present.join(', ')}`, 'green');
  }
  log('');
  
  // Test 2: Core Files
  log('2. Core Files Check', 'bold');
  const filesTest = await testCoreFiles();
  logTest('Core Files Present', filesTest.success, 
    `${filesTest.present}/${filesTest.total} files found`);
  if (filesTest.missing.length > 0) {
    log(`   Missing: ${filesTest.missing.join(', ')}`, 'red');
  }
  log('');
  
  // Test 3: Server Running
  log('3. Server Status', 'bold');
  const serverTest = await testServerRunning();
  logTest('Server Running', serverTest.success, 
    serverTest.success ? `HTTP ${serverTest.status}` : serverTest.error);
  log('');
  
  if (!serverTest.success) {
    log('⚠️  Server not running. Start with: npm run dev', 'yellow');
    log('   Then run this test again.', 'yellow');
    return;
  }
  
  // Test 4: Core Endpoints
  log('4. Core Endpoints', 'bold');
  
  const mainPageTest = await testEndpoint('/');
  logTest('Main Dashboard', mainPageTest.success, 
    mainPageTest.success ? `HTTP ${mainPageTest.status}` : mainPageTest.error);
  
  const authConfigTest = await testEndpoint('/api/auth/providers');
  logTest('NextAuth Config', authConfigTest.success,
    authConfigTest.success ? 'NextAuth providers endpoint active' : authConfigTest.error);
  
  // Test 5: Spotify Auth Endpoint  
  const spotifyAuthTest = await testEndpoint('/api/auth/signin', 200);
  logTest('Spotify Auth Page', spotifyAuthTest.success,
    spotifyAuthTest.success ? 'Spotify OAuth signin available' : spotifyAuthTest.error);
  
  log('');
  
  // Summary
  log('📋 MVP READINESS SUMMARY', 'bold');
  log('================================', 'blue');
  
  const allTests = [
    envTest.success,
    filesTest.success, 
    serverTest.success,
    mainPageTest.success,
    authConfigTest.success
  ];
  
  const passedTests = allTests.filter(test => test).length;
  const totalTests = allTests.length;
  
  if (passedTests === totalTests) {
    log('🎉 MVP IS READY FOR TESTING!', 'green');
    log('');
    log('Next Steps:', 'bold');
    log('1. Visit: http://127.0.0.1:3001', 'blue');
    log('2. Complete Spotify OAuth flow', 'blue');
    log('3. Test music playback with your Premium account', 'blue');
    log('4. Enable Family Safe Mode and test filtering', 'blue');
  } else {
    log(`❌ ${totalTests - passedTests}/${totalTests} tests failed`, 'red');
    log('');
    log('Required Actions:', 'bold');
    
    if (!envTest.success) {
      log('• Create .env.local with Spotify credentials', 'yellow');
    }
    if (!serverTest.success) {
      log('• Start development server: npm run dev', 'yellow');
    }
    if (!filesTest.success) {
      log('• Check missing core files', 'yellow');
    }
  }
  
  log('');
  log('🔗 Test completed. Visit your app to continue testing!', 'blue');
}

// Run the tests
runMVPTests().catch(err => {
  log(`Test runner error: ${err.message}`, 'red');
  process.exit(1);
}); 