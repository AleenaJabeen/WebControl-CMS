import {BrowserRouter ,Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layout/Layout';
import Dashboard from './components/Dashboard';
import AddData from './pages/AddData';
import Update from './pages/Update';
import Delete from './pages/Delete';
import { DataProvider} from './context/Context';
import PrivateRoute from './auth/PrivateRoute';

function App() {

  return (
    <>
     <DataProvider>
    <BrowserRouter>
    <Routes>
     
      <Route index element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dashboard' element={<Layout/>}>
       <Route path='/dashboard/'  element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }>
       </Route>
       <Route path='/dashboard/createData'  element={
            <PrivateRoute>
              <AddData />
            </PrivateRoute>
          }/>
        <Route path='/dashboard/updateData'  element={
            <PrivateRoute>
              <Update/>
            </PrivateRoute>
          }/>
        <Route path='/dashboard/deleteData'  element={
            <PrivateRoute>
              <Delete />
            </PrivateRoute>
          }/>
      </Route>
      
    </Routes>
    </BrowserRouter>
    </DataProvider>

    </>
  )
}

export default App
