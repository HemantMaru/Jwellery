import { Outlet } from "react-router-dom";
import Navbar from "./Features/Dashboard/components/Navbar";
import Footer from "./Features/Dashboard/components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { Suspense } from "react";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted font-light uppercase tracking-widest text-sm">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
