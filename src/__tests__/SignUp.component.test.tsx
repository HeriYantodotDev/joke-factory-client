import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import i18n from '../locale/i18n';
// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch';

// Extend Jest "expect" functionality with Testing Library assertions.
import '@testing-library/jest-dom';

import { API_ROOT_URL } from '../services/utils/fetchAPI';
import SignUp from '../pages/SignUp/SignUp.component';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector.component';

import * as en from '../locale/en.json';
import * as id from '../locale/id.json';

const signUpNewUserData = {
  username: 'test1',
  email: 'test1@gmail.com',
  password: 'T3rl4lu@123',
};

let button: HTMLElement | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let requestBody: any;
let counter = 0;
let acceptLanguageHeader: string | null;

const server = setupServer(
  rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
    counter += 1;
    requestBody = await req.json();
    acceptLanguageHeader = req.headers.get('Accept-Language');
    const response = await res(ctx.status(200), ctx.json({}));
    return response;
  })
);

async function renderAndFillPasswordOnly(userEventProp: UserEvent) {
  const passwordInput = screen.getByLabelText('Password');
  const passwordRepeatInput = screen.getByLabelText('Password Repeat');
  await userEventProp.type(passwordInput, signUpNewUserData.password);
  await userEventProp.type(passwordRepeatInput, signUpNewUserData.password);
  button = screen.queryByRole('button', { name: en.signUp });
}

async function renderAndFill(userEventProp: UserEvent) {
  const userNameInput = screen.getByLabelText('User Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const passwordRepeatInput = screen.getByLabelText('Password Repeat');

  await userEventProp.type(userNameInput, signUpNewUserData.username);
  await userEventProp.type(emailInput, signUpNewUserData.email);
  await userEventProp.type(passwordInput, signUpNewUserData.password);
  await userEventProp.type(passwordRepeatInput, signUpNewUserData.password);
  button = screen.queryByRole('button', { name: 'Sign Up' });
}

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe('Sign Up Page', () => {
  describe('Layout', () => {
    test('has a header', () => {
      render(<SignUp />);
      const header = screen.queryByRole('heading', { name: 'Sign Up' });
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
      const buttonOnly = screen.queryByRole('button', { name: 'Sign Up' });
      expect(buttonOnly).toBeInTheDocument();
    });

    test('disables the button initially', () => {
      render(<SignUp />);
      const buttonOnly = screen.queryByRole('button', { name: 'Sign Up' });
      expect(buttonOnly).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    test('enables the button when password and password repeat has the same value ', async () => {
      const { user } = setup(<SignUp />);
      await renderAndFill(user);
      expect(button).toBeEnabled();
    });

    test('sends username, email, and password to backend after clicking the button', async () => {
      const { user } = setup(<SignUp />);
      await renderAndFill(user);

      if (!button) {
        fail('Button is not found');
      }

      await user.click(button);

      expect(requestBody).toEqual(signUpNewUserData);
    });

    test('disables button when there is an ongoing request API call ', async () => {
      const { user } = setup(<SignUp />);
      await renderAndFill(user);

      if (!button) {
        fail('Button is not found');
      }

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(counter).toBe(1);
    });

    test('displays spinner after clicking the submit button', async () => {
      server.listen();
      const { user } = setup(<SignUp />);
      await renderAndFill(user);

      if (!button) {
        fail('Button is not found');
      }

      const spinner1 = screen.queryByRole('status');
      expect(spinner1).not.toBeInTheDocument();

      user.click(button);

      await waitFor(() => {
        const spinner2 = screen.queryByRole('status');
        expect(spinner2).toBeInTheDocument();
      });
    });

    test('displays account activation notification after successful sign up', async () => {
      const { user } = setup(<SignUp />);
      await renderAndFill(user);

      if (!button) {
        fail('Button is not found');
      }

      const message = 'Please check you email to activate your account';
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      await user.click(button);

      await waitFor(() => {
        const text = screen.getByText(
          'Please check you email to activate your account'
        );
        expect(text).toBeInTheDocument();
      });
    });

    test('hides sign up form after successful sign up request', async () => {
      const { user } = setup(<SignUp />);
      await renderAndFill(user);

      if (!button) {
        fail('Button is not found');
      }
      const form = screen.getByTestId('formSignUp');
      user.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

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

    test('hides spinner and enables button after response received', async () => {
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
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');
      await user.type(passwordInput, signUpNewUserData.password);
      await user.type(
        passwordRepeatInput,
        `${signUpNewUserData.password}Random`
      );
      const validationErrors = screen.queryByText(en.passwordMismatch);
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
  });

  describe('Internationalization', () => {
    const renderSetup = (
      <div>
        <SignUp />
        <LanguageSelector />
      </div>
    );

    afterEach(() => {
      act(() => {
        i18n.changeLanguage('en');
      });
    });

    test('initially displays all text in English', () => {
      render(<SignUp />);
      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: en.signUp })
      ).toBeInTheDocument();

      expect(screen.getByLabelText(en.username)).toBeInTheDocument();

      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    test('displays all text in Indonesia after changing the language to Indonesian', async () => {
      const { user } = setup(renderSetup);

      const idToggle = screen.getByTitle('Indonesian');

      await user.click(idToggle);

      expect(
        screen.getByRole('heading', { name: id.signUp })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: id.signUp })
      ).toBeInTheDocument();

      expect(screen.getByLabelText(id.username)).toBeInTheDocument();

      expect(screen.getByLabelText(id.email)).toBeInTheDocument();
      expect(screen.getByLabelText(id.password)).toBeInTheDocument();
      expect(screen.getByLabelText(id.passwordRepeat)).toBeInTheDocument();
    });

    test('displays all text in English after changing the language', async () => {
      const { user } = setup(renderSetup);

      const idToggle = screen.getByTitle('Indonesian');

      await user.click(idToggle);

      const enToggle = screen.getByTitle('English');

      await user.click(enToggle);

      expect(
        screen.getByRole('heading', { name: en.signUp })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: en.signUp })
      ).toBeInTheDocument();

      expect(screen.getByLabelText(en.username)).toBeInTheDocument();

      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    test('displays password mismatch validation in Indonesian', async () => {
      const { user } = setup(renderSetup);

      const idToggle = screen.getByTitle('Indonesian');

      await user.click(idToggle);

      const passwordInput = screen.getByLabelText(id.password);

      await user.type(passwordInput, 'random');

      const validationMessageInID = screen.queryByText(id.passwordMismatch);
      expect(validationMessageInID).toBeInTheDocument();
    });

    test('sends accept language header as EN for outgoing request', async () => {
      const { user } = setup(renderSetup);
      await renderAndFillPasswordOnly(user);

      if (!button) {
        fail('Button is not found');
      }

      await user.click(button);

      await waitFor(() => {
        expect(acceptLanguageHeader).toBe('en');
      });
    });

    test('sends accept language header as ID for outgoing request after selecting language', async () => {
      const { user } = setup(renderSetup);

      await renderAndFillPasswordOnly(user);

      const idToggle = screen.getByTitle('Indonesian');

      await user.click(idToggle);

      if (!button) {
        fail('Button is not found');
      }

      await user.click(button);

      await waitFor(() => {
        expect(acceptLanguageHeader).toBe('id');
      });
    });
  });
});
