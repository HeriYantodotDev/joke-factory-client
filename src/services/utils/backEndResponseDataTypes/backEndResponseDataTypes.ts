export interface ErrorResponseSignUp {
  message: string;
  path: string;
  timeStamp: string;
  validationErrors?: {
    username?: string;
    email?: string;
    password?: string;
  };
}
