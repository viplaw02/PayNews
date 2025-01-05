import AdminPanel from "./Admin/Admin"
import NewsAndBlogs from "./NewsComponent/NewsBlog"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from "./Signup/Signup";
import Login from "./Login/Login";

function App() {


  return (
    <>
<BrowserRouter>
      <Routes>
        
        <Route path='/' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
        <Route path='/user' element={<NewsAndBlogs/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
