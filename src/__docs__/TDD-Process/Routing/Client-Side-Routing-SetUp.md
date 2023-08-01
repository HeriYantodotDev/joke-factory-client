# Client Side Routing Setting

Let's create a new test document called `App.component.test.tsx`. This new file test will test our App component.

## Client Side Routing set up

Let's try to set up the route first without using any libraries. Now let's get started with the test first:

- The test:

  ```
  describe('Routing', () => {
    function changeUrlAndRender(path: string) {
      window.history.pushState({}, '', path);
      render(<App />);
    }

    test.each`
      path         | pageTestId
      ${'/'}       | ${'homePage'}
      ${'/signup'} | ${'signUpPage'}
      ${'/login'}  | ${'loginPage'}
      ${'/user/1'} | ${'userPage'}
      ${'/user/2'} | ${'userPage'}
    `('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
      changeUrlAndRender(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).toBeInTheDocument();
    });

    test.each`
      path         | pageTestId
      ${'/'}       | ${'signUpPage'}
      ${'/'}       | ${'loginPage'}
      ${'/'}       | ${'userPage'}
      ${'/signup'} | ${'homePage'}
      ${'/signup'} | ${'loginPage'}
      ${'/signup'} | ${'userPage'}
      ${'/login'}  | ${'homePage'}
      ${'/login'}  | ${'signUpPage'}
      ${'/login'}  | ${'userPage'}
      ${'/user/1'} | ${'homePage'}
      ${'/user/1'} | ${'signUpPage'}
      ${'/user/1'} | ${'loginPage'}
    `(
      "doesn't display $pageTestId when path is $path",
      ({ path, pageTestId }) => {
        changeUrlAndRender(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
      }
    );
  });

  ```

  The test above tests the routes and also the page that is displayed. Now let's check implement it in the `App.tsx`

  ```
  import SignUp from './pages/SignUp/SignUp.component';
  import LanguageSelector from './components/LanguageSelector/LanguageSelector.component';
  import HomePage from './pages/HomePage/HomePage.component';
  import Login from './pages/Login/Login.component';
  import User from './pages/User/User.component';

  function App() {
    return (
      <div className="mx-7 mb-10 mt-10">
        {window.location.pathname === '/' && <HomePage />}
        {window.location.pathname === '/signup' && <SignUp />}
        {window.location.pathname === '/login' && <Login />}
        {window.location.pathname.startsWith('/user/') && <User />}
        <LanguageSelector />
      </div>
    );
  }

  export default App;
  ```

  Then let's create each page component for : `Login`, then `User`, and also `HomePage`. At the moment just a a simple component in which has `data-testid` properties like specified in the test.
