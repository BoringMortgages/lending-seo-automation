import { execSync } from 'child_process';

async function deploy() {
  try {
    console.log('🚀 Starting deployment process...');
    
    // Generate latest keyword data
    console.log('📊 Updating keyword research...');
    execSync('node scripts/scrape-competitors.js', { stdio: 'inherit' });
    execSync('node scripts/enhance-keywords.js', { stdio: 'inherit' });
    
    // Generate pages
    console.log('📄 Generating landing pages...');
    execSync('node scripts/generate-pages.js', { stdio: 'inherit' });
    
    // Generate sitemap
    console.log('🗺️ Creating sitemap...');
    execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
    
    // Deploy to Vercel
    console.log('☁️ Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });
    
    console.log('✅ Deployment complete!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
