import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import User from "./pages/User";
import Introduce from "./pages/Introduce";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { TokenManager } from "./services/api";

function RouteGuard() {
  const isLoggedIn = TokenManager.isAuthenticated();
  return isLoggedIn ? <Main /> : <Introduce />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<RouteGuard />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AnimatedRoutes />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
