// import logo from './logo.svg';
import './App.css';

import Home from './screens/Home'
import Login from './screens/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          {/* <Header title="Mini"/>
           */}
            <Routes>
              <Route name="Login" path="/" element={<Login />}></Route>
              <Route name="Home" path="/home" element={<Home/>}></Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
