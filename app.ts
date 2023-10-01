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
    const companyName: string = req.query.companyName as string;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    // Create the desired filename
    const fileName = `${companyName}_${formattedDate}.pdf`;

    const pdfBuffer = await generatePDF(companyName);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
