export {};

declare global {
  interface Window {
    __PRELOADED_STATE__?: { [key: string]: never };
  }

  interface KeyValue {
    [key: string]: any;
  }

  interface Session {
    authenticated: boolean;
    role: number;
    userID: number;
  }

  interface Response<T> {
    data: T;
    message: string;
  }
}
