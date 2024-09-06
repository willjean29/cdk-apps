import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { CfnIdentityPool, CfnUserPool, CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib/core";

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminGroup();
    this.createIdentityPool();
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

  private createAdminGroup() {
    new CfnUserPoolGroup(this, "SpaceAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "SpaceIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
    new CfnOutput(this, "SpaceIdentityPoolId", {
      value: this.identityPool.ref,
    });
  }
}
