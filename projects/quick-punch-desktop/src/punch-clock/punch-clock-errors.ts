export class LoginNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginNotFoundException';
  }
}

export class InputFormErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormErrorException';
  }
}

export class CannotLoginException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotLoginException';
  }
}
