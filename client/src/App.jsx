import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
//pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import Recipe from './pages/Recipe'
import MyRecipe from './pages/MyRecipe'
import SavedRecipe from './pages/SavedRecipe'

//components
import NotFound from './components/NotFound'
import { useAuthContext } from './hooks/useAuthContext'
import GuestNavbar from './components/Navbar/GuestNavbar'
import AuthenticatedNavbar from './components/Navbar/AuthenticatedNavbar'


function App() {

  const { user } = useAuthContext()

  return (
    <BrowserRouter>
      {user ? <AuthenticatedNavbar /> : <GuestNavbar /> }
      <Routes>
        <Route path='/' element={user? <Home /> : <Navigate to='/login' /> } />
        <Route path='/my-recipes' element={user? <MyRecipe /> : <Navigate to='/login' /> } />
        <Route path='/recipe/:id' element={user? <Recipe /> : <Navigate to='/login' /> } />
        <Route path='/saved-recipes' element={user? <SavedRecipe /> : <Navigate to='/login' /> } />

        <Route path="/login" element={!user? <Login /> : <Navigate to='/' />} />
        <Route path="/register" element={!user? <Register /> : <Navigate to='/' />} />

        <Route path='*' element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>

  )
}

export default App
