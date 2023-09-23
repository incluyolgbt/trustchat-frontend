import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

import './PasswordReset.css';

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (password && passwordConfirm) {
      password === passwordConfirm
        ? setPasswordError(false)
        : setPasswordError(true);
    }
  }, [password, passwordConfirm]);

  const handleSubmit = async () => {
    if (!passwordError) {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (!error) {
        navigate('/conversations');
      }
    }
  };

  return (
    <div className='pwreset--container'>
      <div className='pwreset--content'>
        <h1>Restablecer contraseña</h1>
        {passwordError && (
          <div className='pwreset--error'>Las contraseñas no cooinciden.</div>
        )}
        <p>Introduce tu nueva contraseña</p>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='new-password'
        />
        <p>Confirma tu contraseña</p>
        <input
          type='password'
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button className='button-3' onClick={() => handleSubmit()}>
          Restablecer contraseña
        </button>
      </div>
    </div>
  );
};

export { PasswordReset };
