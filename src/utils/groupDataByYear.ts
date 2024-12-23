export type WebArchiveEntry = [string, string, string, string, string, string];

export interface GroupedWebArchiveData {
  [year: string]: WebArchiveEntry[];
}
export type WebArchiveData = WebArchiveEntry[];

export function groupDataByYear(data: WebArchiveData): GroupedWebArchiveData {
  const [headers, ...entries] = data;
  const endTimestampIndex = headers.indexOf("endtimestamp");

  return entries.reduce((acc: GroupedWebArchiveData, entry) => {
    const year = entry[endTimestampIndex].substring(0, 4);

    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(entry);
    return acc;
  }, {});
}
