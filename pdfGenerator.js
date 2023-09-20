const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const Handlebars = require('handlebars');
const { groupTableData } = require('./utility/helpers/groupTableData');
const {computeTotalsForGroupedData} = require("./utility/helpers/computeTotal");
const {preprocessDataForColors} = require("./utility/helpers/processDataForColor");

const mergeData = (totalsData, detailsData) => {
  const merged = {};
  for (let key in totalsData) {
      merged[key] = {
          totals: totalsData[key],
          details: detailsData[key]
      };
  }
  return merged;
};

const handleTableData = (response) => {
    const tableData = groupTableData(response);
    const tableTotals = computeTotalsForGroupedData(tableData);
    const structuredData = mergeData(tableTotals, tableData)
    return structuredData;
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
  const tableData = handleTableData(response);
  const companyRecord = response.records.find(item => item.fields.Tags.includes('CompanyName'));

  const templateData = {
    companyRecord,
    tableData
  }

  preprocessDataForColors(templateData.tableData, 'tableData');
  
  const templateContent = fs.readFileSync(__dirname + '/template.handlebars', 'utf8');
  const template = Handlebars.compile(templateContent);
  const renderedHtml = template(templateData);
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

module.exports = {generatePDF};