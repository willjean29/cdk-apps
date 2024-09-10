import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  cognitoUserPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceFinderApi");
    const authorizer = new CognitoUserPoolsAuthorizer(this, "SpaceFinderAuthorizer", {
      cognitoUserPools: [props.cognitoUserPool],
      identitySource: "method.request.header.Authorization",
    });
    authorizer._attachToApi(api);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const spaceResource = api.root.addResource("spaces", optionsWithCors);
    spaceResource.addMethod("GET", props.spacesLambdaIntegration, optionsWithAuthorizer);
    spaceResource.addMethod("POST", props.spacesLambdaIntegration, optionsWithAuthorizer);
    spaceResource.addMethod("PUT", props.spacesLambdaIntegration, optionsWithAuthorizer);
    spaceResource.addMethod("DELETE", props.spacesLambdaIntegration, optionsWithAuthorizer);
  }
}
