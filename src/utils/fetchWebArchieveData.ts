"use server";

import axios from "axios";

export type WebArchiveEntry = [string, string, string, string, string, string];

export interface GroupedWebArchiveData {
  [year: string]: WebArchiveEntry[];
}
export type WebArchiveData = WebArchiveEntry[];

export const fetchWebArchiveData = async (
  url: string
): Promise<WebArchiveData> => {
  const apiUrl = `https://web.archive.org/web/timemap/json?url=${encodeURIComponent(
    url
  )}&matchType=prefix&collapse=urlkey&output=json&fl=original,mimetype,timestamp,endtimestamp&filter=!statuscode:[45]..&limit=10000&_=${Date.now()}`;

  const response = await axios.get(apiUrl).then((res) => res);
  if (response?.statusText != "OK") {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: WebArchiveData = await response.data;
  return data;
};
