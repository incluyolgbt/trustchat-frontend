import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import { ListItem } from './ListItem/ListItem';
import { useContext } from 'react';
import { useAuth } from '../../../Hooks/useAuth';
import { AuthContext } from '../../../Context/AuthContext';

const Admin = () => {
  const { authUser } = useContext(AuthContext);
  const { handleLogout } = useAuth();
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
          loadChatList();
          setKey(key + 1);
        }
      )
      .subscribe();
  };

  const loadChatList = async () => {
    // Si el usuario es administrador, obtener conversaciones
    if (authUser && authUser.email === import.meta.env.VITE_ADMIN_ID) {
      let { data, error } = await supabase.rpc('admin_fetch_conv_list');
      if (!error) {
        setAllChats(
          data.map((chat, i) => {
            return <ListItem key={i} data={chat} />;
          })
        );
      }
    } else {
      navigate('/notfound');
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      await loadChatList();
      susbscribeForChanges();
    };
    loadTasks();
  }, []);

  return (
    <div key={key}>
      <header className='chats-header--container'>
        <div className='chat-header--container--options'>
          <h1 className='chats'>Gestión de Chats</h1>
          <button className='header-button--logout' onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <ul className='chats-container'>{allChats}</ul>
    </div>
  );
};
export { Admin };
