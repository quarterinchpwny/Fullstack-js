import { Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
