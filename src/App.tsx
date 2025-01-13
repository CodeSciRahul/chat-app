import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { LoginForm } from "./pages/authentication/login";
import { SignupForm } from "./pages/authentication/Signup";
import { VerifyUserByEmailLink } from "./pages/authentication/VerifyEmail";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useAppSelecter } from "./Redux/Hooks/store";
import Chat from "./pages/dashboard/Chat";
import {Users} from "./pages/dashboard/Users"

function App() {
  const token: string | null = useAppSelecter((state: { auth: { token: string | null } }) => state?.auth?.token)
  const isAuthenticated = token ? true : false;
  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/verify" element={<VerifyUserByEmailLink />}/>
          <Route
            path="*"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route path="" element={<Dashboard />} >
            <Route path="chat" element={<Chat />}></Route>
            </Route>

            <Route path="users" element={<Users />}></Route>
          </Route>
        </Routes>

        <Toaster />
      </Router>
    </>
  );
}

export default App;
