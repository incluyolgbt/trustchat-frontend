import { useEffect, useState } from 'react';
import { ProfilePhoto } from '../../../../Components/ProfilePhoto';
import { supabase } from '../../../../supabase/client';
import AsyncSelect from 'react-select';
import './ListItem.css';

function ListItem({ data }) {
  let { contact_id, contact_name, contact_wanum, content, user_id, user_name } =
    data;

  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    setUserOptions([{ value: user_id, label: user_name }]);
  }, []);

  const fetchActiveUsers = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/activeUsers`;
    const response = await fetch(url);
    const data = await response.json();
    const activeUserIds = Object.keys(data);

    let { data: activeUsers, error } = await supabase
      .from('users')
      .select('*')
      .in('id', activeUserIds);

    if (!error) {
      const activeUserMap = activeUsers.map((user) => {
        return { value: user.id, label: user.name };
      });

      activeUserIds.includes(user_id)
        ? setUserOptions(activeUserMap)
        : setUserOptions([
            { value: user_id, label: user_name },
            ...activeUserMap,
          ]);
    }
  };

  const assignConversationToUser = async (user_id, contact) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/assignUser`;

    const body = {
      user_id,
      contact,
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  // Soporte para mensajes en formato JSON
  if (typeof content === 'object' && content.body) {
    content = content.body;
  }

  return (
    <li className='chat-info' key={contact_id}>
      <ProfilePhoto name={contact_name} type={'chat-info--photo--chatList'} />
      <h2 className='chat-info--user'>{contact_name}</h2>
      <p className='chat-info--helper'>Chat asignado a:</p>
      <AsyncSelect
        className='chat-info--asignee-select'
        defaultValue={{ vale: user_id, label: user_name }}
        options={userOptions}
        onChange={(event) => {
          assignConversationToUser(event.value, contact_wanum);
        }}
        onMenuOpen={() => {
          fetchActiveUsers();
        }}
        cacheOptions={false}
      />
    </li>
  );
}

export { ListItem };
