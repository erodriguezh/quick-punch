export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class CannotSetException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotSetException';
  }
}

export class CannotDeleteException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotDeleteException';
  }
}

export class DataTypeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataTypeException';
  }
}
