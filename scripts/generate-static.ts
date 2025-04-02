import Prerenderer from '@prerenderer/prerenderer';
import JSDOMRenderer from '@prerenderer/renderer-jsdom';
import fs from 'fs';
import path from 'path';
import { mockUserProfiles } from '../src/mock/data';

const routes = [
  '/',
  '/explore',
  '/timeline',
  '/create-quest',
  '/escrow-deposit',
  '/my-quests',
  '/connect',
  '/coach-directory',
  '/register-coach',
  '/notifications',
  '/premium'
].concat(
  // Quest routes
  Array.from({ length: 5 }, (_, i) => `/quest/${i + 1}`),
  // Profile routes
  Object.keys(mockUserProfiles).map(username => `/profile/${username}`)
);

async function generateStatic() {
  const prerenderer = new Prerenderer({
    staticDir: path.join(process.cwd(), 'dist'),
    renderer: new JSDOMRenderer({
      renderAfterTime: 5000,
      // Add these options to handle CSS better
      inject: {
        // Disable CSS parsing to avoid JSDOM errors
        disableStyles: true,
        // Add a basic style to ensure content is visible
        head: `
          <style>
            body { visibility: visible !important; }
            * { display: block !important; }
          </style>
        `
      }
    })
  });

  try {
    // Initialize the prerenderer
    await prerenderer.initialize();

    // Read the original index.html
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');

    // Create directories for each route
    for (const route of routes) {
      try {
        const dirPath = path.join(process.cwd(), 'dist', route);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Generate HTML for each route
        const renderedRoute = await prerenderer.renderRoutes([route]);
        
        // Write the HTML file
        const filePath = path.join(dirPath, 'index.html');
        fs.writeFileSync(filePath, renderedRoute[0].html);
        
        console.log(`Generated static page for ${route}`);
      } catch (error) {
        console.error(`Error generating page for ${route}:`, error);
        // Continue with other routes even if one fails
        continue;
      }
    }

    await prerenderer.destroy();
    console.log('Static generation completed successfully');
  } catch (error) {
    console.error('Error during static generation:', error);
    process.exit(1);
  }
}

generateStatic().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 