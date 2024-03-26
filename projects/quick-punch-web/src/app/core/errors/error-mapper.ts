import {
  CannotLoginException,
  InputFormErrorException,
  LoginNotFoundException,
} from './punch-clock-errors';

import {
  CannotDeleteException,
  CannotSetException,
  DataTypeException,
  NotFoundException
} from './storage-errors';

export const errorMapper = (error: { name: string; message: string }): Error => {
  switch (error.name) {
    case 'CannotLoginException':
      throw new CannotLoginException(error.message);
    case 'InputFormErrorException':
      throw new InputFormErrorException(error.message);
    case 'LoginNotFoundException':
      throw new LoginNotFoundException(error.message);
    case 'CannotDeleteException':
      throw new CannotDeleteException(error.message);
    case 'CannotSetException':
      throw new CannotSetException(error.message);
    case 'DataTypeException':
      throw new DataTypeException(error.message);
    case 'NotFoundException':
      throw new NotFoundException(error.message);
    default:
      throw new Error('An unknown error occurred');
  }
}
