import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACESS_KEY } from "./../../constants";
import {
  IImageRepository,
  UploadImageInput,
  UploadImageOutput,
} from "./NotionContentsRepository";

import S3 from "aws-sdk/clients/s3";

export class AwsS3ImageRepository implements IImageRepository {
  private region = "us-east-1";
  private bucket = "medical-routines";
  private imageAccess = "public-read";

  private cloudFrontBaseUrl = "https://dx44fwb82ca8v.cloudfront.net";

  async uploadRoutineImage({
    organizationSlug,
    routineSlug: routineId,
    imageName,
    imageBuffer,
  }: UploadImageInput): Promise<UploadImageOutput> {
    const s3Client = new S3({
      region: this.region,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACESS_KEY,
    });
    const { Key } = await s3Client
      .upload({
        Bucket: this.bucket,
        Body: imageBuffer,
        Key: `${organizationSlug}/routines/${routineId}/${imageName}`,
        ACL: this.imageAccess,
      })
      .promise();
    return { url: `${this.cloudFrontBaseUrl}/${Key}` };
  }
}
