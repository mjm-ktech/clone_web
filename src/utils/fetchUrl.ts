export interface UrlData {
  url: string;
  content: string;
}

export async function fetchUrl(url: string): Promise<UrlData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const content = await response.text();
  return { url, content };
}
