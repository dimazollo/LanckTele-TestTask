import * as csv from 'csv-parser';
import * as fs from 'fs';

export function readCsv<I, O>(
  filePath,
  rowMapper: (rowData: I) => O,
): Promise<O[]> {
  return new Promise((res, rej) => {
    const data: O[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const mapped = rowMapper(row)
        data.push(mapped);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res(data);
      });
  });
}
