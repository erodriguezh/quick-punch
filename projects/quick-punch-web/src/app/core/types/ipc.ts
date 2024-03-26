export interface IpcResponse {
  success: boolean;
  error?: {
    name: string;
    message: string;
  };
}

export interface IpcDataResponse<T> {
  success: boolean;
  value?: T;
  error?: {
    name: string;
    message: string;
  };
}
