import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { handlePasswordLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logInError, setLogInError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await handlePasswordLogin(email, password);
    if (error && error.message.includes('Invalid login credentials')) {
      setLogInError(true);
    } else {
      navigate('/conversations');
    }
  };

  return (
    <div className='background-login'>
      <form
        className={`form-login${logInError ? '--error' : ''}`}
        onSubmit={handleSubmit}
      >
        <h1>Login</h1>
        <input
          className='form-login--email'
          type='email'
          name='email'
          placeholder='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='form-login--password'
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        {logInError ? (
          <p className='form-login--error--message'>
            Email o contraseña incorrecta
          </p>
        ) : null}
        <button className='form-login--button'>Log in</button>
      </form>
    </div>
  );
}

export { Login };
