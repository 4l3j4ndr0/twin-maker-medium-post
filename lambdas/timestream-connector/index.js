const AWS = require("aws-sdk");
const TimestreamQuery = new AWS.TimestreamQuery();

exports.handler = async (event) => {
  // Extract the query parameters from the event
  let { startTime, endTime, entityId, componentName, maxResults } = event;
  const sensorId = event.properties.sensorId.value.integerValue;
  // Construct the Timestream query
  const params = {
    QueryString: `SELECT * FROM "${process.env.DATABASE}"."${process.env.TABLE_NAME}" WHERE sensorId='${sensorId}' and time BETWEEN from_iso8601_timestamp('${startTime}') AND from_iso8601_timestamp('${endTime}')`,
    MaxRows: maxResults,
  };

  // Execute the query
  const data = await TimestreamQuery.query(params).promise();

  // Transform the response
  const transformedData = data.Rows.map((row) => {
    return {
      time: new Date(row.Data[2].ScalarValue).toISOString(),
      value: {
        doubleValue: row.Data[3].ScalarValue,
      },
    };
  });
  // Return the transformed response
  const response = {
    propertyValues: [
      {
        entityPropertyReference: {
          entityId,
          componentName,
          propertyName: event.selectedProperties[0],
        },
        values: transformedData,
      },
    ],
    nextToken: null,
  };
  return response;
};
