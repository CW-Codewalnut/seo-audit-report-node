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
    response.forEach((item) => {
        const tags = item.fields.Tags;
        if (tags && tags.length > 0) {
            tags.forEach((tag) => {
                if (Object.prototype.hasOwnProperty.call(grouped, tag)) {
                    if (item.fields.Name === tag) {
                        grouped[tag].unshift(item);
                    }
                    else {
                        grouped[tag].push(item);
                    }
                }
            });
        }
    });
    return grouped;
};
exports.groupTableData = groupTableData;
