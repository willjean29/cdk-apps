exports.main = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!', tableName: process.env.TABLE_NAME }),
  }
}