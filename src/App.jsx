import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DataPage from "./pages/Data.jsx";
import MainPage from "./pages/Home.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ShopPage from "./pages/Shop.jsx";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/shop" element={<ShopPage />}/>
                    <Route path="/profile" element={<ProfilePage />}/>
                    <Route path="/data" element={<DataPage />}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App