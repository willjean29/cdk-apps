import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/monitor.stack";
import { Template } from "aws-cdk-lib/assertions";

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
});
