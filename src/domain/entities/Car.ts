export enum CarStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED',
    MAINTENANCE = 'MAINTENANCE'
  }
  
  export class Car {
    constructor(
      public readonly id: string,
      public readonly make: string,
      public readonly model: string,
      public readonly plateNumber: string,
      public status: CarStatus = CarStatus.AVAILABLE
    ) {}
  }