import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
// import { CdkStarterStack } from "../lib/cdk-starter-stack";
import { PhotosHandlerStack } from "../lib/photos-handler-stack";
import { PhotosStack } from "../lib/photos-stack";
import { BucketTagger } from "./tagger";

const app = new cdk.App();
// new CdkStarterStack(app, "CdkStarterStack");
const photosStack = new PhotosStack(app, "PhotosStack");
new PhotosHandlerStack(app, "PhotosHandlerStack", {
  targetBucketArn: photosStack.photosBucketArn,
});

const tagger = new BucketTagger("level", "test");
cdk.Aspects.of(app).add(tagger);
