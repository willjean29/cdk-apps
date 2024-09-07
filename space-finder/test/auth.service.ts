import { fetchAuthSession, signIn, SignInOutput } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { Amplify } from "aws-amplify";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_MwrtSDaQp",
      userPoolClientId: "14bst1p6iidqne0e0forig31tu",
      identityPoolId: "us-east-1:5a54db31-6ae2-4ead-b6c4-fe96c97a794e",
    },
  },
});

export class AuthService {
  public async login(username: string, password: string): Promise<SignInOutput> {
    const signInOutput: SignInOutput = await signIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInOutput;
  }

  /**
   *
   * can only be called after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporayCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_MwrtSDaQp`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "us-east-1:5a54db31-6ae2-4ead-b6c4-fe96c97a794e",
        logins: {
          [cognitoIdentityPool]: idToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
