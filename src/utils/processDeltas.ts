// Services
import { DataService } from "../services/dataService.js";
// Models
import { FinancialModel } from "../models/financialModel.js";
// Components
import { TableRenderer } from "../components/tableRender.js";
import { MessageRenderer } from "../components/messageRender.js";
// Types
import type { Delta } from "../types/deltaTypes.js";

export function applyDeltas(data: FinancialModel[], deltas: Delta[]): FinancialModel[] {
  // Iterate through each delta
  deltas.forEach((delta, index) => {
    // Check if the delta is valid and if the stock exists in the data array
    if (data[index]) {
      // Update the stock data with the delta values
      if (typeof delta.price === "number" && !isNaN(delta.price)) {
        data[index].price = delta.price;
      }

      if (typeof delta.change === "number" && !isNaN(delta.change)) {
        data[index].change = delta.change;
      }

      if (typeof delta.chgPercentage === "number" && !isNaN(delta.chgPercentage)) {
        data[index].chgPercentage = delta.chgPercentage.toString();
      }
    }
  });

  return data;
}

export async function processDeltas(
  dataService: DataService,
  tableRenderer: TableRenderer,
  messageRenderer: MessageRenderer,
  financialData: FinancialModel[]
): Promise<void> {
  // Load delta data from the delta CSV file
  const deltaDataSets = await dataService.loadDeltaData("data/deltas.csv");

  for (const deltaDataSet of deltaDataSets) {
    // Apply the deltas to your financial data array
    financialData = applyDeltas(financialData, deltaDataSet.deltas);

    // Render the updated financial data in the grid
    tableRenderer.renderFinancialData(financialData);

    // Display a message when the deltas have been updated
    messageRenderer.showMessage("Prices updated!");

    // Wait for the specified interval before processing the next set of deltas
    await new Promise((resolve) => setTimeout(resolve, deltaDataSet.interval));
  }
}
