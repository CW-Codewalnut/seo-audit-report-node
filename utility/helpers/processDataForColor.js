const preprocessDataForColors = (data, type='body') => {
    // const getHeaderColorMapping = (values) => {
    //     const filteredValues = values.filter(v => v !== undefined && v !== null);
    //     const uniqueValues = [...new Set(filteredValues)];
    //     const colorMapping = uniqueValues.reduce((acc, value) => {
    //     })

    //     return colorMapping;

    // }
  
    const getBodyColorMapping = (values, fieldName="") => {
        const filteredValues = values.filter(v => v !== undefined && v !== null);
        const uniqueValues = [...new Set(filteredValues)];
        const colorMapping = uniqueValues.reduce((acc, value) => {
            if (value === 'Partial') {
                acc[value] = {
                    textColor: 'rgb(255, 190, 0)',
                    bgColor: 'rgb(255, 247, 222)'
                };
            } else if(value === 'Yes') {
                acc[value] = {
                    textColor: 'rgb(120, 195, 23)',
                    bgColor: 'rgb(230, 245, 210)'
                };
            } else if(value === 'No'){
                acc[value] = {
                    textColor: 'rgb(221, 21, 59)',
                    bgColor: 'rgb(255, 204, 214)'
                };
            } else if(fieldName === 'Mobile score'){
                if(value < 30){
                        acc[value]= {
                            textColor: 'rgb(221, 21, 59)',
                            bgColor: 'rgb(255, 204, 214)'
                        }
                } else if(value >= 30 && value<=70){
                        acc[value]= {
                            textColor: 'rgb(255, 190, 0)',
                            bgColor: 'rgb(255, 247, 222)'
                    }
                } else {
                        acc[value]= {
                            textColor: 'rgb(120, 195, 23)',
                            bgColor: 'rgb(230, 245, 210)'
                    } 
                }
            } else if(fieldName === 'Desktop score'){
                if(value < 30){
                        acc[value]= {
                            textColor: 'rgb(221, 21, 59)',
                            bgColor: 'rgb(255, 204, 214)'
                        }
                } else if(value >= 30 && value<=80){
                        acc[value]= {
                            textColor: 'rgb(255, 190, 0)',
                            bgColor: 'rgb(255, 247, 222)'
                        }
                } else {
                        acc[value]= {
                            textColor: 'rgb(120, 195, 23)',
                            bgColor: 'rgb(230, 245, 210)'
                        }
                }
            } else if(fieldName === 'Accessibility'){
                if(value < 70){
                        acc[value]= {
                            textColor: 'rgb(221, 21, 59)',
                            bgColor: 'rgb(255, 204, 214)'
                        }
                } else if(value >= 70 && value<=90){
                        acc[value]= {
                            textColor: 'rgb(255, 190, 0)',
                            bgColor: 'rgb(255, 247, 222)'
                        }
                } else {
                        acc[value]= {
                            textColor: 'rgb(120, 195, 23)',
                            bgColor: 'rgb(230, 245, 210)'
                        }
                }
            } else {
                acc[value]= {
                    textColor: 'rgb(0, 0, 0)',
                    bgColor: 'rgb(233, 240, 245)'
                }
            }
            
            return acc;
        }, {});

        return colorMapping;
    };
    if (type === 'tableData') {
        Object.keys(data).forEach(key => {
            const totals = data[key].totals;
            const details = data[key].details;
            
            // Process totals
            
            ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach(column => {
                
                    totals[`${column}TextColor`] = 'rgb(15, 42, 61)';
                    totals[`${column}BgColor`] = 'rgb(15, 42, 61)';
                
            });
            
            // Process details
            details.forEach(detail => {
                const fields = detail.fields;
                const detailColorsMapping = getBodyColorMapping([fields?.yourScore, fields?.yourCompiteiter1, fields?.yourCompiteiter2], fields.Name);
                
                ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach(column => {
                    if (detailColorsMapping[fields[column]]) {
                        fields[`${column}TextColor`] = detailColorsMapping[fields[column]].textColor;
                        fields[`${column}BgColor`] = detailColorsMapping[fields[column]].bgColor;
                    }
                });
            });
        });
    } else {
        const totalsColorsMapping = getHeaderColorMapping([
            parseInt(data.fields.yourScore, 10),
            parseInt(data.fields.yourCompiteiter1, 10),
            parseInt(data.fields.yourCompiteiter2, 10)
        ]);
    
        ["yourScore", "yourCompiteiter1", "yourCompiteiter2"].forEach(column => {
            if (totalsColorsMapping[data.fields[column]]) {
                data.fields[`${column}TextColor`] = totalsColorsMapping[data.fields[column]].textColor;
                data.fields[`${column}BgColor`] = totalsColorsMapping[data.fields[column]].bgColor;
            }
        });
    }


    
  };

  module.exports = {preprocessDataForColors};