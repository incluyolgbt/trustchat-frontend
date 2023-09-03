import './Notification.css'
import { Link } from 'react-router-dom';
import { ProfilePhoto } from '../ProfilePhoto';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';

function Notification({ chat, general }) {
    const [userName, setUserName] = useState('');

    const renderAgain = () => {
        ReactDOM.render()
    }
    useEffect(() => {
        const name = async () => {
            try {
                const { data, error } = await supabase.from('contacts').select('name').eq('id', chat.from);
                setUserName(data[0]?.name)
            } catch (error) {

            }
        }
        name();
    }, []);

    return (
        (general ?
            <div
                className="notification-container ">
                <Link
                    className='notification-container--link'
                    to={`/conversations/general`}
                    onClick={renderAgain}
                >
                    <img className="notification-photo" src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4' />
                    <div className='notification-user--info'>
                        <h2 className="notification-user">{chat.name}</h2>
                        <p className="notification-message">{
                            chat.text}</p>
                    </div>
                </Link>
                <div className='notification-line'></div>
            </div>
            :
            <div
                className="notification-container ">
                <Link
                    className='notification-container--link'
                    to={`/conversations/${chat.from}`}
                    onClick={renderAgain}
                >
                    <ProfilePhoto name={userName} type={"notification-photo"} />
                    <div className='notification-user--info'>
                        <h2 className="notification-user">{userName}</h2>
                        <p className="notification-message">{
                            chat.text}</p>
                    </div>
                </Link>
                <div className='notification-line'></div>
            </div>)
    );
}

export { Notification };