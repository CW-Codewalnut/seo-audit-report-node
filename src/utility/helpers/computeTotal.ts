import { GroupedData } from '../types/apiTypes';

export interface ComputationResult {
  [key: string]: {
    yourScore?: number;
    yourCompiteiter1?: number;
    yourCompiteiter2?: number;
  };
}

interface Totals {
  [column: string]: number;
}

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

export const computeTotal = (groupedData: GroupedData) => {
  const columns = ['yourScore', 'yourCompiteiter1', 'yourCompiteiter2'];

  return Object.entries(groupedData).reduce<ComputationResult>(
    (groupTotals, [tag, items]) => {
      groupTotals[tag] = items.reduce<Totals>((totals, item) => {
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
