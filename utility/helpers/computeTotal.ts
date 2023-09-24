import { DetailsData } from './pdfGenerator';
//my comment
type Column = 'yourScore' | 'yourCompiteiter1' | 'yourCompiteiter2';

type Totals = {
  [column in Column]?: number;
};

type GroupTotals = {
  [tag: string]: Totals;
};

const calculateValue = (inputValue: string) => {
  const normalizedValue = inputValue.toLowerCase();
  switch (normalizedValue) {
    case 'yes':
      return 20;
    case 'partial':
      return 10;
    case 'no':
      return 0;
    default: {
      const parsedValue = parseInt(normalizedValue, 10);
      return isNaN(parsedValue) ? 0 : parsedValue;
    }
  }
};

export const computeTotalsForGroupedData = (groupedData: DetailsData) => {
  const columns = ['yourScore', 'yourCompiteiter1', 'yourCompiteiter2'];

  return Object.entries(groupedData).reduce(
    (groupTotals: GroupTotals, [tag, items]) => {
      groupTotals[tag] = items.reduce((totals, item) => {
        const presentColumns = columns.filter(
          (column) => item.fields[column] !== undefined,
        );

        if (presentColumns.length > 1) {
          presentColumns.forEach((column) => {
            const value = item.fields[column] || '';
            totals[column] = (totals[column] || 0) + calculateValue(value);
          });
        }
        return totals;
      }, {});
      return groupTotals;
    },
    {},
  );
};
