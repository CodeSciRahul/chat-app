//reterive baseUrl from .env file

const properties = {
    PUBLIC_BASE_URL: import.meta.env.VITE_PUBLIC_BASE_URL || "https://full-stack-task-management-app-backend-lww7.onrender.com/api",
     PRIVATE_BASE_URL: import.meta.env.VITE_PRIVATE_BASE_URL || "http://localhost:5000"
  };
  
  export default properties;
  