import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import "./App.css";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
function App() {
  return (
    <Router>
      <MainNavigation></MainNavigation>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/redirect" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
