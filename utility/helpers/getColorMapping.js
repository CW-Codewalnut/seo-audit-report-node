const getColorMapping = (value, fieldName = "") => {
    const colorMappings = {
        'Partial': {
            textColor: 'rgb(255, 190, 0)',
            bgColor: 'rgb(255, 247, 222)'
        },
        'Yes': {
            textColor: 'rgb(120, 195, 23)',
            bgColor: 'rgb(230, 245, 210)'
        },
        'No': {
            textColor: 'rgb(221, 21, 59)',
            bgColor: 'rgb(255, 204, 214)'
        },
    };

    if (colorMappings[value]) return colorMappings[value];

    const scoreMapping = (min, mid, max) => {
        if (value < min) return colorMappings['No'];
        if (value >= min && value <= mid) return colorMappings['Partial'];
        return colorMappings['Yes'];
    };

    switch (fieldName) {
        case 'Mobile score':
            return scoreMapping(30, 70, 100);
        case 'Desktop score':
            return scoreMapping(30, 80, 100);
        case 'Accessibility':
            return scoreMapping(70, 90, 100);
        default:
            return {
                textColor: 'rgb(0, 0, 0)',
                bgColor: 'rgb(233, 240, 245)'
            };
    }
};

module.exports = { getColorMapping };