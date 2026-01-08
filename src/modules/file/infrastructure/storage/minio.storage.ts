/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Client } from 'minio';
import {
  FileStorage,
  UploadResult,
} from '../../domain/ports/file-storage.port';
import { FileStorageError } from './err/file-storage.error';

export class MinioStorage implements FileStorage {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    this.bucket = this.getEnv('MINIO_BUCKET');
    this.publicUrl = this.getEnv('MINIO_PUBLIC_URL');

    this.client = new Client({
      endPoint: this.getEnv('MINIO_ENDPOINT'),
      port: Number(this.getEnv('MINIO_PORT')),
      useSSL: this.getEnv('MINIO_USE_SSL') === 'true',
      accessKey: this.getEnv('MINIO_ACCESS_KEY'),
      secretKey: this.getEnv('MINIO_SECRET_KEY'),
    });
  }

  async upload(
    file: Buffer,
    key: string,
    mimeType: string,
  ): Promise<UploadResult> {
    try {
      await this.ensureBucketExists();

      await this.client.putObject(this.bucket, key, file, file.length, {
        'Content-Type': mimeType,
      });

      return {
        key,
        size: file.length,
        mimeType,
        url: `${this.getEnv('PROTOCOL')}://${this.getEnv('HOST')}:${this.getEnv('PORT')}/files/${key}`,
      };
    } catch (error) {
      throw new FileStorageError('Failed to upload file to MinIO', error);
    }
  }

  async getPresignedUrl(key: string, expiresIn = 60 * 60): Promise<string> {
    try {
      return await this.client.presignedGetObject(this.bucket, key, expiresIn);
    } catch (error) {
      throw new FileStorageError('Failed to generate presigned URL', error);
    }
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  private getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }

  async getStream(
    key: string,
  ): Promise<{ stream: NodeJS.ReadableStream; mimeType: string }> {
    try {
      const stat = await this.client.statObject(this.bucket, key);

      const stream = await this.client.getObject(this.bucket, key);

      return {
        stream,
        mimeType: stat.metaData?.['content-type'] ?? 'application/octet-stream',
      };
    } catch (error) {
      throw new FileStorageError('Failed to get file stream', error);
    }
  }
}
