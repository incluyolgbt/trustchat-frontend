import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    return (
        <>
            <p>Home</p>
            <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </>
    );
}

export { Home };