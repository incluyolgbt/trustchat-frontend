import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Context } from '../../Context';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logInError, setLogInError] = useState(false);
  const { socket } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase.auth.getSession()) {
      navigate('/login');
    } else {
      navigate('/conversations');
    }
  }, [navigate]);

  const handlerSubmit = (e) => {
    e.preventDefault();

    supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((data) => {
        if (data.error?.message === 'Invalid login credentials') {
          setLogInError(true);
        } else {
          socket.emit('authenticate', {
            user_id: data.data.user.id,
            user_name: data.data.user.name,
          });
          navigate('/conversations');
        }
      });
  };

  return (
    <div className='background-login'>
      <form
        className={`form-login${logInError ? '--error' : ''}`}
        onSubmit={handlerSubmit}
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
