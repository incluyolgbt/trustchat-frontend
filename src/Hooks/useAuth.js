import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

function useAuth(socket, connection) {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        //quizá este no va aquí y quizá es un manejador de eventos y no un effect
        //creo que sería con dependencias []
        console.log('Efecto mando auth por socket')
        supabase.auth.getSession().then(data => {
            if (data.data.session) {
                setUserId(data.data.session.user.id); // obtener user_id
                socket.emit('authenticate', {
                    'user_id': data.data.session.user.id
                })
                supabase.from('users').select('*').eq('id', data.data.session.user.id).then((d, error) => {
                    setName(d?.data[0].name)
                })
            }
        })

        return () => { //Esto solo lo ejecuta cuando se desmonta el componente
            console.log('Efecto de socket auth off');
            socket.off('authenticate')
        }

    }, [connection])

    return {
        userId, name
    }
}

export { useAuth }