// Models
import { FinancialModel } from "../models/financialModel.js";

export class TableRenderer {
  private tableContainer: HTMLElement | null;

  constructor(tableContainerId: string) {
    this.tableContainer = document.getElementById(tableContainerId);
    // Check if the table container exists
    if (!this.tableContainer) {
      console.error(`Table container with id '${tableContainerId}' not found.`);
    }
  }

  // Render the financial data into a table
  renderFinancialData(data: FinancialModel[]): void {
    // Check if the table container exists
    if (!this.tableContainer) {
      return;
    }
    // Create the table
    const table = this.createTable(data);
    this.tableContainer.innerHTML = "";
    // Add the table to the table container
    this.tableContainer.appendChild(table);
  }

  private createTable(data: FinancialModel[]): HTMLTableElement {
    const table = document.createElement("table");
    table.classList.add("financial-table");

    // Create the table header and body
    this.createTableHeader(table, data);
    this.createTableBody(table, data);

    return table;
  }

  private createTableHeader(table: HTMLTableElement, data: FinancialModel[]): void {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Define the header names
    const headerNames: { [key: string]: string } = {
      companyName: "Name",
      price: "Price",
      chgPercentage: "Change %",
      change: "Change",
      marketCap: "Market Cap",
    };

    Object.keys(data[0]).forEach((key) => {
      // Check if the key is not "isDelta" or "name"
      if (key !== "isDelta" && key !== "name") {
        const headerText = headerNames[key] || key;
        // Create the table header cell
        const th = this.createTableHeaderCell(headerText, key);
        headerRow.appendChild(th);
      }
    });

    thead.appendChild(headerRow);
    thead.classList.add("financial-table__header");
    table.appendChild(thead);
  }

  private createTableHeaderCell(headerText: string, key: string): HTMLTableHeaderCellElement {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.classList.add("financial-table__header--row");

    // Add the stock class to the company name header
    if (key === "companyName") {
      th.classList.add("financial-table__header--row--stock");
    }
    // Add the numeric class to the price, change, chgPercentage and marketCap headers
    if (key === "price" || key === "change" || key === "chgPercentage" || key === "marketCap") {
      th.classList.add("financial-table__header--row--numeric");
    }

    return th;
  }

  private createTableBody(table: HTMLTableElement, data: FinancialModel[]): void {
    const tbody = document.createElement("tbody");
    // Iterate through each financial model and create a table row
    data.forEach((financialModel) => {
      const row = this.createTableRow(financialModel);
      tbody.appendChild(row);
    });

    tbody.classList.add("financial-table__body");
    table.appendChild(tbody);
  }

  private createTableRow(financialModel: FinancialModel): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.classList.add("financial-table__row");

    Object.entries(financialModel).forEach(([key, value]) => {
      // Check if the key is not "name" or "isDelta"
      if (key !== "name" && key !== "isDelta") {
        const td = this.createTableCell(key, value, financialModel);
        row.appendChild(td);
      }
    });

    return row;
  }

  private createTableCell(key: string, value: any, financialModel: FinancialModel): HTMLTableCellElement {
    const td = document.createElement("td");
    td.classList.add("financial-table__cell");

    if (key === "companyName") {
      this.createStockCell(td, financialModel);
    } else {
      td.textContent = String(value);
    }

    if (["price", "change", "chgPercentage", "marketCap"].includes(key)) {
      td.classList.add("financial-table__cell--numeric");
    }

    if (key === "price") {
      td.textContent = this.formatAsDollars(value);
    }

    if (key === "change") {
      if (financialModel.change !== 0) {
        // Get the absolute value of the change
        const absChangeValue = Math.abs(financialModel.change);
        const arrowIcon = financialModel.change > 0 ? "↑" : "↓";
        td.innerHTML = `${arrowIcon} ${this.formatAsDollars(absChangeValue)}`;
        // Add the positive or negative class to the cell
        if (financialModel.change > 0) {
          td.classList.add("financial-table__cell--numeric--positive");
        } else {
          td.classList.add("financial-table__cell--numeric--negative");
        }
      } else {
        td.textContent = "0.00";
      }
    }
    if (key === "chgPercentage") {
      const chgPercentageValue = parseFloat(financialModel.chgPercentage.replace("%", ""));
      // Check if the chgPercentageValue is a number and not 0
      if (!isNaN(chgPercentageValue) && chgPercentageValue !== 0) {
        const absChgPercentageValue = Math.abs(chgPercentageValue);
        const arrowIcon = chgPercentageValue > 0 ? "↑" : "↓";
        td.innerHTML = `${arrowIcon} ${absChgPercentageValue.toFixed(2)}% `;
        // Add the positive or negative class to the cell
        if (chgPercentageValue > 0) {
          td.classList.add("financial-table__cell--numeric--positive");
        } else {
          td.classList.add("financial-table__cell--numeric--negative");
        }
      } else {
        td.textContent = "0.00%";
      }
    }

    return td;
  }

  private createStockCell(td: HTMLTableCellElement, financialModel: FinancialModel): void {
    td.classList.add("financial-table__cell--stock");
    td.innerHTML = `${financialModel.companyName}<span class="financial-table__cell--stock--name">${financialModel.name}</span>`;
  }

  private formatAsDollars(value: number): string {
    return `$${value.toFixed(2)}`;
  }
}
