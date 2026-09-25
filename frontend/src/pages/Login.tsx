// pages/migrated-repo/Login.tsx
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(username, password)
      .then((response) => {
        history.push('/welcome');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <br />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/registration">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
// pages/migrated-repo/Registration.tsx
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { registration } from '../api/auth';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    registration(username, password, passwordConfirm)
      .then((response) => {
        history.push('/welcome');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <br />
        <label>Confirm Password:</label>
        <input type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} />
        <br />
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Registration;
// pages/migrated-repo/Welcome.tsx
import React from 'react';

const Welcome = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>You are now logged in.</p>
    </div>
  );
};

export default Welcome;
// App.tsx
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/migrated-repo/Login';
import Registration from './pages/migrated-repo/Registration';
import Welcome from './pages/migrated-repo/Welcome';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/registration" component={Registration} />
        <Route path="/welcome" component={Welcome} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
// api/auth.ts
import axios from 'axios';

const auth = axios.create({
  baseURL: '/api/auth',
});

const login = (username, password) => {
  return auth.post('/login', { username, password });
};

const registration = (username, password, passwordConfirm) => {
  return auth.post('/registration', { username, password, passwordConfirm });
};

export { auth, login, registration };
// components/layout/Layout.tsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/registration">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;