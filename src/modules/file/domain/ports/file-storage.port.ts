export interface UploadResult {
  key: string;
  size: number;
  mimeType: string;
  url: string;
}

export interface FileStorage {
  upload(file: Buffer, key: string, mimeType: string): Promise<UploadResult>;

  getPresignedUrl(key: string, expiresIn?: number): Promise<string>;

  getStream(
    key: string,
  ): Promise<{ stream: NodeJS.ReadableStream; mimeType: string }>;
}

export const FILE_STORAGE = Symbol('FILE_STORAGE');
