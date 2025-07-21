import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

class StorjService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: "us1",
      endpoint: "https://gateway.storjshare.io",
      credentials: {
        accessKeyId: process.env['STORJ_ACCESS_KEY']!,
        secretAccessKey: process.env['STORJ_SECRET_KEY']!,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(fileName: string, buffer: Buffer): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: process.env['STORJ_BUCKET_NAME']!,
        Key: fileName,
        Body: buffer,
        ContentType: "image/webp",
        ACL: "public-read"
      },
    });

    await upload.done();
    return `https://link.storjshare.io/raw/${process.env['STORJ_ACCESS_GRANT']}/${process.env['STORJ_BUCKET_NAME']}/${fileName}`;
  }
}

export default new StorjService();