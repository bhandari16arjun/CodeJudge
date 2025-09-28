import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}