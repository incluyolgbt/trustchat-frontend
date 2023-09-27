import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import { ListItem } from './ListItem/ListItem';

const Admin = () => {
  const handleLogOut = () => {
    supabase.auth.signOut();
  };

  const navigate = useNavigate();
  const [allChats, setAllChats] = useState([]);
  const [key, setKey] = useState(1);

  const susbscribeForChanges = () => {
    supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => {
          console.log('update');
          loadChatList();
          setKey(key + 1);
        }
      )
      .subscribe();
  };

  const loadChatList = async (user) => {
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
  };

  const authenticate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  /** On component render **/
  useEffect(() => {
    (async function () {
      const user = await authenticate();
      loadChatList(user);
      susbscribeForChanges();
    })();
  }, []);

  return (
    <div key={key}>
      <header className='chats-header--container'>
        <div className='chat-header--container--options'>
          <h1 className='chats'>Gestión de Chats</h1>
          <button className='header-button--logout' onClick={handleLogOut}>
            Log out
          </button>
        </div>
      </header>
      <ul className='chats-container'>{allChats}</ul>
    </div>
  );
};
export { Admin };
