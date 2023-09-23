import dotenv from 'dotenv';
import * as puppeteer from 'puppeteer';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import Handlebars from 'handlebars';
import { groupTableData } from './groupTableData';
import { computeTotalsForGroupedData } from './computeTotal';
import { preprocessDataForColors } from './processDataForColor';
import path from 'path';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_TOKEN;

type ApiRecord = {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    yourScore?: string | number;
    yourCompiteiter1?: string | number;
    yourCompiteiter2?: string | number;
    Tags: string[];
  };
};

export type ApiResponse = ApiRecord[];

type ScoreDetails = {
  yourScore: number | string;
  yourCompiteiter1: number | string;
  yourCompiteiter2: number | string;
};

export type TotalsData = {
  [category: string]: ScoreDetails;
};

export type DetailsData = {
  [category: string]: any[];
};

export type MergedEntry = {
  totals: any;
  details: DetailsData[];
};

type MergedData = Record<string, MergedEntry>;

const mergeData = (tableTotals: any, tableData: DetailsData) => {
  const merged: MergedData = {};

  for (const key in tableTotals) {
    if (
      Object.prototype.hasOwnProperty.call(tableTotals, key) &&
      Object.prototype.hasOwnProperty.call(tableData, key)
    ) {
      merged[key] = {
        totals: tableTotals[key],
        details: tableData[key],
      };
    }
  }

  return merged;
};

const handleTableData = (response: ApiResponse): MergedData => {
  const tableData = groupTableData(response);
  const tableTotals = computeTotalsForGroupedData(tableData);
  return mergeData(tableTotals, tableData);
};

export async function generatePDF(param1: string): Promise<Buffer> {
  let browser: puppeteer.Browser | undefined;
  try {
    browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const { data: apiResponse }: AxiosResponse = await axios.get(
      `${API_BASE_URL}${param1}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );
    const tableData = handleTableData(apiResponse?.records);
    const companyRecord = apiResponse.records.find((item: ApiRecord) =>
      item.fields.Tags.includes('CompanyName'),
    );

    const templateData = {
      companyRecord,
      tableData,
    };

    preprocessDataForColors(templateData.tableData);
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'template.handlebars',
    );
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    await page.setContent(template(templateData));

    const pdfBuffer = await page.pdf({
      margin: {
        top: '0px',
        right: '0px',
        bottom: '10px',
        left: '0px',
      },
      printBackground: true,
      format: 'A4',
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
