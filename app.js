require('dotenv').config()
const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
// const response = require('./response');
const fs = require('fs');
const app = express();
const port = parseInt(process.env.PORT, 10);
app.set('port', port);

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

function formatNumber(value) {
  if (value >= 1000) {
    const formatted = value / 1000;
    if (formatted % 1 === 0) {
      return `${formatted}k`;
    } else {
      return `${formatted.toFixed(1)}k`;
    }
  }
  return value.toString();
}
function determineColor(scores) {
  const uniqueSortedValues = [...new Set(scores)].sort((a, b) => b - a); // Sort unique values in descending order

  let textColor = {};
  let bgColor = {};

  // For one value, no comparison needed
  if (uniqueSortedValues.length === 1) {
      textColor[uniqueSortedValues[0] || 0] = 'rgb(120, 195, 23)';
      bgColor[uniqueSortedValues[0] || 0] = 'rgb(230, 245, 210)';
  } else if(uniqueSortedValues.length === 2) {
      // For two or more values, use the two colors
      textColor[uniqueSortedValues[0] || 0] = 'rgb(120, 195, 23)';
      bgColor[uniqueSortedValues[0] || 0] = 'rgb(230, 245, 210)';

      textColor[uniqueSortedValues[1] || 0] = 'rgb(221, 21, 59)';
      bgColor[uniqueSortedValues[1] || 0] = 'rgb(255, 204, 214)';
  } else {
    textColor[uniqueSortedValues[0] || 0] = 'rgb(120, 195, 23)',
    textColor[uniqueSortedValues[1] || 0] = 'rgb(255, 190, 0)',
    textColor[uniqueSortedValues[2] || 0] = 'rgb(221, 21, 59)'

    bgColor[uniqueSortedValues[0] || 0] = 'rgb(230, 245, 210)',
    bgColor[uniqueSortedValues[1] || 0] = 'rgb(255, 247, 222)',
    bgColor[uniqueSortedValues[2] || 0] = 'rgb(255, 204, 214)'
  }

  return {
      textColor,
      bgColor
  };
}


function getValue(score) {
  if (typeof score === 'string') {
    switch (score.toLowerCase()) {
      case 'yes':
        return 20;
      case 'partial':
        return 10;
      case 'no':
        return 0;
      default:
        return parseFloat(score) || 0;
    }
  }
  return parseFloat(score) || 0;
}

async function generatePDF(param1) {
  const browser = await puppeteer.launch({
      headless: 'new', 
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  const page = await browser.newPage();
  const apiToken = "patGQPJKwuQOVMt7e.daf4863d4e9da202d66a6756e14c6973131544dc28ecc3b6f2874ee97b83dfc1";

  const apiResponse = await axios.get(`https://api.airtable.com/v0/appudPAXLHOQqak1d/${param1}`, {
  headers: {
    Authorization: `Bearer ${apiToken}`
  }
});
const response = apiResponse.data;

  // const response = await apiResponse.json();

  const companyRecord = response.records.find(item => item.fields.Tags.includes('CompanyName'));
  const {
    yourScore: companyOneName,
    yourCompiteiter1: companyTwoName,
    yourCompiteiter2: companyThreeName
  } = companyRecord.fields || {};

  response.records.forEach(item => {
    const {
        yourScore,
        yourCompiteiter1,
        yourCompiteiter2
    } = item.fields;

    let scores = [];

    if (yourScore !== undefined) {
        scores.push({
            name: 'yourScore',
            value: getValue(yourScore)
        });
    }

    if (yourCompiteiter1 !== undefined) {
        scores.push({
            name: 'yourCompiteiter1',
            value: getValue(yourCompiteiter1)
        });
    }

    if (yourCompiteiter2 !== undefined) {
        scores.push({
            name: 'yourCompiteiter2',
            value: getValue(yourCompiteiter2)
        });
    }

    const {
        textColor,
        bgColor
    } = determineColor(scores.map(s => s.value));

    scores.sort((a, b) => b.value - a.value);

    scores.forEach((score, index) => {
        item.fields[score.name] = formatNumber(score.value);
        item.fields[score.name + 'Color'] = textColor[score.value];
        item.fields[score.name + 'BgColor'] = bgColor[score.value];
    });
});

  const overallPerformance = response.records.find(item => item.fields.Name === "Overall Performance");

  const dataMapping = {
    "Set up": "setUpData",
    "Web Engagement": "webEngagementData",
    "Meta Data Compliance": "metaDataCompliance",
    "Backlink Profile": "backlinkProfileData",
    "Performance score": "performanceScoreData",
    "Usability": "usabilityData",
    "Trust & Authority": "trustData",
    "Social Proofing": "socialProofingData"
  };

  const totalWidth = (() => {
    if (companyOneName && companyTwoName && companyThreeName) {
        return '20%';
    } else if (companyOneName && companyTwoName) {
        return '30%';
    } else {
        return '60%';
    }
})();

  const data = {
    title: "Website health scorecard",
    website: companyOneName,
    companyOneName,
    companyTwoName,
    companyThreeName,
    overallPerformance: overallPerformance,
    totalWidth: totalWidth
  };

  response.records.sort((a, b) => {
    const isMatchA = a.fields.Name && a.fields.Tags.includes(a.fields.Name);
    const isMatchB = b.fields.Name && b.fields.Tags.includes(b.fields.Name);

    if (isMatchA && !isMatchB) return -1;  // a comes first
    if (!isMatchA && isMatchB) return 1;   // b comes first
    return 0;  // keep original order for other cases
});

for (const [tag, propName] of Object.entries(dataMapping)) {
  data[propName] = response.records.filter(item => item.fields.Name && item.fields.Tags.includes(tag));
}

  const templateContent = fs.readFileSync(__dirname + '/template.handlebars', 'utf8');
  const template = Handlebars.compile(templateContent);
  const renderedHtml = template(data);

  await page.setContent(renderedHtml);

  const pdfBuffer = await page.pdf({
    margin: {
      top: '0px',
      right: '0px',
      bottom: '10px',
      left: '0px'
    },
    printBackground: true,
    format: 'A4',
  });

  await browser.close();
  return pdfBuffer;
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});