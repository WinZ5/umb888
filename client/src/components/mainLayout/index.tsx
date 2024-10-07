import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Button } from '../ui/button';

interface LayoutProps {
  title: string;
  children: ReactNode;
  buttonRedirect?: string;
}

const MainLayout = ({ title, children, buttonRedirect }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header title={title} />

        <div className="flex-1 flex flex-col px-4 lg:px-8 py-4">
          {buttonRedirect && (
            <div className="flex justify-end p-4 space-x-2">
              <Button
                onClick={() => navigate(buttonRedirect)}
                className="h-10 px-5 border border-gray-300 bg-blue-500 text-white shadow-sm hover:bg-gray-100 hover:border-gray-400"
              >
                Add
              </Button>
            </div>
          )}

          <div className="bg-white p-10 flex justify-center items-start shadow-md w-full h-full">
            {children}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;