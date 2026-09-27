import { AppProvider, useApp } from "@/store/AppStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ToastHost } from "@/components/ui";
import { useRoute, useScrollToTop } from "@/lib/router";
import Home from "@/pages/Home";
import FindMarket from "@/pages/FindMarket";
import Directory from "@/pages/Directory";
import MarketDetail from "@/pages/MarketDetail";
import ProduceGuide from "@/pages/ProduceGuide";
import ProduceDetail from "@/pages/ProduceDetail";
import Seasonal from "@/pages/Seasonal";
import MyFinds from "@/pages/MyFinds";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function Router() {
  const route = useRoute();
  useScrollToTop(route.path);
  const seg = route.segments[0] ?? "";
  const id = route.segments[1];

  switch (seg) {
    case "":
      return <Home />;
    case "find":
      return <FindMarket />;
    case "directory":
      return <Directory />;
    case "market":
      return <MarketDetail id={id} />;
    case "produce":
      return id ? <ProduceDetail id={id} /> : <ProduceGuide />;
    case "seasonal":
      return <Seasonal />;
    case "saved":
      return <MyFinds />;
    case "about":
      return <About />;
    case "contact":
      return <Contact />;
    default:
      return <NotFound />;
  }
}

function Shell() {
  const { toasts } = useApp();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Router />
      </main>
      <Footer />
      <Chatbot />
      <ToastHost toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
