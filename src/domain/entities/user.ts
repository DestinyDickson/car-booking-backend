export enum UserRole {
  GUEST = 'GUEST',
  REGISTERED = 'REGISTERED',
  ADMIN = 'ADMIN'
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole
  ) {}
}