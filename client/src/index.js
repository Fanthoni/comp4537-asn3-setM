import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import SearchPage from "./pages/SearchPage"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from './pages/AdminDashboardPage';
import RegisterPage from "./pages/RegisterPage";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


function App () {
  const [isLoggedIn, setLoggedIn] = useState(undefined)

  useEffect(() => {
    const userType = getCookie("userType")
    setLoggedIn(userType)
  }, [])

  return (
    <>
      {
        isLoggedIn === "User" ? <SearchPage /> : null
      }
      {
        isLoggedIn === "Admin" ? <AdminDashboard /> : null
      }
      {
        isLoggedIn === "register" ? <RegisterPage setLogin={setLoggedIn} /> : null
      }
      {
        isLoggedIn === undefined ? <LoginPage setLogin={setLoggedIn}/> : null
      }


    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);
