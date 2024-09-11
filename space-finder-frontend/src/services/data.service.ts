import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./auth.service";
import { DataStack } from "../../../space-finder/outputs.json";

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private awsRegion = "us-east-1";

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  public async createSpace(name: string, location: string, photo?: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    console.log({ name, location, photo });
    console.log({ credentials });
    if (photo) {
      try {
        const uploadUrl = await this.uploadPublicFile(photo);
        console.log(uploadUrl);
      } catch (error) {
        console.error(error);
      }
    }
    return "123";
  }

  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        credentials: credentials as any,
        region: this.awsRegion,
      });
    }
    const command = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      ACL: "public-read",
      Body: file,
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
  }

  public isAuthorized() {
    return true;
  }
}
