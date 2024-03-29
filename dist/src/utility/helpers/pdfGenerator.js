"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer = __importStar(require("puppeteer"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const groupTableData_1 = require("./groupTableData");
const computeTotal_1 = require("./computeTotal");
const processDataForColor_1 = require("./processDataForColor");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_TOKEN;
const mergeData = (tableTotals, tableData) => {
    const merged = {};
    for (const key in tableTotals) {
        if (Object.prototype.hasOwnProperty.call(tableTotals, key) &&
            Object.prototype.hasOwnProperty.call(tableData, key)) {
            merged[key] = {
                totals: tableTotals[key],
                details: tableData[key],
            };
        }
    }
    return merged;
};
const handleTableData = (response) => {
    const tableData = (0, groupTableData_1.groupTableData)(response);
    const tableTotals = (0, computeTotal_1.computeTotal)(tableData);
    return mergeData(tableTotals, tableData);
};
function generatePDF(param1) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        try {
            browser = yield puppeteer.launch({
                headless: true,
                devtools: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = yield browser.newPage();
            const { data: apiResponse } = yield axios_1.default.get(`${API_BASE_URL}${param1}`, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            });
            const tableData = handleTableData(apiResponse);
            const companyRecord = apiResponse.records.find((item) => item.fields.Tags.includes('CompanyName'));
            const templateData = {
                companyRecord,
                tableData,
            };
            (0, processDataForColor_1.preprocessDataForColors)(templateData.tableData);
            const templatePath = path_1.default.join(__dirname, '..', '..', '..', '..', 'src', 'template.handlebars');
            const templateContent = fs_1.default.readFileSync(templatePath, 'utf8');
            const template = handlebars_1.default.compile(templateContent);
            yield page.setContent(template(templateData));
            const pdfBuffer = yield page.pdf({
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
        }
        catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
        finally {
            if (browser)
                yield browser.close();
        }
    });
}
exports.generatePDF = generatePDF;
