import { fetchAuthSession, signIn, SignInOutput } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_MwrtSDaQp",
      userPoolClientId: "14bst1p6iidqne0e0forig31tu",
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
}
