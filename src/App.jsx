import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import "./App.css";
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './components/Home/Home';
import Orders from './components/Orders/Orders';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NotFound from './components/NotFound/NotFound';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';

const About = lazy(() => import('./components/About/About'));
const deploymentBasePath = import.meta.env.BASE_URL.replace(/\/+$/, '');
const basename =
  deploymentBasePath &&
  (window.location.pathname === deploymentBasePath ||
    window.location.pathname.startsWith(`${deploymentBasePath}/`))
    ? deploymentBasePath
    : '/';

const App = () => {
  return (
    <Router basename={basename}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/about"
                element={<About />}
              />
              <Route
                path="/orders"
                element={<Orders />}
              />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;