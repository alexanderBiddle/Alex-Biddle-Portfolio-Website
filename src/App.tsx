/* Shared layout imports that appear around every routed page. */
import { Outlet } from 'react-router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ParallaxBackdrop from './components/ParallaxBackdrop';


export default function App() {
  return (
    <>
      {/* Fixed decorative background sits behind all page content and updates via CSS variables. */}
      <ParallaxBackdrop />
      {/* Persistent navigation remains mounted while the route content changes. */}
      <NavBar />
      {/* <Outlet /> is where React Router injects the active page's DOM tree. */}
      <main>
        <Outlet />
      </main>
      {/* Footer closes every route with brand and social-link DOM. */}
      <Footer />
    </>
  );
};
