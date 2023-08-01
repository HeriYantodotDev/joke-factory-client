# Internationalization

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
When importing JSON file please use the syntax like this:

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

- Language Selection
  First off all let's create a test to test for the language selection:

  ```
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
  });
  ```

  As you can see above that we're testing whether we have a LanguageSelector component, and test the interaction between it.

  For the implementation let's create a component for it :

  ```
  import { useTranslation } from 'react-i18next';

  export default function LanguageSelector() {
    const { i18n } = useTranslation();

    function onClickIndonesian() {
      i18n.changeLanguage('id');
    }

    function onClickEnglish() {
      i18n.changeLanguage('en');
    }

    return (
      <div>
        <button type="button" onClick={onClickEnglish}>
          <img
            className="h-5 w-9"
            title="English"
            alt="US Flag"
            src="https://raw.githubusercontent.com/HeriYantodotDev/image-repos/main/us.png"
          />
        </button>
        <button type="button" onClick={onClickIndonesian}>
          <img
            className="h-5 w-9"
            title="Indonesian"
            alt="Indonesian Flag"
            src="https://raw.githubusercontent.com/HeriYantodotDev/image-repos/main/id.png"
          />
        </button>
      </div>
    );
  }

  ```

  Great now let's import it in the `App.tsx`

  ```
  import SignUp from './pages/SignUp/SignUp.component';
  import LanguageSelector from './components/LanguageSelector/LanguageSelector.component';

  function App() {
    return (
      <div className="mx-7 mb-10 mt-10">
        <SignUp />
        <LanguageSelector />
      </div>
    );
  }

  export default App;

  ```

  Anyway since we're using hooks `useTranslation` we don't have to wrap the SignUp component in a higher order component. It's the same with `LanguageSelector` component.

- Validation Translation

  - Let's working on the client validation first, and this one is for Password mismatch.
    Here's the test :

    ```
    test('displays password mismatch validation in Indonesian', async () => {
      const { user } = setup(renderSetup);

      const idToggle = screen.getByTitle('Indonesian');

      await user.click(idToggle);

      const passwordInput = screen.getByLabelText(id.password);

      await user.type(passwordInput, 'random');

      const validationMessageInID = screen.queryByText(id.passwordMismatch);
      expect(validationMessageInID).toBeInTheDocument();
    });
    ```

    Great now let's move to the implementation. First of all, let's create a translation file for both `EN` and `ID`. Also for `LOCALE` enum. After that in the `SignUp` component, we implement this :

    ```
    const passwordMismatch =
      passwordInput.value !== passwordRepeatInput.value
        ? LOCALE.passwordMismatch
        : '';
    ```

    Yup that's it.

  - Now let's working on the server validation.

    Before we start it's great to revisit about the way we import `i18n` in the `i18n.ts`:

    ```
    import * as i18n from 'i18next';
    ```

    This is for the jest configuration. Then in order to use this library in order to check the current language is using `.default`.

    However there will be a problem when we have to access the languages properties both in the jest and also the browser. The workaround is using ternary operator like this :

    ```
    i18n.default?.language || (i18n as any).language
    ```

    This is the workaround for the the situation. TypeScript is really a thing, huh?

    Now here's the test :

    ```
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
    ```

    In the tests above, we are checking whether when we send the request to the back end, we also send the language for the header.

    Here's the implementation:

    ```
    import i18n from '../../locale/i18n';

    const env = process.env.NODE_ENV;

    interface EnvRootMap {
      [key: string]: string;
    }

    const envRootMap: EnvRootMap = {
      development: 'http://localhost:3000',
      test: 'http://localhost:5173',
      production: 'define-it-later',
    };

    if (!env) {
      throw new Error('Please set the environment variable');
    }

    const root = envRootMap[env] || 'define-it-later';

    export const API_ROOT_URL = `${root}/api/1.0`;

    export class FetchAPI {
      static async post(apiURL: string, body: object) {
        const response = await fetch(API_ROOT_URL + apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'Accept-Language': i18n.default?.language || (i18n as any).language,
            //  The reason for using (i18n as any).language as a fallback is related to Jest testing.
          },
          body: JSON.stringify(body),
        });

        return response;
      }
    }

    ```

    In the implementation above, we are using `i18n` library in order to detect the language that is being used. However due to Jest Import system, we have to use `OR` operator to determined the value of the language. So at Jest, it couldn't read `.default` properties.
