import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { existsSync } from "fs";
import { join } from "path";
import { getSuffixFromStack } from "../utils";

export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "UIDeploymentBucket", {
      bucketName: `space-finder-frontend-${suffix}`,
    });

    const uiDirectory = join(__dirname, "../../../../space-finder-frontend/dist");
    if (!existsSync(uiDirectory)) {
      console.warn(`UI directory not found at ${uiDirectory}`);
      return;
    }

    new BucketDeployment(this, "SpaceFinderDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDirectory)],
    });

    const originIdentity = new OriginAccessIdentity(this, "SpaceFinderOriginIdentity");
    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, "SpaceFinderDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new CfnOutput(this, "SpaceFinderUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
