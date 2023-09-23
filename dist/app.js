"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const pdfGenerator_1 = require("./utility/helpers/pdfGenerator");
dotenv_1.default.config();
console.log('--->', process.env.PORT);
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/generate-pdf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryParam1 = req.query.queryParam1;
        const pdfBuffer = yield (0, pdfGenerator_1.generatePDF)(queryParam1);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${queryParam1}.pdf`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
}));
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});
