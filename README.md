## Chat UI client

This web application was created in collaboration with the social entrepreneurship [Incluyo](https://incluyo.lgbt "Incluyo") to achieve a system of attention to LGBTQ+ people in a direct way in which their privacy is prioritized.

This web application was created with React and VITE. It uses HTTP requests for user authentication through Supabase Auth System. It also communicates with the Supabase database to show the messages sent and received from the different chats. 

For real-time communication, it uses websockets (socket.io) that communicate with the web server ([shown in this repository](https://github.com/danieldamaco/trustchat-backend "shown in this repository")), so that it processes the messages received and sent. 


## Instalation.
### Requierements.
- Node: v18.17.0 

### Installation of dependencies.
With npm:

```bash
npm install
```
### Setting environment variables.
To have access, it is required to create or ask for document `.env` with four variables:

- VITE_SUPABASE_URL: The URL of the supabase database.
- VITE_TOKEN: Token provided by supabase.

## Execution 
Once all the dependencies are installed, the web server will execute locally with the following:
```bash
npm run dev
```
You will know that everything is running correctly when the console displays the following:   


VITE [version]
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://{YOUR-LOCAL-IP}:5173/
  ➜  press h to show help

