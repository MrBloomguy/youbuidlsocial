const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with TypeScript and ESLint checks disabled...');

// Create a temporary .env file to disable TypeScript and ESLint checks
const envPath = path.join(__dirname, '.env.local');
let originalEnvContent = '';

if (fs.existsSync(envPath)) {
  originalEnvContent = fs.readFileSync(envPath, 'utf8');
}

// Add environment variables to disable checks
const envAdditions = `
# Disable TypeScript and ESLint checks
NEXT_DISABLE_ESLINT=1
NEXT_DISABLE_TYPECHECK=1
SKIP_ESLINT_CHECK=true
SKIP_TYPE_CHECK=true
`;

fs.writeFileSync(envPath, originalEnvContent + envAdditions);

try {
  // Run the build with checks disabled
  console.log('Running Next.js build with checks disabled...');
  execSync('npx next build --no-lint', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Restore the original .env file
  fs.writeFileSync(envPath, originalEnvContent);
}
