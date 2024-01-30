// Services
import { DataService } from "./services/dataService.js";
// Models
import { FinancialModel } from "./models/financialModel.js";
// Components
import { TableRenderer } from "./components/tableRender.js";
import { MessageRenderer } from "./components/messageRender.js";
// Utils
import { processDeltas } from "./utils/processDeltas.js";

class App {
  private readonly dataService: DataService = new DataService();
  private readonly tableRenderer: TableRenderer = new TableRenderer("financialGrid");
  private readonly messageRenderer: MessageRenderer = new MessageRenderer("updateMessage");

  constructor() {}
  /**
   * Initialise the application.
   */
  public async initialize(): Promise<void> {
    try {
      // Load financial data from the CSV file
      let financialData: FinancialModel[] = await this.dataService.loadFinancialData("data/snapshot.csv");

      // Hide the loader once the data is loaded
      const loaderElement = document.getElementById("loader");
      if (loaderElement) {
        loaderElement.style.display = "none";
      }

      // Render the financial data into a table
      this.tableRenderer.renderFinancialData(financialData);

      // Process deltas repeatedly
      while (true) {
        await processDeltas(this.dataService, this.tableRenderer, this.messageRenderer, financialData);
      }
    } catch (error) {
      // Handle initialisation errors
      console.error("Error initializing application:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.initialize();
});
