# Sign Up Component

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
          const passwordRepeatInput = screen.getByLabelText('Password Repeat');

          await user.type(passwordInput, 'T3rl4lu@123');
          await user.type(passwordRepeatInput, 'T3rl4lu@123');
          const button = screen.queryByRole('button', { name: 'Sign Up' });
          expect(button).toBeEnabled();

        });
      });

      ```

    - implementation
      As you can see above, we're using React State to update the value of the password. We're using
      custom hooks for the sake of readability and maintainability. Then to check for whether the button should be disabled or not, we simply check every time the component is rerendered. Every time we change the state, React will rerender the component.

      ```
      import { ChangeEvent, useState } from 'react';

      function usePasswordInputState(initialValue: string = '') {
        const [value, setValue] = useState<string>(initialValue);
        function handleChange(event: ChangeEvent<HTMLInputElement>) {
          setValue(event.target.value);
        }

        return {
          value,
          onchange: handleChange,
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
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');

      await user.type(userNameInput, signUpNewUserData.username);
      await user.type(emailInput, signUpNewUserData.email);
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(passwordRepeatInput, signUpNewUserData.password);
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
      function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
      }

      return {
        value,
        onchange: handleChange,
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
  - In CRA, it already provides polyfill for fetch at node environment, however Vite doesn't. So we have to install a library to polyfill it. `npm i whatwg-fetch --save-dev`. Here's the detail how to set it up [jestSetUp](https://github.com/mswjs/examples/blob/master/examples/with-jest/jest.setup.js)
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
          let requestBody;
          const server = setupServer(
            rest.post(API_ROOT_URL + '/users', async (req, res, ctx) => {
              requestBody = await req.json();
              return res(ctx.status(200));
            }),
          );
          server.listen();
          const { user } = setup(< SignUp />);
          const userNameInput = screen.getByLabelText('User Name');
          const emailInput = screen.getByLabelText('Email');
          const passwordInput = screen.getByLabelText('Password');
          const passwordRepeatInput = screen.getByLabelText('Password Repeat');

          await user.type(userNameInput, signUpNewUserData.username);
          await user.type(emailInput, signUpNewUserData.email);
          await user.type(passwordInput, signUpNewUserData.password);
          await user.type(passwordRepeatInput, signUpNewUserData.password);
          const button = screen.queryByRole('button', { name: 'Sign Up' });
          if (!button) {
            fail('Button is not found');
          }

          await user.click(button);

          expect(requestBody).toEqual(signUpNewUserData);

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

- When a user clicks `Sign Up` button, the browser sends a request to the backend. The problem is the user can click it many times. We don't want it. And also we want to show progress bar

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
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');

      await user.type(userNameInput, signUpNewUserData.username);
      await user.type(emailInput, signUpNewUserData.email);
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(passwordRepeatInput, signUpNewUserData.password);
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

  - The implementation is very simple. In the button component if compare whether the password or passwordRepeat is the same. If it's the same then we set it false. Let's use an OR operator to manipulate the behavior.
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

    Ok and for the implementation, we just check whether the state `apiProgress` is true to display the spinner. Anyway please take a look at the test for this, you can see that to check whether this spinner isn't rendered we use `queryByRole`.

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

  In the test above we remove await `user.click(button)` amd then wrap the spinner in the `waitFor`. The purpose of this is to ensure the consistency of the test. So after a user clicks a button the next step is the spinner will be rendered and after getting the successful response, the sign up form will be hidden.

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
  Instead of hardcoding server every time we run the test, we can use beforeAll and beforeEach for the test
