export class MessageRenderer {
  private messageElement: HTMLElement | null;

  constructor(messageElementId: string) {
    this.messageElement = document.getElementById(messageElementId);
  }

  showMessage(message: string, duration: number = 3000): void {
    if (this.messageElement !== null) {
      // Display the message
      this.messageElement.textContent = message;
      // Add the show class to the message element
      this.messageElement.classList.add("-show");

      // Clear the message after a certain duration (adjust as needed)
      setTimeout(() => {
        if (this.messageElement !== null) {
          // Remove the show class from the message element
          this.messageElement.classList.remove("-show");
          this.messageElement.textContent = "";
        }
      }, duration);
    }
  }
}
