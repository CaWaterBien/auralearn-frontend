#!/usr/bin/env node
/**
 * Set Vercel Environment Variables
 * This script sets environment variables for your Vercel project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Environment variables to set
const envVars = {
  'NEXT_PUBLIC_API_BASE': 'https://limitless-caverns-03788-f84f5932a44c.herokuapp.com',
  'NEXT_PUBLIC_ADMIN_API_BASE': 'https://limitless-caverns-03788-f84f5932a44c.herokuapp.com',
  'NEXT_PUBLIC_USER_API_BASE': 'https://limitless-caverns-03788-f84f5932a44c.herokuapp.com',
  'NEXT_PUBLIC_APP_NAME': 'AuraLearn'
};

const environments = ['production', 'preview', 'development'];

console.log('🚀 Setting up Vercel environment variables...\n');

// Read .vercel/project.json to get project info
const vercelProjectPath = path.join(__dirname, '.vercel', 'project.json');
let projectId, orgId;

if (fs.existsSync(vercelProjectPath)) {
  const projectData = JSON.parse(fs.readFileSync(vercelProjectPath, 'utf8'));
  projectId = projectData.projectId;
  orgId = projectData.orgId;
  console.log(`📦 Project: ${projectId}`);
  console.log(`🏢 Organization: ${orgId}\n`);
} else {
  console.log('⚠️  .vercel/project.json not found. Make sure you have run: vercel link\n');
  process.exit(1);
}

// Set each environment variable
let successCount = 0;
let errorCount = 0;

for (const [key, value] of Object.entries(envVars)) {
  console.log(`Setting ${key}...`);
  
  for (const env of environments) {
    try {
      // Use vercel env add with the value piped in
      const command = `echo "${value}" | vercel env add ${key} ${env} --force`;
      execSync(command, { 
        stdio: 'pipe',
        encoding: 'utf8',
        shell: true,
        cwd: __dirname
      });
      console.log(`  ✅ Added to ${env}`);
      successCount++;
    } catch (error) {
      // Check if it's because the variable already exists
      if (error.message.includes('already exists') || error.stdout?.includes('already exists')) {
        console.log(`  ⚠️  Already exists in ${env}, updating...`);
        // Try to remove and re-add
        try {
          execSync(`vercel env rm ${key} ${env} --yes`, { stdio: 'pipe', shell: true, cwd: __dirname });
          execSync(`echo "${value}" | vercel env add ${key} ${env} --force`, { 
            stdio: 'pipe', 
            shell: true, 
            cwd: __dirname 
          });
          console.log(`  ✅ Updated in ${env}`);
          successCount++;
        } catch (updateError) {
          console.log(`  ⚠️  Could not update in ${env}, may need manual update`);
          errorCount++;
        }
      } else {
        console.log(`  ❌ Error adding to ${env}: ${error.message}`);
        errorCount++;
      }
    }
  }
  console.log('');
}

console.log(`\n✅ Setup complete!`);
console.log(`   Success: ${successCount} variables set`);
if (errorCount > 0) {
  console.log(`   Errors: ${errorCount} variables failed`);
  console.log(`\n⚠️  Some variables may need to be set manually in Vercel dashboard.`);
}

console.log(`\n🚀 Deploying to Vercel...\n`);

try {
  execSync('vercel --prod --yes', { stdio: 'inherit', shell: true, cwd: __dirname });
  console.log('\n✅ Deployment complete!');
  console.log('🌐 Your app should be live at: https://capstone-app-lyart.vercel.app\n');
} catch (error) {
  console.log('\n❌ Deployment failed. Please check the error above.');
  process.exit(1);
}

