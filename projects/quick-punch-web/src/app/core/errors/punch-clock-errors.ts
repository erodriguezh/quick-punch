export class LoginNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginNotFoundException';
  }
}

export class InputFormErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InputFormErrorException';
  }
}

export class CannotLoginException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotLoginException';
  }
}
