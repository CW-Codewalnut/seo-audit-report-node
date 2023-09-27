import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { generatePDF } from './src/utility/helpers/pdfGenerator';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.set('port', port);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/generate-pdf', async (req: Request, res: Response) => {
  try {
    const queryParam1: string = req.query.queryParam1 as string;
    const pdfBuffer = await generatePDF(queryParam1);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${queryParam1}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
