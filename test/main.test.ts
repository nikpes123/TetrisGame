import { beforeAll, afterAll, it, describe, expect } from 'vitest';
import { chromium } from 'playwright';  // Playwright for browser automation
import { exec } from 'child_process';   // To run npm run dev

let browser;
let page;
let devProcess;

beforeAll(async () => {
  try {
    console.log('Starting dev server...');
    devProcess = exec('npm run dev', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error starting the dev server: ${stderr}`);
      } else {
        console.log(`Dev server started: ${stdout}`);
      }
    });

    console.log('Launching browser...');
    browser = await chromium.launch();
    page = await browser.newPage();
    console.log('Navigating to the page...');
    
    await page.goto('http://localhost:5173');  // Correct URL
    await page.waitForSelector('#svgCanvas');  // Wait for canvas element
    console.log('Page loaded and canvas element is visible');
  } catch (error) {
    console.error('Error during beforeAll setup:', error);
  }
});

afterAll(async () => {
  try {
    if (browser) {
      await browser.close();  // Close the browser
    }
    if (devProcess) {
      devProcess.kill();  // Kill the dev server process
    }
  } catch (error) {
    console.error('Error during afterAll cleanup:', error);
  }
});

describe('Tetris Game', () => {
  it('should have a canvas element', async () => {
    console.log('Selecting canvas element...');
    const canvas = await page.$('#svgCanvas');  // Get the canvas element
    expect(canvas).not.toBeNull();               // Check that the canvas exists
  });
});
