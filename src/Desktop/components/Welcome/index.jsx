import { useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import './Welcome.css';

function Welcome() {
  const { authUser } = useContext(AuthContext);
  return (
    <>
      <div className='bg-rainbow'></div>
      <h1 className='welcome-text'>Bienvenide, {authUser.name}</h1>
      <h2 className='welcome-link'>Quienes somos</h2>
      <h2 className='welcome-link'>Políticas de privacidad</h2>

      <div className='hexagon'></div>
    </>
  );
}

export { Welcome };
