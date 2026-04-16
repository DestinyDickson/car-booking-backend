export enum CarStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  MAINTENANCE = "MAINTENANCE",
}

export class Car {
  constructor(
    public readonly id: string,
    public readonly make: string,
    public readonly model: string,
    public readonly plateNumber: string,
    public status: CarStatus = CarStatus.AVAILABLE
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.make.trim()) {
      throw new Error("Car make is required");
    }

    if (!this.model.trim()) {
      throw new Error("Car model is required");
    }

    if (!this.plateNumber.trim()) {
      throw new Error("Plate number is required");
    }
  }
}