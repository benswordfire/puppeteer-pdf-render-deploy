import 'dotenv/config';
import express, { Request, Response } from 'express';
import { launchBrowser } from './browser.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (request: Request, response: Response) => {
  response.json({
    msg: "hello, world"
  });
});

app.get('/pdf', async (request: Request, response: Response) => {
  try {
    const browser = await launchBrowser();

    const page = await browser.newPage();

    await page.setContent("<h1>Hello World</h1>", { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf();

    await browser.close();

    response.set ({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment'
    });

    response.send(pdfBuffer)
  } catch (error) {
    console.error(error);
    response.send('Failed to generate PDF');
  }
});

app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
});