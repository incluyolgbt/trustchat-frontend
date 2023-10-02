import { Link } from 'react-router-dom';
import { ProfilePhoto } from '../../../../Components/ProfilePhoto';
import './ChatsList.css';

function ChatsList({ c }) {
  return Object.keys(c).map((chat) => (
    <Link key={chat} to={`/conversations/${chat}`}>
      <li className='desktop-chat-info'>
        <ProfilePhoto
          name={c[chat].name}
          type={'desktop-chat-info--photo--chatList'}
        />
        <h2 className='desktop-chat-info--user'>{c[chat].name}</h2>
        <p className='desktop-chat-info--message'>
          {`${c[chat].direction === 'output' ? 'Tú: ' : ''}` +
            (c[chat].text.length < 80
              ? c[chat].text
              : c[chat].text.substring(0, 80).concat('...'))}
        </p>
      </li>
    </Link>
  ));
}

export { ChatsList };
