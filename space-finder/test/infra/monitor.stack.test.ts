import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/monitor.stack";
import { Match, Template } from "aws-cdk-lib/assertions";

describe("Initial test suite ", () => {
  let monitorStackTemplate: Template;
  beforeEach(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });
    const monitorStack = new MonitorStack(testApp, "MonitorStack");
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  it("lambda properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs18.x",
    });
  });

  it("sns topic properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Topic", {
      DisplayName: "AlarmTopic",
      TopicName: "AlarmTopic",
    });
  });

  it("sns subscription properties - with matchers", () => {
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "lambda",
      TopicArn: {
        Ref: Match.stringLikeRegexp("AlarmTopic"),
      },
      Endpoint: {
        "Fn::GetAtt": [Match.stringLikeRegexp("WebHookLambda"), "Arn"],
      },
    });
  });

  it("sns subscription properties - with exact values", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    const snsTopicName = Object.keys(snsTopic)[0];

    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    const lambdaName = Object.keys(lambda)[0];

    monitorStackTemplate.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "lambda",
      TopicArn: {
        Ref: snsTopicName,
      },
      Endpoint: {
        "Fn::GetAtt": [lambdaName, "Arn"],
      },
    });
  });
});
