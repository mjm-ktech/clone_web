export type WebArchiveEntry = [string, string, string, string, string, string];

export interface GroupedWebArchiveData {
  [year: string]: WebArchiveEntry[];
}
export type WebArchiveData = WebArchiveEntry[];

export async function fetchWebArchiveData(
  url: string
): Promise<WebArchiveData> {
  const apiUrl = `https://web.archive.org/web/timemap/json?url=${encodeURIComponent(
    url
  )}&matchType=prefix&collapse=urlkey&output=json&fl=original,mimetype,timestamp,endtimestamp&filter=!statuscode:[45]..&limit=10000&_=${Date.now()}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: WebArchiveData = await response.json();
  return data;
}

export function groupDataByYear(data: WebArchiveData): GroupedWebArchiveData {
  const [headers, ...entries] = data;
  const endTimestampIndex = headers.indexOf("endtimestamp");
  const originalIndex = headers.indexOf("original");

  // Regular expression to match URLs with date paths
  const datePathRegex = /\/\d{4}\/\d{2}\/\d{2}\//;

  // Filter entries that match the date path pattern in the "original" column
  const filteredEntries = entries.filter((entry) =>
    datePathRegex.test(entry[originalIndex])
  );

  // Group filtered entries by year
  return filteredEntries.reduce((acc: GroupedWebArchiveData, entry) => {
    const year = entry[endTimestampIndex].substring(0, 4);

    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(entry);
    return acc;
  }, {});
}
