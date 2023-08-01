import React, { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchAPI } from '../../services/utils/fetchAPI';
import {
  SignUpPostType,
  ErrorsStateSignUpType,
} from './SignUp.component.types';
import SignUpError from '../../services/Errors/SignUpErrorClass';
import FormInput from '../../components/FormInput/FormInput.component';
import Button from '../../components/Button/Button.component';
import Spinner from '../../components/Spinner/Spinner.component';
import LOCALE from '../../locale/locale.enum';

function useInputState(
  errors: ErrorsStateSignUpType,
  setErrors: React.Dispatch<React.SetStateAction<ErrorsStateSignUpType>>,
  initialValue = ''
) {
  const [values, setValues] = useState<string>(initialValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;
    setValues(value);
    setErrors({
      ...errors,
      [id.toLowerCase()]: '',
    });
  }

  return {
    value: values,
    onchange: handleChange,
  };
}

function checkIfButtonIsDisabled(password: string, passwordRepeat: string) {
  return !(password && passwordRepeat) || password !== passwordRepeat;
}

export default function SignUp() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<ErrorsStateSignUpType>({});
  const userNameInput = useInputState(errors, setErrors);
  const emailInput = useInputState(errors, setErrors);
  const passwordInput = useInputState(errors, setErrors);
  const passwordRepeatInput = useInputState(errors, setErrors);
  const [apiProgress, setApiProgress] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  const isDisabled = checkIfButtonIsDisabled(
    passwordInput.value,
    passwordRepeatInput.value
  );

  const passwordMismatch =
    passwordInput.value !== passwordRepeatInput.value
      ? 'Password mismatch'
      : '';

  const handleSubmit = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        event.preventDefault();
        const bodyPost: SignUpPostType = {
          username: userNameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        };
        setApiProgress(true);
        const response = await FetchAPI.post('/users', bodyPost);

        const data = await response.json();

        // To Do: Create a handling error function to make this function cleaner

        if (!response.ok && response.status === 400) {
          throw new SignUpError(data);
        }

        setSignUpSuccess(true);
      } catch (err) {
        if (err instanceof SignUpError) {
          setErrors(err.errorResponse.validationErrors || {});
        }
        setApiProgress(false);
      }
    },
    [userNameInput.value, emailInput.value, passwordInput.value]
  );

  return (
    <div className="flex items-center justify-center">
      <div>
        {!signUpSuccess && (
          <form className="w-80 border text-center" data-testid="formSignUp">
            <div className="flex h-20 items-center justify-center border-b-2 bg-gray-100 ">
              <h1 className="text-4xl font-bold text-blue-600 ">
                {t(LOCALE.signUp)}
              </h1>
            </div>

            <div className="mx-6 my-6">
              <FormInput
                labelName={t(LOCALE.username)}
                htmlFor="userName"
                onChange={userNameInput.onchange}
                value={userNameInput.value}
                id="userName"
                error={errors.username}
              />
              <FormInput
                labelName={t(LOCALE.email)}
                htmlFor="email"
                onChange={emailInput.onchange}
                value={emailInput.value}
                id="email"
                error={errors.email}
              />
              <FormInput
                labelName={t(LOCALE.password)}
                htmlFor="password"
                onChange={passwordInput.onchange}
                value={passwordInput.value}
                id="password"
                type="password"
                error={errors.password}
              />
              <FormInput
                labelName={t(LOCALE.passwordRepeat)}
                htmlFor="passwordRepeat"
                onChange={passwordRepeatInput.onchange}
                value={passwordRepeatInput.value}
                id="passwordRepeat"
                type="password"
                error={passwordMismatch}
              />
              <Button
                onClick={handleSubmit}
                disabled={isDisabled || apiProgress}
              >
                {apiProgress && <Spinner />}
                {t(LOCALE.signUp)}
              </Button>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="mt-2 w-auto rounded-b border-t-4  border-blue-500 bg-blue-100 px-4 py-3 text-blue-900 shadow-md">
            Please check you email to activate your account
          </div>
        )}
      </div>
    </div>
  );
}
