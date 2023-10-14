export {};

declare global {
  interface Window {
    __PRELOADED_STATE__?: { [key: string]: never };
  }

  interface Session {
    authenticated: boolean;
    role: number;
    userID: number;
  }

  interface ResponseBody<T> {
    data: T;
    message: string;
  }
}
