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
