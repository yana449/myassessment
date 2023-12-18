import './App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="AppContainer">
      <Navbar />
      <Main />
      <Toaster />
    </div>
  );
}

export default App;
