import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Nav from '@/components/Nav';
import SignIn from '@/components/SignIn';

function App() {

  const navigate = useNavigate();

  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    const proleakToken = getCookie('proleak_token');
    const token = getCookie('token');

    if (proleakToken) {
      axios.post('http://localhost:3000/verify', { token: token })
        .then(response => {
          if (response.data.valid === true)
          return navigate("/home");
        })
        .catch(error => {
          return console.error(error);
        });
    }
    if (token || proleakToken) {
      return navigate("/home");
    }
  }, []);

  return (
    <>
      <Nav />
      <SignIn />
    </>
  )
}

export default App
