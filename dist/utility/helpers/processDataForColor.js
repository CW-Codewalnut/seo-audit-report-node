"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessDataForColors = void 0;
const getColorMapping_1 = require("./getColorMapping");
// interface DataEntry {
//   totals: {
//     [key: string]: any;
//   };
//   details: any[];
// }
// interface DataType {
//   [key: string]: DataEntry[];
// }
const COLUMN_NAMES = ['yourScore', 'yourCompiteiter1', 'yourCompiteiter2'];
const DEFAULT_TEXT_COLOR = 'rgb(15, 42, 61)';
const DEFAULT_BG_COLOR = 'rgb(15, 42, 61)';
const preprocessDataForColors = (data) => {
    Object.keys(data).forEach((key) => {
        const totals = data[key].totals;
        const details = data[key].details;
        COLUMN_NAMES.forEach((column) => {
            totals[`${column}TextColor`] = DEFAULT_TEXT_COLOR;
            totals[`${column}BgColor`] = DEFAULT_BG_COLOR;
        });
        details.forEach((detail) => {
            const fields = detail.fields;
            COLUMN_NAMES.forEach((column) => {
                const colorMapping = (0, getColorMapping_1.getColorMapping)(fields[column], fields.Name);
                fields[`${column}TextColor`] = colorMapping.textColor;
                fields[`${column}BgColor`] = colorMapping.bgColor;
            });
        });
    });
};
exports.preprocessDataForColors = preprocessDataForColors;
