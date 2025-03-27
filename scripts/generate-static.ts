import Prerenderer from '@prerenderer/prerenderer';
import JSDOMRenderer from '@prerenderer/renderer-jsdom';
import fs from 'fs';
import path from 'path';
import { mockUserProfiles } from '../src/mock/data';

const routes = [
  '/',
  '/explore',
  '/timeline',
  '/create',
  '/escrow-deposit',
  '/my-quests',
  '/connect',
  '/coach-directory',
  '/register-coach',
  '/notifications'
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
      renderAfterTime: 5000
    })
  });

  // Initialize the prerenderer
  await prerenderer.initialize();

  // Read the original index.html
  const indexHtml = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');

  // Create directories for each route
  for (const route of routes) {
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
  }

  await prerenderer.destroy();
}

generateStatic().catch(console.error); 