import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./auth.service";

async function testAuth() {
  const authService = new AuthService();
  const signInOutput = await authService.login("jean", "Clipar567.");
  console.log({ signInOutput });
  const idToken = await authService.getIdToken();
  console.log({ idToken });
  const credentials = await authService.generateTemporayCredentials();
  console.log({ credentials });
  listBuckets(credentials);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();
