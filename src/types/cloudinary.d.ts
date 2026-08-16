/**
 * Cloudinary環境変数の型定義
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // Client-side (next-cloudinary package)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  }
}
