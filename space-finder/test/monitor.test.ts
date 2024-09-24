import { SNSEvent } from "aws-lambda";
import { handler } from "../src/services/monitor/handler";
const eventRequest: SNSEvent = {
  Records: [
    {
      Sns: {
        Message: "Test messagedd",
      },
    },
  ],
} as any;

handler(eventRequest, {});
console.log({ object: eventRequest });
