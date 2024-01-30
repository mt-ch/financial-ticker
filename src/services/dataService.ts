// Utils
import { parseCSV, parseDeltaCSV } from "../utils/csvParser.js";
// Models
import { FinancialModel } from "../models/financialModel.js";
// Types
import type { DeltaDataSet } from "../types/deltaTypes.js";

export class DataService {
  private async fetchData<T>(filePath: string, parser: (csvData: string) => T): Promise<T> {
    try {
      // Fetch the CSV file
      const response = await fetch(filePath);

      // Check if the fetch was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      // Extract the CSV data from the response
      const csvData = await response.text();

      // Parse the CSV data using the provided parser function
      const parsedData: T = parser(csvData);

      return parsedData;
    } catch (error) {
      // Handle errors and log them
      console.error(`Error loading data from ${filePath}:`, error);
      throw error;
    }
  }

  public async loadFinancialData(filePath: string): Promise<FinancialModel[]> {
    return this.fetchData(filePath, (csvData) => parseCSV(csvData).filter((item): item is FinancialModel => item !== null));
  }

  public async loadDeltaData(filePath: string): Promise<DeltaDataSet[]> {
    return this.fetchData(filePath, parseDeltaCSV);
  }
}
