export interface OgData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  favicon?: string;
  type?: string;
}

export interface OgApiResponse {
  success: boolean;
  data?: OgData;
  error?: string;
}
