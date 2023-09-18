const preprocessDataForColors = (data, type = "body") => {
  const getHeaderColorMapping = (values) => {
    const filteredValues = values.filter((v) => v !== undefined && v !== null);
    if (filteredValues.length === 0) {
      return {
        [filteredValues[0]]: {
          textColor: "#fff",
          bgColor: "rgb(15, 42, 61)",
        },
      };
    }

    if (filteredValues.length === 2) {
      const maxVal = Math.max(...filteredValues);
      const minVal = Math.min(...filteredValues);
      return {
        [maxVal]: {
          textColor: "#fff",
          bgColor: "rgb(120, 195, 23)",
        },
        [minVal]: {
          textColor: "#fff",
          bgColor: "rgb(221, 21, 59)",
        },
      };
    }

    const uniqueSortedValues = values.sort((a, b) => b - a);
    return {
      [uniqueSortedValues[0] || 0]: {
        textColor: "#fff",
        bgColor: "rgb(120, 195, 23)",
      },
      [uniqueSortedValues[1] || 0]: {
        textColor: "#fff",
        bgColor: "rgb(255, 190, 0)",
      },
      [uniqueSortedValues[2] || 0]: {
        textColor: "#fff",
        bgColor: "rgb(221, 21, 59)",
      },
    };
  };

  const getBodyColorMapping = (values, fieldName = "") => {
    const filteredValues = values.filter((v) => v !== undefined && v !== null);

    if (filteredValues.length === 1) {
      if (filteredValues[0] === "Partial" || filteredValues[0] === "partial") {
        return {
          [filteredValues[0]]: {
            textColor: "rgb(255, 190, 0)",
            bgColor: "rgb(255, 247, 222)",
          },
        };
      } else if (filteredValues[0] === "No" || filteredValues[0] === "no") {
        return {
          [filteredValues[0]]: {
            textColor: "rgb(221, 21, 59)",
            bgColor: "rgb(255, 204, 214)",
          },
        };
      } else if (filteredValues[0] === "Yes" || filteredValues[0] === "yes") {
        return {
          [filteredValues[0]]: {
            textColor: "rgb(120, 195, 23)",
            bgColor: "rgb(230, 245, 210)",
          },
        };
      } else if (fieldName === "# Broken backlinks") {
        if (filteredValues[0] >= 100) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(221, 21, 59)",
              bgColor: "rgb(255, 204, 214)",
            },
          };
        }
      } else if (fieldName === "Mobile score") {
        if (filteredValues[0] < 30) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(221, 21, 59)",
              bgColor: "rgb(255, 204, 214)",
            },
          };
        } else if (filteredValues[0] >= 30 && filteredValues[0] <= 70) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(255, 190, 0)",
              bgColor: "rgb(255, 247, 222)",
            },
          };
        } else {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(120, 195, 23)",
              bgColor: "rgb(230, 245, 210)",
            },
          };
        }
      } else if (fieldName === "Desktop score") {
        if (filteredValues[0] < 30) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(221, 21, 59)",
              bgColor: "rgb(255, 204, 214)",
            },
          };
        } else if (filteredValues[0] >= 30 && filteredValues[0] <= 80) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(255, 190, 0)",
              bgColor: "rgb(255, 247, 222)",
            },
          };
        } else {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(120, 195, 23)",
              bgColor: "rgb(230, 245, 210)",
            },
          };
        }
      } else if (fieldName === "Accessibility") {
        if (filteredValues[0] < 70) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(221, 21, 59)",
              bgColor: "rgb(255, 204, 214)",
            },
          };
        } else if (filteredValues[0] >= 70 && filteredValues[0] <= 90) {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(255, 190, 0)",
              bgColor: "rgb(255, 247, 222)",
            },
          };
        } else {
          return {
            [filteredValues[0]]: {
              textColor: "rgb(120, 195, 23)",
              bgColor: "rgb(230, 245, 210)",
            },
          };
        }
      }

      return {
        [filteredValues[0]]: {
          textColor: "rgb(0, 0, 0)",
          bgColor: "rgb(233, 240, 245)",
        },
      };
    }

    if (filteredValues.length === 2) {
      let colorMapping = {};
      const containsYes =
        filteredValues.includes("Yes") || filteredValues.includes("yes");
      const containsNo =
        filteredValues.includes("No") || filteredValues.includes("no");
      const containsPartial =
        filteredValues.includes("Partial") ||
        filteredValues.includes("partial");

      if (containsYes || containsNo || containsPartial) {
        if (containsYes) {
          colorMapping = {
            Yes: {
              textColor: "rgb(120, 195, 23)",
              bgColor: "rgb(230, 245, 210)",
            },
          };
        }

        if (containsNo) {
          colorMapping = {
            No: {
              textColor: "rgb(221, 21, 59)",
              bgColor: "rgb(255, 204, 214)",
            },
          };
        }

        if (containsPartial) {
          colorMapping = {
            Partial: {
              textColor: "rgb(255, 190, 0)",
              bgColor: "rgb(255, 247, 222)",
            },
          };
        }

        return colorMapping;
      }

      const maxVal = Math.max(...filteredValues);
      const minVal = Math.min(...filteredValues);
      return {
        [maxVal]: {
          textColor: "rgb(120, 195, 23)",
          bgColor: "rgb(230, 245, 210)",
        },
        [minVal]: {
          textColor: "rgb(221, 21, 59)",
          bgColor: "rgb(255, 204, 214)",
        },
      };
    }

    const uniqueSortedValues = values.sort((a, b) => b - a);

    return {
      [uniqueSortedValues[0] || 0]: {
        textColor: "rgb(120, 195, 23)",
        bgColor: "rgb(230, 245, 210)",
      },
      [uniqueSortedValues[1] || 0]: {
        textColor: "rgb(255, 190, 0)",
        bgColor: "rgb(255, 247, 222)",
      },
      [uniqueSortedValues[2] || 0]: {
        textColor: "rgb(221, 21, 59)",
        bgColor: "rgb(255, 204, 214)",
      },
    };
  };
  if (type === "tableData") {
    Object.keys(data).forEach((key) => {
      const totals = data[key].totals;
      const details = data[key].details;

      // Process totals
      const totalsColorsMapping = getHeaderColorMapping(Object.values(totals));

      ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach(
        (column) => {
          if (totalsColorsMapping[totals[column]]) {
            totals[`${column}TextColor`] =
              totalsColorsMapping[totals[column]].textColor;
            totals[`${column}BgColor`] =
              totalsColorsMapping[totals[column]].bgColor;
          }
        },
      );

      // Process details
      details.forEach((detail) => {
        const fields = detail.fields;
        const detailColorsMapping = getBodyColorMapping(
          [
            fields?.yourScore,
            fields?.yourCompiteiter1,
            fields?.yourCompiteiter2,
          ],
          fields.Name,
        );

        ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach(
          (column) => {
            if (detailColorsMapping[fields[column]]) {
              fields[`${column}TextColor`] =
                detailColorsMapping[fields[column]].textColor;
              fields[`${column}BgColor`] =
                detailColorsMapping[fields[column]].bgColor;
            }
          },
        );
      });
    });
  } else {
    const totalsColorsMapping = getHeaderColorMapping([
      parseInt(data.fields.yourScore, 10),
      parseInt(data.fields.yourCompiteiter1, 10),
      parseInt(data.fields.yourCompiteiter2, 10),
    ]);

    ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach((column) => {
      if (totalsColorsMapping[data.fields[column]]) {
        data.fields[`${column}TextColor`] =
          totalsColorsMapping[data.fields[column]].textColor;
        data.fields[`${column}BgColor`] =
          totalsColorsMapping[data.fields[column]].bgColor;
      }
    });
  }
};

module.exports = { preprocessDataForColors };
