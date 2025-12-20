//reterive baseUrl from .env file

const properties = {
    PUBLIC_BASE_URL: import.meta.env.VITE_PUBLIC_BASE_URL || "https://chat-app-backend-85a8.onrender.com/api",
     PRIVATE_BASE_URL: import.meta.env.VITE_PRIVATE_BASE_URL || "http://localhost:5000/api",
     PRIVATE_SOCKET_BASE_URL: import.meta.env.VITE_PRIVATE_SOCKET_BASE_URL || "http://localhost:5000",
     PUBLIC_SOCKET_BASE_URL: import.meta.env.VITE_PUBLIC_SOCKET_BASE_URL || "https://chat-app-backend-85a8.onrender.com",
  };
  
  export default properties;
  
