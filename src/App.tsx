/* Shared layout imports that appear around every routed page. */
import { Outlet } from 'react-router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AetherFlowBackdrop from './components/AetherFlowBackdrop';


export default function App() {
  return (
    <>
      {/* Routed pages share a pointer-reactive canvas background without blocking foreground controls. */}
      <AetherFlowBackdrop />

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
