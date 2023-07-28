import React, { ChangeEvent, useCallback, useState } from 'react';
import { FetchAPI } from '../../services/utils/fetchAPI';
import { SignUpPostType } from './SignUp.component.types';
import FormInput from '../../components/FormInput/FormInput.component';
import Button from '../../components/Button/Button.component';
import Spinner from '../../components/Spinner/Spinner.component';

function useInputState(initialValue = '') {
  const [value, setValue] = useState<string>(initialValue);
  function handlechange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return {
    value,
    onchange: handlechange,
  };
}

function checkIfButtonIsDisabled(password: string, passwordRepeat: string) {
  return !(password && passwordRepeat) || password !== passwordRepeat;
}

const typewriterArray = [
  'Joke Factory',
  'The best platform',
  'For sharing jokes',
];

export default function SignUp() {
  const userNameInput = useInputState();
  const emailInput = useInputState();
  const passwordInput = useInputState();
  const passwordRepeatInput = useInputState();
  const [apiProgress, setApiProgress] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  const isDisabled = checkIfButtonIsDisabled(
    passwordInput.value,
    passwordRepeatInput.value
  );

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
        await FetchAPI.post('/users', bodyPost);
        setSignUpSuccess(true);
      } catch (err) {
        // later
      }
    },
    [userNameInput.value, emailInput.value, passwordInput.value]
  );

  return (
    <div className="flex items-center justify-center">
      <div>
        {!signUpSuccess && (
          <form className="w-auto border text-center" data-testid="formSignUp">
            <div className="flex h-20 items-center justify-center border-b-2 bg-gray-100 ">
              <h1 className="text-4xl font-bold text-blue-600 ">Sign Up</h1>
            </div>

            <div className="mx-6 my-6">
              <FormInput
                labelName="User Name"
                htmlFor="userName"
                onChange={userNameInput.onchange}
                value={userNameInput.value}
                id="userName"
              />
              <FormInput
                labelName="Email"
                htmlFor="email"
                onChange={emailInput.onchange}
                value={emailInput.value}
                id="email"
              />
              <FormInput
                labelName="Password"
                htmlFor="password"
                onChange={passwordInput.onchange}
                value={passwordInput.value}
                id="password"
                type="password"
              />
              <FormInput
                labelName="Password Repeat"
                htmlFor="passwordRepeat"
                onChange={passwordRepeatInput.onchange}
                value={passwordRepeatInput.value}
                id="passwordRepeat"
                type="password"
              />
              <Button
                onClick={handleSubmit}
                disabled={isDisabled || apiProgress}
              >
                {apiProgress && <Spinner />}
                Sign Up
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
