import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import InterviewerDetails from './Interviewer/InterviewerDetails';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={'Hello How are you'}></Route>
        <Route path='/interviewer/signup' element={<Signup/>}></Route>
        <Route path='/interviewer/details' element={<InterviewerDetails></InterviewerDetails>} ></Route>
      </Routes>
    </Router>
  );
}

export default App;
