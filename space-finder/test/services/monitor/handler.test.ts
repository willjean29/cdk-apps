import { SNSEvent } from "aws-lambda";
import { handler } from "../../../src/services/monitor/handler";
describe("Initial service", () => {
  const fetchSpy = jest.spyOn(global, "fetch");
  fetchSpy.mockImplementation(() => Promise.resolve({} as any));
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("make request for records in SnsEvents", async () => {
    expect.assertions(2);
    const eventRequest: SNSEvent = {
      Records: [
        {
          Sns: {
            Message: "Test message",
          },
        },
      ],
    } as any;
    await handler(eventRequest, {});
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      body: JSON.stringify({ content: "Huston, we have a problem: Test message" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  });

  it("no sns records, no request", async () => {
    expect.assertions(2);
    await handler({ Records: [] } as any, {});
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });
});
