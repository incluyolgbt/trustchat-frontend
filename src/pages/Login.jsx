import React from "react";
import { useEffect, useState } from "react";
import { supabase } from '../supabase/client';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    useEffect(()=>{
        if(supabase.auth.getSession()){
            navigate('/');
        } 
    }, [navigate]);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
        } catch (error) {
            console.error(error);
        }
    }

    

    return (
        <form onSubmit={handlerSubmit}>
            <input
                type="email" name="email"
                placeholder="email"
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={e => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    );
}

export { Login }