import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Quiz from "./pages/Quiz";
import Statistics from "./pages/Statistics";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <AuthPage />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
