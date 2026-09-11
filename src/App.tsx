import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import CaseStudies from "./pages/CaseStudies";
import FAQ from "./pages/FAQ";

function App() {
  const path =
    window.location.pathname.replace(/\/+$/, "") || "/";

  const isArticlePage = path.startsWith("/article/");
  const isContactPage =
    path === "/contact" || path === "/contact-us";
  const isEventsPage =
    path === "/events" || path === "/event";
  const isCaseStudiesPage =
    path === "/case-studies" || path.startsWith("/case-studies/");
  const isFaqPage =
    path === "/faq" || path === "/faqs";

  return (
    <>
      <TopBar />
      <Navbar />

      {isArticlePage ? (
        <Article />
      ) : isCaseStudiesPage ? (
        <CaseStudies />
      ) : isFaqPage ? (
        <FAQ />
      ) : isContactPage ? (
        <Contact />
      ) : isEventsPage ? (
        <Events />
      ) : (
        <Home />
      )}

      <Footer />
    </>
  );
}

export default App;
