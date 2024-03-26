export class LoginNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginNotFoundException';
  }
}

export class InputFormErrorException extends Error {
  constructor(key: string, message: string) {
    const obj: { [key: string]: any } = {};
    obj[key] = [message];
    super(JSON.stringify(obj));
    this.name = 'FormErrorException';
  }
}

export class CannotLoginException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotLoginException';
  }
}
