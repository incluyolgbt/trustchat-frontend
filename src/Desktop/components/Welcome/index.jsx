import React from 'react';
import './Welcome.css';
import { Context } from '../../context';
import { Link } from 'react-router-dom';

function Welcome() {
  const { name } = React.useContext(Context);
  return (
    <>
      <div className='bg-rainbow'></div>
      <h1 className='welcome-text'>Bienvenidx, {name}</h1>
      <h2 className='welcome-link'>Quienes somos</h2>
      <h2 className='welcome-link'>Políticas de privacidad</h2>

      <Link to={'/admin'}>
        <h2 className='welcome-link'>Gestión de Chats</h2>
      </Link>

      <div className='hexagon'></div>
    </>
  );
}

export { Welcome };
