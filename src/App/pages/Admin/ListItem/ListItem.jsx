import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListItem.css';
import { ProfilePhoto } from '../../../../Components/ProfilePhoto';
import { supabase } from '../../../../supabase/client';

function ListItem({ data }) {
  let { contact_id, contact_name, content, user_id, user_name } = data;
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    setUserOptions([{ id: user_id, name: user_name }]);
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
      activeUserIds.includes(user_id)
        ? setUserOptions(activeUsers)
        : setUserOptions([{ id: user_id, name: user_name }, ...activeUsers]);
    }
  };

  const assignConversationToUser = async (event) => {
    const newUser = event.target.value;
    // TODO: POST to backend
  };

  // Soporte para mensajes en formato JSON
  if (typeof content === 'object' && content.body) {
    content = content.body;
  }

  return (
    <li className='chat-info' key={contact_id}>
      <ProfilePhoto name={contact_name} type={'chat-info--photo--chatList'} />
      <h2 className='chat-info--user'>{contact_name}</h2>
      <p className='chat-info--message'>
        {content.length < 80 ? content : content.substring(0, 80).concat('...')}
      </p>
      <p className='chat-info--helper'>Chat asignado a:</p>
      <select
        className='chat-info--asignee-select'
        defaultValue={user_id}
        onClick={() => {
          fetchActiveUsers();
        }}
        onChange={(e) => {
          assignConversationToUser(e);
        }}
      >
        {userOptions.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </li>
  );
}

export { ListItem };
