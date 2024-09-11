import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/data.stack";
import { LambdaStack } from "./stacks/lambda.stack";
import { ApiStack } from "./stacks/api.stack";
import { AuthStack } from "./stacks/auth.stack";
import { UIDeploymentStack } from "./stacks/ui-deployment.stack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", { spacesTable: dataStack.spacesTable });
const authStack = new AuthStack(app, "AuthStack", {
  photosBucket: dataStack.photosBucket,
});
new ApiStack(app, "ApiStack", { spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration, cognitoUserPool: authStack.userPool });
new UIDeploymentStack(app, "UIDeploymentStack");
