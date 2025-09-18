const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting QR Menu Ordering System...');
console.log('Port: 3001');
console.log('');

// Kill any existing processes
console.log('Cleaning up existing processes...');
const killProcess = spawn('pkill', ['-f', 'next dev'], { stdio: 'ignore' });
killProcess.on('close', () => {
  setTimeout(() => {
    console.log('Starting development server...');
    console.log('Open your browser to: http://localhost:3001');
    console.log('');
    console.log('Admin Login:');
    console.log('Email: admin@burgerpalace.com');
    console.log('Password: admin123');
    console.log('');

    // Start the Next.js development server
    const nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    nextProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
    });

    nextProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  }, 2000);
});
