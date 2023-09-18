const calculateValue = (value) => {
  value = value.toLowerCase(); // Normalize the input value
  switch (value) {
    case "yes":
      return 20;
    case "partial":
      return 10;
    case "no":
      return 5;
    default:
      return isNaN(parseInt(value)) ? 0 : parseInt(value);
  }
};

const computeTotalsForGroupedData = (groupedData) => {
  const groupTotals = {};

  Object.keys(groupedData).forEach((tag) => {
    const items = groupedData[tag];

    // Create a dynamic structure for each tag based on the present columns
    groupTotals[tag] = items.reduce((totals, item) => {
      const presentColumns = [
        "yourScore",
        "yourCompiteiter1",
        "yourCompiteiter2",
      ].filter((column) => item.fields[column] !== undefined);

      // Only perform calculations if there are two or more present columns
      if (presentColumns.length > 1) {
        presentColumns.forEach((column) => {
          const value = item.fields[column] || "";
          const scoreValue = calculateValue(value);
          totals[column] = (totals[column] || 0) + scoreValue;
        });
      }
      return totals;
    }, {});
  });
  return groupTotals;
};

module.exports = { computeTotalsForGroupedData };
