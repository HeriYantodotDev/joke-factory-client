# Validation

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

    It's quite long huh? Anyway, why don't we just use Axios for ease? Well, I'll like to have some flexibility to control errors.

- Enable Button After Validation.

  Previously we already handled this, so just adding the test for the consistency:

  ```
    test('hides spinner and enables button after response received', async () => {
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

  /o90p

- Mock Service Worker - Override handler
  In the previous two tests, we are modifying the server handler. In order to ensure consistency we have to set it back to the default setting, here's how:

  ```
    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });
  ```

  As you can see in the `beforeEach` we're resetting back the handler to the default one. So we won't have any problem if we refer back to the default behavior.

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
