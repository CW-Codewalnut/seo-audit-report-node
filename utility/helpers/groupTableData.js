const calculateValue = (value) => {
  value = value.toLowerCase();
  switch (value) {
    case "yes":
      return 20;
    case "partial":
      return 10;
    case "no":
      return 5;
    default:
      return value;
  }
};

const groupTableData = (response) => {
  const desiredOrder = [
    "Web Set Up",
    "Web Vitals",
    "Meta Data Compliance",
    "Backlink Profile",
    "Web Performance",
    "Trust & Authority",
    "Social Proofing",
  ];
  const grouped = {};

  desiredOrder.forEach((tag) => {
    grouped[tag] = [];
  });

  response.records.forEach((item) => {
    const tags = item.fields.Tags;
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        // Only add the item if the tag is in desiredOrder
        if (grouped.hasOwnProperty(tag)) {
          if (item.fields.Name === tag) {
            if (item.fields.Compliance) {
              const columnValue = calculateValue(item.fields.Compliance);
              if (!grouped[tag].total) {
                grouped[tag].total = 0;
              }
              grouped[tag].total += columnValue;
            }
            grouped[tag].unshift(item); // Add to the beginning if name matches the tag
          } else {
            grouped[tag].push(item); // Add to the end otherwise
          }
        }
      });
    }
  });
  return grouped;
};

module.exports = { groupTableData };
