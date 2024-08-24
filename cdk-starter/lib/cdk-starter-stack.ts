import * as cdk from "aws-cdk-lib";
import { CfnOutput, CfnParameter, Duration } from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

class MyL3Bucket extends Construct {
  constructor(scope: Construct, id: string, days: number) {
    super(scope, id);

    new Bucket(this, id, {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(days),
        },
      ],
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create n s3 bucket 3 ways
    new CfnBucket(this, "MyL1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 4,
            status: "Enabled",
          },
        ],
      },
    });

    const duration = new CfnParameter(this, "MyL2BucketExpirationDays", {
      type: "Number",
      default: 4,
      minValue: 1,
      maxValue: 10,
    });

    const myL2Bucket = new Bucket(this, "MyL2Bucket", {
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber),
        },
      ],
    });

    new cdk.CfnOutput(this, "MyL2BucketName", {
      value: myL2Bucket.bucketName,
    });

    new MyL3Bucket(this, "MyL3Bucket", 3);
  }
}
