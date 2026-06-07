import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./Features/Dashboard/Pages/Home"));
const About = lazy(() => import("./Features/Dashboard/Pages/About"));
const ProductDetails = lazy(() => import("./Features/Dashboard/Pages/ProductDetails"));
const AddProduct = lazy(() => import("./Features/Dashboard/Pages/AddProduct"));
const EditProduct = lazy(() => import("./Features/Dashboard/Pages/EditProduct"));
const Cart = lazy(() => import("./Features/Dashboard/Pages/Cart"));
const Checkout = lazy(() => import("./Features/Dashboard/Pages/Checkout"));
const Contact = lazy(() => import("./Features/Dashboard/Pages/Contact"));
const Collection = lazy(() => import("./Features/Dashboard/Pages/Collection"));
const Favorites = lazy(() => import("./Features/Dashboard/Pages/Favorites"));
const Login = lazy(() => import("./Features/Auth/Pages/Login"));
const AdminDashboard = lazy(() => import("./Features/Dashboard/Pages/AdminDashboard"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Navigate to="/" replace />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "products",
        element: <Collection />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "collections",
        element: <Collection />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/add-product",
        element: (
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/edit-product/:id",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth/login",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
