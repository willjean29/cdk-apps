import { SNSEvent } from "aws-lambda";

const webhookUrl = "https://discord.com/api/webhooks/1288253235831771176/RfG04ozOhfvB5_ltUQ1IgXlf3j6IC49QnmNbTpZqB0PhV_29LKIYT6uPjxTgU2fX5p64";

export async function handler(event: SNSEvent, context: any) {
  const records = event.Records;
  for (const record of records) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify({ content: `Huston, we have a problem: ${record.Sns.Message}` }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log({ error });
    }
  }
}
