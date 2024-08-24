import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Fn } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class PhotosStack extends cdk.Stack {
  private stackSuffix: string;
  public readonly photosBucketArn: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.initializeStackSuffix();

    const photoBucket = new Bucket(this, "PhotosBucket2", {
      bucketName: `photos-bucket-${this.stackSuffix}`,
    });

    this.photosBucketArn = photoBucket.bucketArn;
  }

  private initializeStackSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    this.stackSuffix = Fn.select(4, Fn.split("-", shortStackId));
  }
}
