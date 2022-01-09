import axios from "axios";
import sizeOf from "image-size";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACESS_KEY } from "./../../constants";
import S3 from "aws-sdk/clients/s3";
import type { Organization, Routine, ImageRecord } from "@monorepo/domain";

export type UploadImageConfig = {
  type: "routine";
  imageBuffer: Buffer;
  organizationSlug: Organization["slug"];
  routineSlug: Routine["slug"];
  imageId: string;
};

export class AwsS3ImageRepository {
  private region = "us-east-1";
  private bucket = "medical-routines";
  private imageAccess = "public-read";

  private cloudFrontBaseUrl = "https://dx44fwb82ca8v.cloudfront.net";

  async saveImageFromUrl(
    url: string,
    config: Omit<UploadImageConfig, "imageBuffer">
  ): Promise<ImageRecord> {
    const { data: imageArrayBuffer } = await axios(url, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const { height = 0, width = 0, type = "" } = sizeOf(imageBuffer);
    const { url: savedUrl } = await this.uploadImage({
      ...config,
      imageBuffer,
    });
    return {
      url: savedUrl,
      format: type,
      height,
      width,
    };
  }

  private async uploadImage(
    config: UploadImageConfig
  ): Promise<{ url: string }> {
    const s3Client = new S3({
      region: this.region,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACESS_KEY,
    });
    const { Key } = await s3Client
      .upload({
        Bucket: this.bucket,
        Body: config.imageBuffer,
        Key: this.imageKeyFromConfig(config),
        ACL: this.imageAccess,
      })
      .promise();
    return { url: `${this.cloudFrontBaseUrl}/${Key}` };
  }

  private imageKeyFromConfig(config: UploadImageConfig): string {
    if (config.type === "routine") {
      const { imageId, organizationSlug, routineSlug } = config;
      return `organizations/${organizationSlug}/routines/${routineSlug}/${imageId}`;
    }
    return "";
  }
}
