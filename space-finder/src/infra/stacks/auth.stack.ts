import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { CfnUserPool, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib/core";

export class AuthStack extends Stack {
  public userPool: UserPool;
  public userPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "SpaceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: { username: true, email: true },
    });

    new CfnOutput(this, "SpaceUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceUserPoolClient", {
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
        custom: true,
        userPassword: true,
      },
    });
    new CfnOutput(this, "SpaceUserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
