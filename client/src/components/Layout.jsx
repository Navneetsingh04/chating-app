import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({children,showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex bg-base-100">{showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col bg-base-100">
          <Navbar/>
          <main className="flex-1 overflow-y-auto bg-base-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
