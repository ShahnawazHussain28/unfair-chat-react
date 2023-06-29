import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ConversationProvider from './components/ConversationProvider';

function App() {
  return (
    <ConversationProvider>
      {/* <LoginPage /> */}
      {/* <SignupPage /> */}
      <Dashboard />
    </ConversationProvider>
  );
}

export default App;
