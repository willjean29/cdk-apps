import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getSpaces } from "../../../src/services/spaces/get-spaces";
const someItems = {
  Items: [
    {
      id: "123",
      location: "Paris",
    },
  ],
};
const someItem = {
  Item: {
    id: "123",
    location: "Paris",
  },
};
describe("GetSpaces test suite", () => {
  const ddbClientMock = {
    send: jest.fn(),
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return spaces if no queryStringParameters", async () => {
    ddbClientMock.send.mockResolvedValueOnce(someItems);
    const getResult = await getSpaces({} as any, ddbClientMock as any);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify([
        {
          id: "123",
          location: "Paris",
        },
      ]),
    };
    expect(getResult).toEqual(expectedResult);
  });
  it("should return 400 if no id in queryStringParameters", async () => {
    const getResult = await getSpaces(
      {
        queryStringParameters: {
          notId: "123",
        },
      } as any,
      ddbClientMock as any
    );
    const expectedResult = {
      statusCode: 400,
      body: JSON.stringify({ message: "Id required!" }),
    };
    expect(getResult).toEqual(expectedResult);
  });
  it("should return 404 if no id in queryStringParameters", async () => {
    ddbClientMock.send.mockResolvedValueOnce({});
    const getResult = await getSpaces(
      {
        queryStringParameters: {
          id: "123",
        },
      } as any,
      ddbClientMock as any
    );
    const expectedResult = {
      statusCode: 404,
      body: JSON.stringify({ message: "Item not found" }),
    };
    expect(getResult).toEqual(expectedResult);
  });
  it("should return 200 if queryStringParameters with found id", async () => {
    ddbClientMock.send.mockResolvedValueOnce(someItem);
    const getResult = await getSpaces(
      {
        queryStringParameters: {
          id: "123",
        },
      } as any,
      ddbClientMock as any
    );
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({
        id: "123",
        location: "Paris",
      }),
    };
    expect(getResult).toEqual(expectedResult);
    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
    const getItemCommandInput = (ddbClientMock.send.mock.calls[0][0] as GetCommand).input;
    expect(getItemCommandInput.TableName).toBeUndefined();
    expect(getItemCommandInput.Key).toEqual({
      id: "123",
    });
  });
});
