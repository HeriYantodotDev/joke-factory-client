import { ErrorResponseSignUp } from '../utils/backEndResponseDataTypes/backEndResponseDataTypes';

export default class SignUpError extends Error {
  public code = 400;

  public errorResponse: ErrorResponseSignUp;

  constructor(errorResponse: ErrorResponseSignUp) {
    const { message } = errorResponse;
    super(message);
    this.errorResponse = errorResponse;
  }
}
