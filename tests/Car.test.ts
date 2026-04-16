import { Car, CarStatus } from "../src/domain/entities/Car";

describe("Car entity", () => {
  it("should create a valid car", () => {
    const car = new Car("1", "Toyota", "Corolla", "ABC123");

    expect(car.id).toBe("1");
    expect(car.status).toBe(CarStatus.AVAILABLE);
  });

  it("should throw if make is empty", () => {
    expect(() => new Car("1", "", "Corolla", "ABC123")).toThrow(
      "Car make is required"
    );
  });

  it("should throw if model is empty", () => {
    expect(() => new Car("1", "Toyota", "", "ABC123")).toThrow(
      "Car model is required"
    );
  });

  it("should throw if plate number is empty", () => {
    expect(() => new Car("1", "Toyota", "Corolla", "")).toThrow(
      "Plate number is required"
    );
  });
});