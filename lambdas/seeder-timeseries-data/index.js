const AWS = require("aws-sdk");
const timestream = new AWS.TimestreamWrite({ apiVersion: "2019-11-01" });

exports.handler = async (event) => {
  const time = new Date().getTime().toString();
  const records = [
    {
      Dimensions: [
        {
          Name: "sensorId",
          Value: "1",
        },
      ],
      MeasureName: "temperature",
      MeasureValue: (Math.random() * (69 - 40) + 68).toString(),
      MeasureValueType: "DOUBLE",
      Time: time,
    },
    {
      Dimensions: [
        {
          Name: "sensorId",
          Value: "2",
        },
      ],
      MeasureName: "pressure",
      MeasureValue: (Math.random() * (69 - 50) + 68).toString(),
      MeasureValueType: "DOUBLE",
      Time: time,
    },
  ];

  const params = {
    DatabaseName: process.env.DATABASE,
    TableName: process.env.TABLE_NAME,
    Records: records,
  };

  try {
    await timestream.writeRecords(params).promise();
    return { statusCode: 200, body: "Data added successfully" };
  } catch (err) {
    console.log("ERROR INSERT TIMESERIES VALUES:::::", err);
    return { statusCode: 500, body: err.stack };
  }
};
