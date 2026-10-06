import { LoginForm } from "../widgets/FormLogin/LoginForm";
import { Route, Routes, Navigate } from "react-router-dom";
import { RegisterForm } from "../widgets/FormRegister/RegisterForm";
import { WelcomeBlock } from "../widgets/Home/WelcomeBlock";
import { NotFound } from "../widgets/NotFound/NotFound";
import { Navbar } from "../components/NavBar/NavBar";
import { useAuth } from "../hooks/useAuth";
import { Account } from "../widgets/Account/Account";
import { SubscriptionSection } from "../widgets/SubscriptionSection/ui/SubscriptionSection";
import './styles/global.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth } = useAuth();
    
    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth } = useAuth();

    if (isAuth) {
        return <Navigate to="/home" replace/>
    }

    return <>{children}</>
}

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={
                    <GuestRoute>
                        <LoginForm />
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <RegisterForm />
                    </GuestRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <WelcomeBlock />
                    </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                    <ProtectedRoute>
                        <SubscriptionSection/>
                    </ProtectedRoute>
                }/>
                <Route path="/account" element={
                    <ProtectedRoute>
                        <Account/>
                    </ProtectedRoute>

                    }/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    )
}

export default App;