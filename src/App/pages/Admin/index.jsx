import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import { ListItem } from './ListItem/ListItem';
import './Admin.css';

const {
  data: { user },
} = await supabase.auth.getUser();

const Admin = () => {
  const handleLogOut = () => {
    supabase.auth.signOut();
  };

  const navigate = useNavigate();
  const [allChats, setAllChats] = useState([]);

  /** On component render **/
  useEffect(() => {
    (async function fetchMessages() {
      // Si el usuario es administrador, obtener conversaciones
      if (user && user.email === import.meta.env.VITE_ADMIN_ID) {
        let { data, error } = await supabase.rpc('admin_fetch_conv_list');
        if (!error) {
          setAllChats(
            data.map((chat, i) => {
              return <ListItem key={i} data={chat} />;
            })
          );
        } else {
          console.log(error);
        }
      } else {
        navigate('/login');
      }
    })();
  }, []);

  return (
    <>
      <header className='chats-header--container'>
        <div className='chat-header--container--options'>
          <h1 className='chats'>Gestión de Chats</h1>
          <button className='header-button--logout' onClick={handleLogOut}>
            Log out
          </button>
        </div>
      </header>
      <ul className='chats-container'>{allChats}</ul>
    </>
  );
};
export { Admin };
