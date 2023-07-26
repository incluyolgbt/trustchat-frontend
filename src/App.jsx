import './App.css'
import { useState, useEffect } from 'react';

export default function App() {

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([]);

  const [number, setNumber] = useState('');

  async function handlerSubmit(e) {
    e.preventDefault();
    setMessages([...messages, message]);

    try {
      await fetch('https://chat.danielmartine91.repl.co/api/v1/client', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify({"to": number,
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "116926351467394",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550758313",
              "phone_number_id": "114329885063727"
            },
            "contacts": [
              {
                "profile": {
                  "name": "DanielMC"
                },
                "wa_id": "5213511507240"
              }
            ],
            "messages": [
              {
                "from": "5213511507240",
                "id": "wamid.HBgNNTIxMzUxMTUwNzI0MBUCABIYFDNBRkZGM0QzNkVCNTI4Mzc0MDJBAA==",
                "timestamp": "1690302479",
                "text": {
                  "body": message
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}),
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
    } catch (error) {
      console.error(error);
    }
      
  };

  useEffect(() => {
    //pendiente al webhook de supabase
  });

  return (
    <>
      <ul>
        {
          messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))
        }
      </ul>

      <form>
        <input type='text' onChange={(e) => setNumber(e.target.value)} placeholder='Número' />
        <input type='text' onChange={(e) => setMessage(e.target.value)} placeholder='Mensaje' />
        <button onClick={handlerSubmit}>
          Send
        </button>
      </form>


    </>


  )
}

