import React from "react";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import './Login.css'
import { Context } from "../../Context";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { socket } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate('/conversations');

        }
    }, [navigate]);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            socket.emit('authenticate', {
                'user_id': data.user.id
            })

            navigate('/conversations');
        } catch (error) {

        }
    }

    return (
        <div className="background-login">
            <form className="form-login" onSubmit={handlerSubmit}>
                <h1>Login</h1>
                <input
                    className="form-login--email"
                    type="email" name="email"
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="form-login--password"
                    type="password"
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="form-login--button" >Log in</button>
            </form>
        </div>
    );
}

export { Login }