import { Link, Outlet, useLocation } from 'react-router';
import api from '~/libs/api/api';
import { useAuthGuard, useUser } from '~/libs/auth/useAuthGuard';

export default function Layout() {
  const location = useLocation();
  const user = useUser();

  // Use the auth guard hook
  const isUserAuthenticated = useAuthGuard();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    const reponse = await api.post(`/auth/logout`);
    if (reponse.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  // Don't render layout if not authenticated (will redirect)
  if (!isUserAuthenticated) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <div className='loading loading-spinner loading-lg text-primary'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen font-sans'>
      {/* Navigation */}
      <div className='navbar bg-base-200 shadow-sm'>
        <div className='navbar-start'>
          {/* <div className='dropdown'>
            <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            </div>
            <ul className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'>
              <li>
                <Link to='/' className={isActive('/') && !isActive('/classes') ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/classes' className={isActive('/classes') ? 'active' : ''}>
                  Classes
                </Link>
              </li>
            </ul>
          </div> */}
          <Link to='/' className='btn btn-ghost text-xl font-bold'>
            DQR
          </Link>
        </div>

        {/* <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <Link to='/' className={`${isActive('/') && !isActive('/classes') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to='/classes' className={`${isActive('/classes') ? 'active' : ''}`}>
                Classes
              </Link>
            </li>
          </ul>
        </div> */}

        <div className='navbar-end'>
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
              <div className='avatar avatar-online avatar-placeholder'>
                <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                  <span className='text-xl'>A</span>
                </div>
              </div>
            </div>
            <ul className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'>
              <li>
                <a>Profile</a>
              </li>
              <li>
                <button className='' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  );
}
