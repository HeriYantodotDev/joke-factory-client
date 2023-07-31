import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch';

// Extend Jest "expect" functionality with Testing Library assertions.
import '@testing-library/jest-dom';

import { API_ROOT_URL } from '../services/utils/fetchAPI';
import SignUp from '../pages/SignUp/SignUp.component';

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const signUpNewUserData = {
  username: 'test1',
  email: 'test1@gmail.com',
  password: 'T3rl4lu@123',
};

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
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    test('disables the button initially', () => {
      render(<SignUp />);
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    let button: HTMLElement | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requestbody: any;
    let counter = 0;

    const server = setupServer(
      rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
        counter += 1;
        requestbody = await req.json();
        const response = await res(ctx.status(200), ctx.json({}));
        return response;
      })
    );

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

    async function renderAndFillPasswordOnly(userEventProp: UserEvent) {
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatinput = screen.getByLabelText('Password Repeat');
      await userEventProp.type(passwordInput, signUpNewUserData.password);
      await userEventProp.type(passwordRepeatinput, signUpNewUserData.password);
      button = screen.queryByRole('button', { name: 'Sign Up' });
    }

    async function renderAndFill(userEventProp: UserEvent) {
      const userNameInput = screen.getByLabelText('User Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatinput = screen.getByLabelText('Password Repeat');

      await userEventProp.type(userNameInput, signUpNewUserData.username);
      await userEventProp.type(emailInput, signUpNewUserData.email);
      await userEventProp.type(passwordInput, signUpNewUserData.password);
      await userEventProp.type(passwordRepeatinput, signUpNewUserData.password);
      button = screen.queryByRole('button', { name: 'Sign Up' });
    }

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

      expect(requestbody).toEqual(signUpNewUserData);
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
  });
});
