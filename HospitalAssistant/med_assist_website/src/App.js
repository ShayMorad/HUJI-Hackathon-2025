import React, {useState, useEffect} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Header from './components/Header';
import PatientsStatusPage from './components/PatientsStatusPage';
import {authService} from './services/authService';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUser());
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

    const handleLogin = () => {
        const user = authService.getCurrentUser();
        if (user) {
            setIsLoggedIn(true);
            setCurrentUser(user);
        } else {
            setIsLoggedIn(false);
            setCurrentUser(null);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        setIsLoggedIn(false);
        setCurrentUser(null);
        document.title = "MedAssist AI - Log in";
    };

    useEffect(() => {
        document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/global/hospital_background.jpg)`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';

        if (!isLoggedIn) {
            document.body.style.display = 'flex';
            document.body.style.justifyContent = 'center';
            document.body.style.alignItems = 'center';
        } else {
            document.body.style.display = '';
            document.body.style.justifyContent = '';
            document.body.style.alignItems = '';
        }

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.height = '';
            document.body.style.margin = '';
            document.body.style.display = '';
            document.body.style.justifyContent = '';
            document.body.style.alignItems = '';
        };
    }, [isLoggedIn]);

    return (
        <Router>
            <div className={`App ${isLoggedIn ? 'App-with-header' : ''}`}>
                {isLoggedIn && <Header currentUser={currentUser} onLogout={handleLogout}/>}
                <Routes>
                    <Route
                        path="/login"
                        element={isLoggedIn ? <Navigate to="/"/> : <LoginPage onLogin={handleLogin}/>}
                    />
                    <Route
                        path="/"
                        element={isLoggedIn ? <HomePage currentUser={currentUser}/> : <Navigate to="/login"/>}
                    />
                    <Route
                        path="/patients-status"
                        element={isLoggedIn ? <PatientsStatusPage currentUser={currentUser}/> : <Navigate to="/login"/>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
