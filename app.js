require('dotenv').config()
const express = require('express');
const app = express();
const port = parseInt(process.env.PORT, 10);
app.set('port', port);
const { generatePDF } = require('./pdfGenerator');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/generate-pdf', async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.query.queryParam1);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});