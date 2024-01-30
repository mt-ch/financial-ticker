import { FinancialModel } from "../models/financialModel.js";
import type { DeltaDataSet } from "../types/deltaTypes.js";

export function parseCSV(csvData: string): (FinancialModel | null)[] {
  const lines = csvData.split("\n");

  const parseLine = (line: string, header: string[]): FinancialModel | null => {
    const values = line.split(",");

    // Check if the line has the same number of values as the header
    if (values && values.length >= header.length) {
      const stockData: { [key: string]: string } = {};

      // Iterate through each value and add it to the stock data object
      header.forEach((key, index) => {
        stockData[key.trim()] = values[index]?.trim() || "";
      });

      // Return a new FinancialModel object
      return new FinancialModel(
        stockData.Name,
        stockData["Company Name"],
        parseFloat(stockData.Price),
        parseFloat(stockData.Change),
        stockData["Chg %"],
        stockData["Mkt Cap"]
      );
    } else {
      console.error("Invalid line in CSV:", line);
      return null;
    }
  };

  const header = lines[0].split(",");
  const parsedData: (FinancialModel | null)[] = lines.slice(1).map((line) => parseLine(line, header));

  return parsedData.filter((item): item is FinancialModel => item !== null);
}

export function parseDeltaCSV(deltaCsvData: string): DeltaDataSet[] {
  // Split the delta CSV data into lines
  const lines = deltaCsvData.split("\n");
  // Array to store DeltaDataSet objects
  const deltaDataSets: DeltaDataSet[] = [];

  // Variable to track the current DeltaDataSet being processed
  let currentDeltaSet: DeltaDataSet | null = null;

  // Iterate through each line in the delta CSV data
  for (const line of lines) {
    // Split the line into an array of values using commas as separators
    const values = line.split(",");

    // Check if the line has values
    if (values.length > 0) {
      // Check if the first value is a number (indicating an interval)
      if (!isNaN(parseFloat(values[0].trim()))) {
        // Start a new DeltaDataSet and add it to the array
        currentDeltaSet = { deltas: [], interval: 0 };
        deltaDataSets.push(currentDeltaSet);

        // Update the interval for the newly created DeltaDataSet
        const interval = parseFloat(values[0].trim());
        currentDeltaSet.interval = interval;
      } else if (values.length > 2 && currentDeltaSet) {
        // Line contains deltas (ignore the first two values)
        const [_, __, price, change, chgPercentage] = values.map((value) => parseFloat(value.trim()));

        // Add the deltas to the current DeltaDataSet
        currentDeltaSet.deltas.push({ price, change, chgPercentage });
      }
    }
  }

  // Return the array of DeltaDataSet objects
  return deltaDataSets;
}
