# [Working In Progress] Joke Factory Client

# The React App Overview

- Styling
  I'm using TailwindCSS.

# Development

First of all, for testing here are the libraries that we should install:

```
 "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/react": "^14.0.0",
  "@testing-library/user-event": "^14.4.3",
  "@types/jest": "^29.5.2",
  "jest": "^29.6.1",
  "jest-environment-jsdom": "^29.6.1",
  "ts-jest": "^29.1.1",
```

Piuh ... That's a lot! Isn't it!
Here's a great blog to set it up: [jest-vite](https://hung.dev/posts/jest-vite)

For Linting & also formating, I'm using the guidelines from this blog: [setting EsLint](https://github.com/CodingGarden/react-ts-starter), and here's the YouTube Video : [Youtube](https://www.youtube.com/watch?v=cchqeWY0Nak)

Don't forget to create a folder `.vscode` and add this line for TypeScript React. If not, prettier won't detect it.

```
{
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
}
```

## Updating Dependency

To ensure security and also performance, regularly check: `npx npm-check-updates` to check dependency. Then update it either using :

- `npx npm-check-updates --reject <package> -u`
- `npx npm-check-updates --filter <package> -u`
  Here's the guidance: [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

# TDD Process

I'm documenting the process I'm creating this for my future reference.

## Sign Up

[Sign Up Page Component](./src/components/SignUp/SignUp.component.tsx)

- The first test

  - Let's create our first test for the first component which is `SignUp`.

    ```
    import { render, screen } from '@testing-library/react';
    import { SignUp } from '../components/SignUp/SignUp.component';

    test('has a header', () => {
      render(<SignUp />);
      const header = screen.queryByRole(
        'heading',
        { name: 'Sign Up' },
      );
      expect(header).toBeInTheDocument();
    });
    ```

    Now here's the implementation. It's very easy, just need to create a react component, a header and then give it an inner HTML `Sign Up`

    ```
    export function SignUp() {
      return (
        <div>
          <h1>Sign Up</h1>
        </div>
      );
    }
    ```

    Okay, I think that is a good start.

- Sign Up Form Layout.

  This is a very simple test to check the layout. So just check the basic layout.

  - Test:

    ```
    describe('Layout', () => {
    test('has a header', () => {
    render(<SignUp />);
    const header = screen.queryByRole(
    'heading',
    { name: 'Sign Up' },
    );
    expect(header).toBeInTheDocument();
    });

    test('has a username input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('User Name');
    expect(input).toBeInTheDocument();
    });

    test('has an email input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    });

    test('has a password input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('Password');
    expect(input).toBeInTheDocument();
    });

    test('has password type for password input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('Password');

        if (!(input instanceof HTMLInputElement)) {
          fail('Input element is not an HTMLInputElement.');
        }
        expect(input.type).toBe('password');

    });

    test('has a password repeat input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('Password Repeat');
    expect(input).toBeInTheDocument();
    });

    test('has password type for password repeat input', () => {
    render(<SignUp />);
    const input = screen.getByLabelText('Password Repeat');

        if (!(input instanceof HTMLInputElement)) {
          fail('Input element is not an HTMLInputElement.');
        }
        expect(input.type).toBe('password');

    });

    test('has a sign up button', () => {
    render(<SignUp />);
    const button = screen.queryByRole(
    'button',
    { name: 'Sign Up' },
    );
    expect(button).toBeInTheDocument();
    });

    test('disables the button initially', () => {
    render(<SignUp />);
    const button = screen.queryByRole(
    'button',
    { name: 'Sign Up' },
    );
    expect(button).toBeDisabled();
    });
    });
    ```

  - Implementation:
    ```
      export function SignUp() {
        return (
          <div>
            <h1>Sign Up</h1>
            <label htmlFor='userName'>User Name</label>
            <input id='userName' />
            <label htmlFor='email'>Email</label>
            <input id='email' />
            <label htmlFor='password'>Password</label>
            <input id='password' type='password' />
            <label htmlFor='passwordRepeat'>Password Repeat</label>
            <input id='passwordRepeat' type='password' />
            <button disabled>Sign Up</button>
          </div>
        );
      }
    ```

- Form: Input Processing

  - The button in this form is disable initially. Let's make the button is enable after the password & password repeat has the same value.

    - test

      ```
      describe('Interaction', () => {
        test('enables the button when password and password repeat has the same value ', async () => {
          const { user } = setup(< SignUp />);
          const passwordInput = screen.getByLabelText('Password');
          const passwordRepeatinput = screen.getByLabelText('Password Repeat');

          await user.type(passwordInput, 'T3rl4lu@123');
          await user.type(passwordRepeatinput, 'T3rl4lu@123');
          const button = screen.queryByRole('button', { name: 'Sign Up' });
          expect(button).toBeEnabled();

        });
      });

      ```

    - implementation
      As you can see above, we're using React State to update the value of the password. We're using
      custom hooks for the sake of readibility and maintainability. Then to check for whether the button should be disabled or not, we simply check everytime the component is rerendered. Everytime we change the state, React will rerender the component.

      ```
      import { ChangeEvent, useState } from 'react';

      function usePasswordInputState(initialValue: string = '') {
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
        return !(password && passwordRepeat)
          || password !== passwordRepeat;
      }

      export function SignUp() {
        const passwordInput = usePasswordInputState();
        const passwordRepeatInput = usePasswordInputState();

        const isDisabled = checkIfButtonIsDisabled(
          passwordInput.value,
          passwordRepeatInput.value,
        );

        return (
          <div>
            <h1>Sign Up</h1>
            <label htmlFor='userName'>User Name</label>
            <input id='userName' />
            <label htmlFor='email'>Email</label>
            <input id='email' />
            <label htmlFor='password'>Password</label>
            <input onChange={passwordInput.onchange} value={passwordInput.value} id='password' type='password' />
            <label htmlFor='passwordRepeat'>Password Repeat</label>
            <input onChange={passwordRepeatInput.onchange} value={passwordRepeatInput.value}
              id='passwordRepeat' type='password'
            />
            <button disabled={isDisabled} >Sign Up</button>
          </div>
        );
      }
      ```

- Sign Up API Request

  - Let's create a test to submit the button. First we have to mock the back end. Why don't we try
    to test it directly with the backend. First the backend is still on progress, second, it's better to test it in isolation.
    Here's how to mock the backend

    ```
    const mockFn = jest.fn();
    global.fetch = mockFn;
    ```

    This will mock the `fetch` function.
    Now, here's the test:

    ```
    test('sends username, email, and password to backend after clicking the button', async () => {
      const { user } = setup(< SignUp />);
      const userNameInput = screen.getByLabelText('User Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatinput = screen.getByLabelText('Password Repeat');

      await user.type(userNameInput, signUpNewUserData.username);
      await user.type(emailInput, signUpNewUserData.email);
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(passwordRepeatinput, signUpNewUserData.password);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      if (!button) {
        fail('Button is not found');
      }

      const mockFn = jest.fn();

      global.fetch = mockFn;

      await user.click(button);

      const firstCallOfMockFn = mockFn.mock.calls[0];
      const body = JSON.parse(firstCallOfMockFn[1].body);
      expect(body).toEqual(signUpNewUserData);
    });
    ```

  - And here's for the implementation :
    First we create states for each input, and create a function to handle the submit.
    In the function we make a fetch request. For the fetch request, I'm using the built-in `fetch` function, and modified it a little bit, so we don't have a boilerplate code. So it's like this :

    ```
    export const API_ROOT_URL = '/api/1.0';

    export class FetchAPI {
      static async post(apiURL: string, body: object) {
        return await fetch(API_ROOT_URL + apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      }
    }
    ```

    Here's the full implementation:

    ```
    import React, { ChangeEvent, useState } from 'react';

    import {
      FetchAPI,
    } from '../../services/utils/fetchAPI';

    import { SignUpPostType } from './SignUp.component.types';

    function useInputState(initialValue: string = '') {
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
      return !(password && passwordRepeat)
        || password !== passwordRepeat;
    }

    export function SignUp() {
      const userNameInput = useInputState();
      const emailInput = useInputState();
      const passwordInput = useInputState();
      const passwordRepeatInput = useInputState();

      const isDisabled = checkIfButtonIsDisabled(
        passwordInput.value,
        passwordRepeatInput.value,
      );

      async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const bodyPost: SignUpPostType = {
          username: userNameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        };

        const response = await FetchAPI.post('/users', bodyPost);

        console.log(response);  //just log it for a moment
      }

      return (
        <div>
          <form>
            <h1>Sign Up</h1>
            <label htmlFor='userName'>User Name</label>
            <input onChange={userNameInput.onchange} value={userNameInput.value} id='userName' />
            <label htmlFor='email'>Email</label>
            <input onChange={emailInput.onchange} value={emailInput.value} id='email' />
            <label htmlFor='password'>Password</label>
            <input onChange={passwordInput.onchange} value={passwordInput.value} id='password' type='password' />
            <label htmlFor='passwordRepeat'>Password Repeat</label>
            <input onChange={passwordRepeatInput.onchange} value={passwordRepeatInput.value}
              id='passwordRepeat' type='password'
            />
            <button onClick={handleSubmit} disabled={isDisabled} >Sign Up</button>
          </form>
        </div>
      );
    }
    ```

- Mock Service Worker (WSW)
  We must be creating out test, as close as possible to real user interaction.
  Instead for mocking we can use this library: [`mswjs.io`](https://mswjs.io/)

  - So let's use it. First let's install it: `npm i msw --save-dev`
  - In CRA, it already provides polyfill for fetch at node environtment, however Vite doesn't. So we have to install a library to polyfill it. `npm i whatwg-fetch --save-dev`. Here's the detail how to set it up [jestSetUp](https://github.com/mswjs/examples/blob/master/examples/with-jest/jest.setup.js)
  - now we have to import it like this :

    ```
    // Polyfill "window.fetch" used in the React component.
    import 'whatwg-fetch';

    // Extend Jest "expect" functionality with Testing Library assertions.
    import '@testing-library/jest-dom';
    ```

    The problem is that the Data Type for whatwg-fetch is deprecated. However it's still working.

  - In order to check the body of the request in the server we have to implement it directly in our test:

    ```
    import 'whatwg-fetch';

    // Extend Jest "expect" functionality with Testing Library assertions.
    import '@testing-library/jest-dom';

    import { rest } from 'msw';
    import { API_ROOT_URL } from '../services/utils/fetchAPI';
    import { setupServer } from 'msw/node';
    test('sends username, email, and password to backend after clicking the button', async () => {
          let requestbody;
          const server = setupServer(
            rest.post(API_ROOT_URL + '/users', async (req, res, ctx) => {
              requestbody = await req.json();
              return res(ctx.status(200));
            }),
          );
          server.listen();
          const { user } = setup(< SignUp />);
          const userNameInput = screen.getByLabelText('User Name');
          const emailInput = screen.getByLabelText('Email');
          const passwordInput = screen.getByLabelText('Password');
          const passwordRepeatinput = screen.getByLabelText('Password Repeat');

          await user.type(userNameInput, signUpNewUserData.username);
          await user.type(emailInput, signUpNewUserData.email);
          await user.type(passwordInput, signUpNewUserData.password);
          await user.type(passwordRepeatinput, signUpNewUserData.password);
          const button = screen.queryByRole('button', { name: 'Sign Up' });
          if (!button) {
            fail('Button is not found');
          }

          await user.click(button);

          expect(requestbody).toEqual(signUpNewUserData);

          server.close();
        });
    ```

    We don't have to change any implementations, since we're just replacing Mock with the real interaction with the server (msw). The test is a little bit mess up but let's refactor it later.

- Setting up the root URL
  Since we have multiple environments, we have to set it to determine the root URL. So let's set it up in the `fetchAPI.ts` file like this. Luckily, VITE already sets up the default NODE_ENV for each development, test, or production.

  ```
  const env = process.env.NODE_ENV;

  const root =
    env === 'development'
      ? 'http://localhost:3000'
      : env === 'test'
        ? 'http://localhost:5173'
        : '';

  export const API_ROOT_URL = root + '/api/1.0';

  export class FetchAPI {
    static async post(apiURL: string, body: object) {
      return await fetch(API_ROOT_URL + apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
  }
  ```

- Style
  For style, I'm using TailwindCSS.
  Here's to start it up:

  ```
  npm install tailwindcss @tailwindcss/typography @tailwindcss/forms postcss autoprefixer --save-dev
  npx tailwindcss init -p
  ```

  Then create a file `tailwind.config.js` (for the font I'm using Google Font)

  ```
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Lugrasimo', 'Arial', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };

  ```

  Now let's add `index.css` to the main app, and here it is :

  ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  ```

  That's it. Now we can use it. Here's the documentation [tailwindCSS](https://tailwindcss.com/)

- When a user clicks `Sign Up` botton, the browser sends a request to the backend. The problem is the user can click it many times. We don't want it. And also we want to show progress bar

  - First let's create a test to disable the button when there is an ongoing request.

    ```
    test('disables button when there is an ongoing request API call ', async () => {
      let counter = 0;

      const server = setupServer(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          counter += 1;
          const response = await res(ctx.status(200));
          return response;
        })
      );
      server.listen();
      const { user } = setup(<SignUp />);
      const userNameInput = screen.getByLabelText('User Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatinput = screen.getByLabelText('Password Repeat');

      await user.type(userNameInput, signUpNewUserData.username);
      await user.type(emailInput, signUpNewUserData.email);
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(passwordRepeatinput, signUpNewUserData.password);
      const button = screen.queryByRole('button', { name: 'Sign Up' });

      if (!button) {
        fail('Button is not found');
      }

      await user.click(button);
      await user.click(button);

      expect(counter).toBe(1);

      server.close();
    });
    ```

  - The implementation is very simple. In the button component if compare whether the password or passwordRepeat is the same. If it's the same then we set it false. Let's use an OR operator to manipulate the behaviour.
    Let's create a new state `const [apiProgress, setApiProgress] = useState<boolean>(false);`
    After that in the `handleSubmit` function we set the apiProgress to true:

    ```
    const handleSubmit = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const bodyPost: SignUpPostType = {
          username: userNameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        };

        setApiProgress(true);
        await FetchAPI.post('/users', bodyPost);
      },
      [userNameInput.value, emailInput.value, passwordInput.value]
    );
    ```

    then let's use the OR operator in the button `<Button onClick={handleSubmit} disabled={isDisabled || apiProgress}>`.
    By leveraging this operator, we can set disabled to be true since false or true equals true. Very smart right?

  - Now let's create the next test. This time, we'll create a loading spinner when we click submit.

    ```
    test('displays spinner after clicking the submit button', async () => {
      const server = setupServer(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          const response = await res(ctx.status(200));
          return response;
        })
      );
      server.listen();
      const { user } = setup(<SignUp />);
      await renderFillAndClick(user);

      if (!button) {
        fail('Button is not found');
      }

      const spinner1 = screen.queryByRole('status');
      expect(spinner1).not.toBeInTheDocument();

      await user.click(button);

      const spinner2 = screen.getByRole('status');

      expect(spinner2).toBeInTheDocument();

      server.close();
    });
    ```

    Now for the implementation. We create the element Spinner. This is an inline element that shows spinning animation.

    ```
    export default function Spinner() {
      return (
        <span
          role="status"
          className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-red-500 border-r-transparent align-[-0.125em]"
        />
      );
    }
    ```

    Ok and for the implemention, we just check whether the state `apiProgress` is true to display the spinner. Anyway please take a look at the test for this, you can see that to check whether this spinner isn't rendered we use `queryByRole`.

    ```
    <Button onClick={handleSubmit} disabled={isDisabled || apiProgress}>
      {apiProgress && <Spinner />}
      Sign Up
    </Button>
    ```

- Layout - Sign Up Successful
  Now let's create a test for our next feature is to display account activation notification and hides the sign up form.
  However, we have to adjust our previous test first for displays spinner. So how?

  ```
      user.click(button);

      await waitFor(() => {
        const spinner2 = screen.queryByRole('status');
        expect(spinner2).toBeInTheDocument();
      });
  ```

  In the test above we remove await `user.click(button)` amd then wrap the spinner checkin in the `waitFor`. The purpose of this is to ensure the consistency of the test. So after a user clicks a button the next step is the spinner will be rendered and after getting the successful response, the sign up form will be hidden.

  The problem is if we using `await` then we don't know when the response will come back. if it's faster, then the test to check the spinner will be failed. The result of the test will be inconsistent.

  - Here's the test for displays and hide the sign up form

    ```
    test('displays account activation notification after successful sign up', async () => {
      const server = setupServer(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          const response = await res(ctx.status(200));
          return response;
        })
      );

      server.listen();
      const { user } = setup(<SignUp />);
      await renderFillAndClick(user);

      if (!button) {
        fail('Button is not found');
      }

      const message = 'Please check you email to activate your account';
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      await user.click(button);

      const text = await screen.findByText(
        'Please check you email to activate your account'
      );
      expect(text).toBeInTheDocument();
      server.close();
    });

    test('hides sign up form after successful sign up request', async () => {
      const server = setupServer(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          const response = await res(ctx.status(200));
          return response;
        })
      );

      server.listen();
      const { user } = setup(<SignUp />);
      await renderFillAndClick(user);

      if (!button) {
        fail('Button is not found');
      }
      const form = screen.getByTestId('formSignUp');
      user.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
    ```

  - And here's the implementation.
    First we create a new state :

    ```
      const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);
    ```

    This new state will track for the success response from the server.

    Then like this:

    ```
    {!signUpSuccess && ( .. the form element
    ```

- Refactoring The test
  Instead of hardcoding server everytime we run the test, we can use beforeAll and beforeEach for the test

## Validation

- Displaying Validation Errors
  Now let's display a text for validation Errors. If the username is blank then we display the correct validation Error.

  - Test

    ```
    test('displays validation message for username', async () => {
      server.use(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          const response = await res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: 'username is not allowed to be empty',
              },
            })
          );
          return response;
        })
      );
      const { user } = setup(<SignUp />);

      await renderAndFillPasswordOnly(user);

      if (!button) {
        fail('Button is not found');
      }
      await user.click(button);

      const validationError = await screen.findByText(
        'username is not allowed to be empty'
      );

      expect(validationError).toBeInTheDocument();
    });
    ```

  - Implementation
    For the implementation, first we have to create a new state for this:

    ```
    const [errors, setErrors] = useState<ErrorsStateSignUpType>({});
    ```

    Of course we have to set a type for this for consistency:

    ```
    export interface ErrorsStateSignUpType {
      username?: string;
      email?: string;
      password?: string;
    }
    ```

    Now in the `handleSubmit` function, we throw an error if the status code is not okay:

    ```
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
    ```

    Okay as you can see above that first we change the response into Javascript object and then we pass in the response data into the Error Class. Here's the error class:

    ```
    import { ErrorResponseSignUp } from '../../pages/SignUp/SignUp.component.types';

    export default class SignUpError extends Error {
      public code = 400;

      public errorResponse: ErrorResponseSignUp;

      constructor(errorResponse: ErrorResponseSignUp) {
        const { message } = errorResponse;
        super(message);
        this.errorResponse = errorResponse;
      }
    }
    ```

    How about the data type, the data type is the data that we get from the backend:

    ```
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
    ```

    I'm putting all the data types from the backend under the `utils` folder, and within `backEndResponseDataType.ts`

    Now let's render the document like this:

    ```
    <FormInput
      labelName="User Name"
      htmlFor="userName"
      onChange={userNameInput.onchange}
      value={userNameInput.value}
      id="userName"
    />
    <ErrorFormText>{errors.username}</ErrorFormText>
    ```

    And here's the `ErrorFormText`:

    ```
    import { ErrorFormTextType } from './ErrorFormText.types';

    export default function ErrorFormText({ children }: ErrorFormTextType) {
      return <span className="text-sm text-red-500">{children}</span>;
    }
    ```

    It's quite long huh? Anyway, why don't we just use Axio for ease? Well, I'll like to have some flexibility to control errors.

- Enable Button After Validation.

  Previously we already handled this, so just adding the test for the consistency:

  ```
    test('hides spinner and enables button after response receveid', async () => {
      server.use(
        rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
          const response = await res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: 'username is not allowed to be empty',
              },
            })
          );
          return response;
        })
      );
      const { user } = setup(<SignUp />);

      await renderAndFillPasswordOnly(user);

      if (!button) {
        fail('Button is not found');
      }
      await user.click(button);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(button).toBeEnabled();

    });
  ```

- Mock Service Worker - Override handler
  In the previous two tests, we are modifying the server handler. In order to ensure consistency we have to set it back to the default setting, here's how:

  ```
    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });
  ```

  As you can see in the `beforeEach` we're reseting back the handler to the default one. So we won't have any problem if we refer back to the default behaviour.

- $ Component - FormInput
  Now let's add several tests for FormInput component to render error messages. But before that let's create a function in the test to handle the server override:

  ```
    function generateValidationError(
      field = 'username',
      message = 'username is not allowed to be empty'
    ) {
      return rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
        const response = await res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
        return response;
      });
    }
  ```

  Now let's refactor the previous test and also add several tests:

  ```
    test('hides spinner and enables button after response receveid', async () => {
      server.use(generateValidationError());
      const { user } = setup(<SignUp />);

      await renderAndFillPasswordOnly(user);

      if (!button) {
        fail('Button is not found');
      }
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(button).toBeEnabled();
      });
    });

    test.each`
      field         | message
      ${'username'} | ${'username is not allowed to be empty'}
      ${'email'}    | ${'email is not allowed to be empty'}
      ${'password'} | ${'password is not allowed to be empty'}
    `('display $message for $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      const { user } = setup(<SignUp />);

      await renderAndFillPasswordOnly(user);

      if (!button) {
        fail('Button is not found');
      }
      await user.click(button);

      const validationError = await screen.findByText(message);

      expect(validationError).toBeInTheDocument();
    });

    test('displays mismatch message for password repeat input', async () => {
      const { user } = setup(<SignUp />);
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatinput = screen.getByLabelText('Password Repeat');
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(
        passwordRepeatinput,
        `${signUpNewUserData.password}Random`
      );
      const validationErrors = screen.queryByText('Password mismatch');
      expect(validationErrors).toBeInTheDocument();
    });

    test.each`
      field         | message                                  | label
      ${'username'} | ${'username is not allowed to be empty'} | ${'User Name'}
      ${'email'}    | ${'email is not allowed to be empty'}    | ${'Email'}
      ${'password'} | ${'password is not allowed to be empty'} | ${'Password'}
    `(
      'clears validation error after $field is updated',
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        const { user } = setup(<SignUp />);
        await renderAndFillPasswordOnly(user);

        if (!button) {
          fail('Button is not found');
        }

        await user.click(button);
        const validationError = await screen.findByText(message);

        await user.type(screen.getByLabelText(label), 'randomUpdated');

        expect(validationError).not.toBeInTheDocument();
      }
    );
  ```

  The implementation is very simple, here's the full code for `SignUp` and `FormInput` component:

  `SignUp` :

  ```
  function useInputState(
    errors: ErrorsStateSignUpType,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsStateSignUpType>>,
    initialValue = ''
  ) {
    const [values, setValues] = useState<string>(initialValue);

    function handlechange(event: ChangeEvent<HTMLInputElement>) {
      const { id, value } = event.target;
      setValues(value);
      setErrors({
        ...errors,
        [id.toLowerCase()]: '',
      });
    }

    return {
      value: values,
      onchange: handlechange,
    };
  }

  function checkIfButtonIsDisabled(password: string, passwordRepeat: string) {
    return !(password && passwordRepeat) || password !== passwordRepeat;
  }

  export default function SignUp() {
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
            <form className=" w-96 border text-center" data-testid="formSignUp">
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
                  error={errors.username}
                />
                <FormInput
                  labelName="Email"
                  htmlFor="email"
                  onChange={emailInput.onchange}
                  value={emailInput.value}
                  id="email"
                  error={errors.email}
                />
                <FormInput
                  labelName="Password"
                  htmlFor="password"
                  onChange={passwordInput.onchange}
                  value={passwordInput.value}
                  id="password"
                  type="password"
                  error={errors.password}
                />
                <FormInput
                  labelName="Password Repeat"
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
  ```

  And here's the `FormInput` :

  ```
  export default function FormInput({
    labelName,
    htmlFor,
    onChange,
    value,
    id,
    type,
    error,
  }: FormInputProps) {
    return (
      <div>
        <label
          htmlFor={htmlFor}
          className={`
            mt-2 block
            text-left
          `}
        >
          {labelName}
        </label>
        <input
          onChange={onChange}
          value={value}
          id={id}
          type={type || 'text'}
          className={`
            my-2 w-full rounded-md
            border-2 border-gray-300
            ${error ? 'border-red-500' : 'border-gray-300'}
            px-2 py-1
            text-left focus:bg-violet-100
          `}
        />
        {error && <ErrorFormText>{error}</ErrorFormText>}
      </div>
    );
  }
  ```

## Internationalization

For Internationalization, we're going to use this library [React i18next](https://react.i18next.com/).

REMEMBER:
PLEASE use this importing style

```
import * as i18n from 'i18next';
```

instead for

```
import i18n from 'i18next'
```

This is to ensure it will work in JEST test. For implementation, it's the same. Here's the conversation on [github](https://github.com/i18next/react-i18next-gitbook/issues/63)

Also!
When importuing JSON file please use the syntax like this:

```
import * as en from './en.json';
import * as id from './id.json';
```

This to ensure both in the browser and also test are working.

- Setting Up Internationalization i18n
  First let's install both the library `i18next` and `react-i18next` above. After that we create a folder named `locale` and then create a file named `i18n.ts` and here's the code :

  ```
  import * as i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';
  import * as en from './en.json';
  import * as id from './id.json';

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: {
          translation: en,
        },
        id: {
          translation: id,
        },
      },
      lng: 'en',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },
    });

  export default i18n;

  ```

  Please pay attention on the syntax to import both the json file and also the i18n. For somehow I have to import it like that to ensure the test is not broken.

  Then let's create the translation file and also enum. The detail is in the [`Locale` folder](./src/locale/)

  Then in the `SignUp.component.tsx` we import this:

  ```
  import { withTranslation, useTranslation } from 'react-i18next';
  import LOCALE from '../../locale/locale.enum';
  ```

  Then we replace all the label using `t` function :

  ```
  const { t } = useTranslation();

  <h1 className="text-4xl font-bold text-blue-600 ">
    {t(LOCALE.signUp)}
  </h1>
  ```

  Then remove the export default from the functional component and replace the export default with this :

  ```
  const SignUpT = withTranslation()(SignUp);

  export default SignUpT;
  ```

  Even though we changed the name for the default Export, in other component or test where we import it won't fail, but for the sake of consistency let's change all the name to `SignUpT` for consistency.

  Next in the test, we just need to import the i18n like this :

  ```
  import '../locale/i18n';
  ```

- $ Language Selection
- $ Component - Language selector
- $ Validation Translation
- $ Accept Language Header in Api Request
- $ Refactor - Api Request Module

## Routing

- $ client - side routing

- $ Layout - Navbar

- $ Styling NavBar

- $ React Router Version Warning

- $ React Router

- $ Component Life Cycle

- $ Route For account activatin page

- $ Api request - Account activation

- $ Dependency list of useEffect

- $ Progress Indicator - Account Activation

- $ component - Alert & Spinner

- $ Async wait in useEffect

- $ Higher Order Component - HoC

- $ Hooks

# Journal

- July 22 2023 - Setting Up The client Project
  Let's begin this. Start the app with Vite 🌩️. After considering, I think I need to learn properly to do the TDD at React. Instead of trial and error, with the proper guidance, I can use this as a starting point and expand it.
- July 30 2023 - Just reinstalling my Windows & WSl.
