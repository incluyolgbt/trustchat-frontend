import React from "react";
import './NotFound.css'
import { useParams } from "react-router-dom";

function NotFound(){
    return(
        <main className="main-notfound">
            <h1 className="main-notfound--title">Página no encontrada</h1>
            <p className="main-notfound--sad">:(</p>
        </main>
    );
}

export {NotFound};