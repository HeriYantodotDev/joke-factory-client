import { ErrorResponseSignUp } from '../../services/utils/backEndResponseDataTypes/backEndResponseDataTypes';

export interface SignUpPostType {
  username: string;
  email: string;
  password: string;
}

export interface ErrorsStateSignUpType {
  username?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
}

export interface ErrorsSignUpType extends Error {
  response?: {
    status: number;
    data: ErrorResponseSignUp;
  };
}
