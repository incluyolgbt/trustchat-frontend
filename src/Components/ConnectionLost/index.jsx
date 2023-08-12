import React from "react";
import './ConnectionLost.css'

function ConnectionLost(){
    const refresh = () => window.location.reload(true);

    return(
        <div className="connectionLost-container">
            <h1
            className="connectionLost-container--title"
            >Se perdió la conexión</h1>
            <button 
            className="connectionLost-container--button"
            onClick={refresh}
            >Refrescar página</button>

        </div>
    );
}

export{ConnectionLost}