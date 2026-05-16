import { LoginForm } from "../widgets/FormLogin/LoginForm";
import { Route, Routes, Navigate } from "react-router-dom";
import { RegisterForm } from "../widgets/FormRegister/RegisterForm";
import { WelcomeBlock } from "../widgets/Home/WelcomeBlock";
import './styles/global.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/home" element={
                <ProtectedRoute> 
                  <WelcomeBlock /> 
              </ProtectedRoute>
            } />
        </Routes>
    )
}

export default App;