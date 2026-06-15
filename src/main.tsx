/* React and routing imports that mount the single-page app into the browser DOM. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

/* Global CSS defines the visual layout for every route rendered below. */
import './index.css'

/* Page components become the route-specific DOM inserted inside App's <Outlet />. */
import ErrorBoundary  from './components/ErrorBoundary.tsx'
import App            from './App.tsx'
import Home           from "./pages/Home.tsx"
import About          from "./pages/About.tsx"
import Experience     from "./pages/Experience.tsx"
import Skills         from "./pages/Skills.tsx"
import Education      from "./pages/Education.tsx"
import Projects       from "./pages/Projects.tsx"
import Contact        from "./pages/Contact.tsx"
import NotFoundPage   from './pages/NotFoundPage.tsx';
import RouteErrorPage from './pages/RouteErrorPage.tsx';


/* The app is served from a sub-path (GitHub Pages project site), so the router's basename must match
   Vite's configured base. Strip the trailing slash and fall back to "/" for a root deployment. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

/* Router maps clean URL paths (no #) to the React elements that should be rendered into the page. */
const router = createBrowserRouter(
  [
    {
      path: "/",
      /* App wraps each child route with the shared background, navigation, and footer. */
      element: <App />,
      /* Rendering errors anywhere in the routed tree land on a styled boundary page instead of
         unmounting React and leaving a blank document. */
      errorElement: <RouteErrorPage />,
      children: [
        { path: "/",          element: <Home          /> },
        { path: "/About",     element: <About         /> },
        { path: "/Experience", element: <Experience    /> },
        { path: "/Education",  element: <Education     /> },
        { path: "/Contact",   element: <Contact       /> },
        { path: "/Projects",  element: <Projects      /> },
        { path: "/Skills",    element: <Skills        /> },
        { path: "*",          element: <NotFoundPage  /> }
      ]
    }
  ],
  { basename }
);

/* The root div in index.html is the DOM container React controls from here down. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Last-resort net for errors that originate outside the routed tree, where the per-route
        errorElement cannot reach. Route-level render errors still land on RouteErrorPage. */}
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
