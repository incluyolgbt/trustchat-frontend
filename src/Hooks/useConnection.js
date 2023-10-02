import { io } from 'socket.io-client';

function useConnection() {
  const handleSocketAuth = (userId, userName) => {
    if (userId) {
      let socket = io(import.meta.env.VITE_BACKEND_URL);

      socket.emit('authenticate', {
        user_id: userId,
        user_name: userName,
      });

      return socket;
    }
  };

  const handleSocketUnauth = (socket) => {
    socket?.off();
    socket?.disconnect();
  };

  return {
    handleSocketAuth,
    handleSocketUnauth,
  };
}

export { useConnection };
