import { render, screen } from '@testing-library/react';
import App from '../App';

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
