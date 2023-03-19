import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Components/Home';
import Nav from './Components/Nav';

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
