export async function hanlder(event: any, context: any) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
}
