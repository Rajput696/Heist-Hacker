import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={'Hello How are you'}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
