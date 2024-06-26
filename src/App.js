import RoutesApp from "./routes";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <ToastContainer autoClose={3000}/>
      <RoutesApp/>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
