// modal con mensaje y posibilidad de recarga de datos

import { createPortal } from "react-dom"
import './PopUp.css'

function PopUp({children}){
    return createPortal(
        <div className="modal-adder">
            {children}
        </div>,

        document.getElementById('modal')
    )
}

export {PopUp}