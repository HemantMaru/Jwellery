import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./app.routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ProductProvider>
          <FavoritesProvider>
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </FavoritesProvider>
        </ProductProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
