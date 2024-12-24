export class CustomError extends Error {
  constructor(message: string, public readonly publicMessage: string) {
    super(message);
    this.name = "CustomError";
  }
}
