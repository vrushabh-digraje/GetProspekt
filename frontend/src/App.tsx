import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import CaseStudies from "./pages/CaseStudies";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function PublicLayout() {
  return (
    <>
      <TopBar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/*" element={<CaseStudies />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/*" element={<Resources />} />
        <Route path="/resources/view/:id" element={<ResourceDetail />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/faqs" element={<FAQ />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/resources"
          element={
            <ProtectedRoute>
              <Dashboard initialSection="Resources" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/latest-popular"
          element={
            <ProtectedRoute>
              <Dashboard initialSection="Latest & Popular" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/case-studies"
          element={
            <ProtectedRoute>
              <Dashboard initialSection="Case Studies" />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
