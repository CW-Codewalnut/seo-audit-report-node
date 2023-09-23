const calculateValue = (inputValue) => {
    const normalizedValue = inputValue.toLowerCase();
    switch (normalizedValue) {
        case 'yes':
            return 20;
        case 'partial':
            return 10;
        case 'no':
            return 0;
        default:
            const parsedValue = parseInt(normalizedValue, 10);
            return isNaN(parsedValue) ? 0 : parsedValue;
    }
};

const computeTotalsForGroupedData = (groupedData) => {
    const columns = ["yourScore", "yourCompiteiter1", "yourCompiteiter2"];

    return Object.entries(groupedData).reduce((groupTotals, [tag, items]) => {
        groupTotals[tag] = items.reduce((totals, item) => {
            const presentColumns = columns.filter(column => item.fields[column] !== undefined);
            
            if (presentColumns.length > 1) {
                presentColumns.forEach(column => {
                    const value = item.fields[column] || "";
                    totals[column] = (totals[column] || 0) + calculateValue(value);
                });
            }       
            return totals;
        }, {});
        return groupTotals;
    }, {});
};

module.exports = { computeTotalsForGroupedData };
