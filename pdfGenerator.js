const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const Handlebars = require('handlebars');
const { groupTableData } = require('./utility/helpers/groupTableData');
const {computeTotalsForGroupedData} = require("./utility/helpers/computeTotal");
const { preprocessDataForColors } = require("./utility/helpers/processDataForColor");

const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_TOKEN;

const mergeData = (totalsData, detailsData) => {
  const merged = {};
  for (const key in totalsData) {
    if (totalsData.hasOwnProperty(key)) {
      merged[key] = {
        totals: totalsData[key],
        details: detailsData[key]
      };
    }
  }
  return merged;
};

const handleTableData = (response) => {
  const tableData = groupTableData(response);
  const tableTotals = computeTotalsForGroupedData(tableData);
  return mergeData(tableTotals, tableData);
}

async function generatePDF(param1) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const { data: apiResponse } = await axios.get(`${API_BASE_URL}${param1}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      }
    });

    const tableData = handleTableData(apiResponse);
    const companyRecord = apiResponse.records.find(item => item.fields.Tags.includes('CompanyName'));

    const templateData = {
      companyRecord,
      tableData
    };

    preprocessDataForColors(templateData.tableData);

    const templateContent = fs.readFileSync(__dirname + '/template.handlebars', 'utf8');
    const template = Handlebars.compile(templateContent);
    await page.setContent(template(templateData));

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

    return pdfBuffer;

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;

  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generatePDF };