import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginSignupPage from './components/LoginSignupPage';
import Dashboard from './components/Dashboard';
import ConversationProvider from './components/ConversationProvider';
import useLocalStorage from './components/useLocalStorage';
import SocketProvider from './components/SocketProvider';
import { useEffect, useState } from 'react';
import { URL } from './components/config';


function App() {
  const [id, setId] = useLocalStorage();
  const [myProfile, setMyProfile] = useState(null);

  useEffect(() => {
    if (!id) return () => {}
    fetch(URL+'get-details/'+id).then(res => {
      res.json().then(({name, dp}) => {
        setMyProfile({id, name, dp});
      })
    })
  }, [id])
  
  
  return (
    <>
      {myProfile ?
        <SocketProvider id={id} setId={setId}>
          <ConversationProvider setId={setId} myProfile={myProfile} setMyProfile={setMyProfile}>
            <Dashboard />
          </ConversationProvider>
        </SocketProvider>
        :
        <LoginSignupPage setId={setId} />
      }
    </>
  );
}

export default App;
