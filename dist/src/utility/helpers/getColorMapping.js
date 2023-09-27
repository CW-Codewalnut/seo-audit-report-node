"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorMapping = void 0;
const getColorMapping = (value, fieldName = '') => {
    const colorMappings = {
        Partial: {
            textColor: 'rgb(255, 190, 0)',
            bgColor: 'rgb(255, 247, 222)',
        },
        Yes: {
            textColor: 'rgb(120, 195, 23)',
            bgColor: 'rgb(230, 245, 210)',
        },
        No: {
            textColor: 'rgb(221, 21, 59)',
            bgColor: 'rgb(255, 204, 214)',
        },
    };
    if (colorMappings[value])
        return colorMappings[value];
    const scoreMapping = (min, mid) => {
        if (value < min)
            return colorMappings['No'];
        if (value >= min && value <= mid)
            return colorMappings['Partial'];
        return colorMappings['Yes'];
    };
    switch (fieldName) {
        case 'Mobile score':
            return scoreMapping(30, 70);
        case 'Desktop score':
            return scoreMapping(30, 80);
        case 'Accessibility':
            return scoreMapping(70, 90);
        default:
            return {
                textColor: 'rgb(0, 0, 0)',
                bgColor: 'rgb(233, 240, 245)',
            };
    }
};
exports.getColorMapping = getColorMapping;
