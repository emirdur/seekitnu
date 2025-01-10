import { Routes, Route } from "react-router-dom";
import { Home } from "./src/pages/Home";
import { Auth } from "./src/pages/Auth";
import { Upload } from "./src/pages/Upload";

const App = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Auth />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
      </Routes>
    </main>
  );
};

export default App;
