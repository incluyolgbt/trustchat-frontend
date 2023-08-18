import './Notification.css'
import { Link } from 'react-router-dom';
import { ProfilePhoto } from '../../../../Components/ProfilePhoto';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase/client';

function Notification({ chat }) {
    const [userName, setUserName] = useState('');

    const renderAgain = () => {
        ReactDOM.render()
    }

    useEffect(() => {
        const name = async () => {
            try {
                const { data, error } = await supabase.from('contacts').select('name').eq('wa_num', chat.from);
                setUserName(data[0].name)
            } catch (error) {

            }
        }

        name();
    }, []);

    return (
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
        </div>
    );
}

export { Notification };