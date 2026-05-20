import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAuthStore } from "../store/useAuthStore";

window.Pusher = Pusher;
const isProduction = import.meta.env.PROD;
window.Pusher.logToConsole = true;
const echo = new Echo({
  broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'local', 
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: isProduction ? 443 : (import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: isProduction ? 443 : (import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: isProduction, 
    
    enabledTransports: ['ws', 'wss'],
  authorizer: (channel) => ({
    authorize: async (socketId, callback) => {
      try {
        const token = useAuthStore.getState().token;
        const response = await axios.post(
          "http://localhost:8000/broadcasting/auth",
          {
            socket_id: socketId,
            channel_name: channel.name,
          },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined,
        );

        callback(false, response.data);
      } catch (error) {
        callback(true, error);
      }
    },
  }),
});

export default echo;