import { getColorMapping } from './getColorMapping';

const COLUMN_NAMES = ['yourScore', 'yourCompiteiter1', 'yourCompiteiter2'];
const DEFAULT_TEXT_COLOR = 'rgb(15, 42, 61)';
const DEFAULT_BG_COLOR = 'rgb(15, 42, 61)';

export const preprocessDataForColors = (data: any) => {
  Object.keys(data).forEach((key) => {
    const totals = data[key].totals;
    const details = data[key].details;

    COLUMN_NAMES.forEach((column) => {
      totals[`${column}TextColor`] = DEFAULT_TEXT_COLOR;
      totals[`${column}BgColor`] = DEFAULT_BG_COLOR;
    });

    details.forEach((detail: any) => {
      const fields = detail.fields;

      COLUMN_NAMES.forEach((column) => {
        const colorMapping = getColorMapping(fields[column], fields.Name);
        fields[`${column}TextColor`] = colorMapping.textColor;
        fields[`${column}BgColor`] = colorMapping.bgColor;
      });
    });
  });
};
