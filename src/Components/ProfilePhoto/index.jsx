import { useEffect, useState } from "react";
import './ProfilePhoto.css'

function ProfilePhoto({name, type}){
    const [url, setUrl] = useState('');

    useEffect(()=>{
        let svgPhoto = async() => {
            const {url} = await fetch(
                `https://ui-avatars.com/api/?format=png&name=${name}&background=random&font-size=0.5&rounded=true`);
            setUrl(url);
        }
        svgPhoto();
    }, [name])

    return (
        <img className={type}
        src={url}></img>
    );
}

export {ProfilePhoto};