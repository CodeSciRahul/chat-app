import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { LoginForm } from "./pages/authentication/login";
import { SignupForm } from "./pages/authentication/Signup";
import { VerifyUserByEmailLink } from "./pages/authentication/VerifyEmail";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useAppSelecter } from "./Redux/Hooks/store";


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
            {/* <Route path="" element={<Dashboard />}> */}
          </Route>
        </Routes>

        <Toaster />
      </Router>
    </>
  );
}

export default App;
