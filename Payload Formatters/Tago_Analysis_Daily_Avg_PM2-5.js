/*
 ** Analysis 
 ** Retrieve last Hour and last 24 Hour PM2.5 readings, averaged, and store 
 ** in bucket for subsequent Dashboard display
 **.
 */

 const { Analysis, Device, Utils } = require("@tago-io/sdk");
 const axios = require("axios");
 
 async function AverageAirQuality(context) {

   var oneHourAgo = new Date (Date.now() -  3600 * 1000);        
   var oneDayAgo =  new Date (Date.now() - 24 * 3600 * 1000);
   var avgPM25oneHour;
   var avgPM25oneDay;

   context.log(oneHourAgo);
   context.log(oneDayAgo);
 
     // reads the values from the environment and saves it in the variable env_vars
   const env_vars = Utils.envToJson(context.environment);
   if (!env_vars.device_token) {
     return context.log("Device token not found on environment parameters");
   }
 
   const device = new Device({ token: env_vars.device_token });
 
   
     //  Fields of the TTN payload as captured in Device
     //  Use the PM2.5 standard figure
   const dataFields = ["pm25_standard"];
 
    // create the filter options to get the average of obs data from TagoIO
   const filterHour = {
     variables: dataFields,
     query: "avg",
     start_date: oneHourAgo,
   };
 
     const resultArrayHour = await device.getData(filterHour).catch(() => null);

     context.log(resultArrayHour);
 
    for (const index in dataFields) {
      context.log(`${dataFields[index]} :: ${resultArrayHour[index].value} \t ${resultArrayHour[index].serie}`);
     };
 
   // Check if the array is not empty
   if (!resultArrayHour || !resultArrayHour[0]) {
     return context.log("Empty Array from avgHour request")
   };

  // record the hourly average
  avgPM25oneHour = resultArrayHour[0].value;

  // repeat data average for one day's duration
    // create the filter options to get the last-entered set of obs data from TagoIO
   const filterDay = {
     variables: dataFields,
     query: "avg",
     start_date: oneDayAgo,
   };
 
     const resultArrayDay = await device.getData(filterDay).catch(() => null);
 
    for (const index in dataFields) {
      context.log(`${dataFields[index]} :: ${resultArrayDay[index].value} \t ${resultArrayDay[index].serie}`);
     };
 
   // Check if the array is not empty
   if (!resultArrayDay || !resultArrayDay[0]) {
     return context.log("Empty Array for avgDay request")
   };

  // record the daily average
  avgPM25oneDay = resultArrayDay[0].value;

  context.log(avgPM25oneHour);
  context.log(avgPM25oneDay);

  //  Save the two Average measurements back to the device Bucket
  const result2 = await device.sendData([
      {
      variable: "PM25HourAvg",
      value: avgPM25oneHour,
      },
      {
        variable: "PM25DayAvg",
        value: avgPM25oneDay,
      },
    ]);
 
 }
 
 module.exports = new Analysis(AverageAirQuality);
 
 // To run analysis on your machine (external)
 // module.exports = new Analysis(getToHTTP, { token: "YOUR-TOKEN" });
 