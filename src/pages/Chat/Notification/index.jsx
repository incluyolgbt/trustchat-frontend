import './Notification.css'
import { Link } from 'react-router-dom';
import { ProfilePhoto } from '../../../Components/ProfilePhoto';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/client';

function Notification({ chat }) {
    const [visibility, setVisibility] = useState('')

    const [userName, setUserName] = useState('');

    const notificationHandler = ()=> {
        setVisibility('none')
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

    // NECESITO HACER UN TOGGLE PARA QUE NO SE DESAPAREZCA PARA SIEMPRE
    
    useEffect(()=>{
        setTimeout(()=>{
            notificationHandler();
        }, 10000) // 5 seg
    }, [userName])

    return (
        <div 
        className={`notification-container ${visibility}`}
        onClick={notificationHandler}>
            <Link 
            className='notification-container--link'
            to={`/conversation/${chat.from}`}>
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