"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTableData = void 0;
const groupTableData = (response) => {
    const desiredOrder = [
        'Web Set Up',
        'Web Vitals',
        'Meta Data Compliance',
        'Backlink Profile',
        'Web Performance',
        'Trust & Authority',
        'Social Proofing',
    ];
    const grouped = {};
    desiredOrder.forEach((tag) => {
        grouped[tag] = [];
    });
    response.records.forEach((record) => {
        const tags = record.fields.Tags;
        if (tags && tags.length > 0) {
            tags.forEach((tag) => {
                if (Object.prototype.hasOwnProperty.call(grouped, tag)) {
                    if (record.fields.Name === tag) {
                        grouped[tag].unshift(record);
                    }
                    else {
                        grouped[tag].push(record);
                    }
                }
            });
        }
    });
    return grouped;
};
exports.groupTableData = groupTableData;
