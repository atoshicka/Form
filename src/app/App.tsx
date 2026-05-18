import { LoginForm } from "../widgets/FormLogin/LoginForm";
import { Route, Routes, Navigate } from "react-router-dom";
import { RegisterForm } from "../widgets/FormRegister/RegisterForm";
import { WelcomeBlock } from "../widgets/Home/WelcomeBlock";
import { NotFound } from "../widgets/NotFound/NotFound";
import { Navbar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth";
import { Account } from "../widgets/Account/Account";
import './styles/global.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth } = useAuth();
    
    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <WelcomeBlock />
                    </ProtectedRoute>
                } />
                <Route path="/account" element={<Account/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default App;