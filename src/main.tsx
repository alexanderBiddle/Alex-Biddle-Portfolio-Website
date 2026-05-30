/* React and routing imports that mount the single-page app into the browser DOM. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

/* Global CSS defines the visual layout for every route rendered below. */
import './index.css'

/* Page components become the route-specific DOM inserted inside App's <Outlet />. */
import App           from './App.tsx'
import Home          from "./pages/Home.tsx"
import About         from "./pages/About.tsx"
import Skills        from "./pages/Skills.tsx"
import Projects      from "./pages/Projects.tsx"
import Contact       from "./pages/Contact.tsx"
import NotFoundPage  from './pages/NotFoundPage.tsx';


/* Router maps URL paths to the React elements that should be rendered into the page. */
const router = createBrowserRouter([
  { path: "/",
    element: <App />, // wrap routes with layout
    children: [
      { path: "/",          element: <Home          /> },
      { path: "/About",     element: <About         /> },
      { path: "/Contact",   element: <Contact       /> },
      { path: "/Projects",  element: <Projects      /> },
      { path: "/Skills",    element: <Skills        /> },
      { path: "*",          element: <NotFoundPage  /> }
    ]
  }
]);


/* The root div in index.html is the DOM container React controls from here down. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
