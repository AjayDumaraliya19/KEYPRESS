import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav, Footer, Signup, PrivateComp, Login, AddProduct, ProductList } from "./componenets/index";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComp />}>
            <Route path="/" element={<ProductList /> } />
            <Route path="/add" element={ <AddProduct /> } />
            <Route path="/update" element={ <h1 className="text-center">Product updating component</h1> } />
            <Route path="/logout" element={<h1 className="text-center">logout component</h1>} />
            <Route path="/profile" element={<h1 className="text-center">Profile component</h1>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
