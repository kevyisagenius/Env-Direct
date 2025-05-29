import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { FaLeaf, FaBars, FaTimes, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';

// Custom NavLink for Desktop - applies specific styling based on isScrolled and isActive
const NavLink = ({ to, children, onClick, isScrolled, className: extraClassName }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive 
            ? isScrolled 
              ? 'text-mygreen dark:text-mygreen font-semibold'
              : 'text-green-300 font-semibold filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]'
            : isScrolled 
              ? 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mygreen-dark/30 dark:hover:text-white'
              : 'text-white hover:bg-mygreen-dark/30 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]'
        } ${extraClassName || ''}`
      }
    >
      {children}
    </RouterNavLink>
  );
};

const MobileNavLink = ({ to, children, onClick, isScrolled }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isScrolled 
        ? 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mygreen-dark/30'
        : 'text-white hover:bg-mygreen-dark/30 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]'
    }`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroSectionHeight = window.innerHeight * 0.5;
      setIsScrolled(window.scrollY > heroSectionHeight);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // New navigation structure with dropdowns
  const navigation = [
    { name: 'Home', href: '/', type: 'link' },
    {
      name: 'Explore', type: 'dropdown', items: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Predictions', href: '/predictive-dashboard' },
        { name: 'Reports', href: '/reports' },
        { name: 'Live Map', href: '/live-map' },
      ]
    },
    {
      name: 'Initiatives', type: 'dropdown', items: [
        { name: 'Projects', href: '/projects' },
        { name: 'Services', href: '/services' },
        { name: 'Training', href: '/training' },
      ]
    },
    { name: 'Magazine', href: '/green-atlas-magazine', type: 'link' }, 
    { name: 'Contact', href: '/contact', type: 'link' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };
  
  // Desktop icon button class
  const desktopIconButtonClass = (isScrolled) => 
    `ml-2 p-1 rounded-full transition-colors ${
      isScrolled 
        ? 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-mygreen-dark/30'
        : 'text-mygreen-dark dark:text-white hover:bg-black/10 dark:hover:bg-mygreen-dark/30'
    } focus:outline-none focus:ring-2 focus:ring-mygreen`;

  // Class for desktop dropdown trigger (text links)
  const desktopDropdownTriggerClass = (isScrolled) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
      isScrolled 
        ? 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mygreen-dark/30 dark:hover:text-white'
        : 'text-white hover:bg-mygreen-dark/30 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]'
    }`;

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'shadow-lg bg-slate-50 dark:bg-env-green-darkest backdrop-blur-md py-2'
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse" onClick={closeMenu}>
            <FaLeaf className="h-8 w-8 text-mygreen dark:text-mygreen" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-mygreen dark:text-mygreen">Environment Direct</span>
          </Link>
          
          <div className="hidden lg:flex items-center">
            {navigation.map((item) => (
              item.type === 'link' ? (
                <NavLink 
                  key={item.name} 
                  to={item.href}
                  onClick={closeMenu}
                  isScrolled={isScrolled}
                >
                  {item.name}
                </NavLink>
              ) : (
                <Menu as="div" key={item.name} className="relative inline-block text-left">
                  <div>
                    <Menu.Button className={`${desktopDropdownTriggerClass(isScrolled)}`}>
                      {item.name}
                      <FaChevronDown className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
                      <div className="px-1 py-1 ">
                        {item.items.map((subItem) => (
                          <Menu.Item key={subItem.name}>
                            {({ active }) => (
                              <Link // Using Link for sub-items, NavLink can be used if active state is needed here too
                                to={subItem.href}
                                onClick={closeMenu} // Close main mobile menu if open, also good practice for dropdowns
                                className={`${
                                  active ? 'bg-mygreen-light text-mygreen-dark dark:bg-mygreen-dark dark:text-white' : 'text-gray-900 dark:text-gray-200'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                              >
                                {subItem.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )
            ))}

            {/* User Menu Dropdown */}
            <Menu as="div" className="relative inline-block text-left ml-3">
              <div>
                <Menu.Button className={desktopIconButtonClass(isScrolled)}>
                  <FaUserCircle className="h-6 w-6" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm bg-opacity-90 dark:bg-opacity-80">
                  <div className="px-1 py-1 ">
                    {isAuthLoading ? (
                       <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Loading...</div>
                    ) : currentUser ? (
                      <>
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          <div>Hi, {currentUser.username}!</div>
                          {/* <div className="font-medium truncate">{currentUser.email}</div> */}
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/submit-article"
                              onClick={closeMenu}
                              className={`${
                                active ? 'bg-mygreen-light text-mygreen-dark dark:bg-mygreen-dark dark:text-white' : 'text-gray-900 dark:text-gray-200'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              Submit Article
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-red-500 text-white dark:bg-red-600' : 'text-gray-900 dark:text-gray-200 dark:hover:text-red-400 hover:text-red-600'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              onClick={closeMenu}
                              className={`${
                                active ? 'bg-mygreen-light text-mygreen-dark dark:bg-mygreen-dark dark:text-white' : 'text-gray-900 dark:text-gray-200'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              Login
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/register"
                              onClick={closeMenu}
                              className={`${
                                active ? 'bg-mygreen-light text-mygreen-dark dark:bg-mygreen-dark dark:text-white' : 'text-gray-900 dark:text-gray-200'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                            >
                              Register
                            </Link>
                          )}
                        </Menu.Item>
                      </>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            {/* DarkModeToggle for desktop */}
            <div className={`ml-2 ${isScrolled ? '' : 'text-mygreen-dark dark:text-white'}`}>
              <DarkModeToggle isScrolled={isScrolled} />
            </div>
          </div>

          {/* Mobile Menu Trigger and Toggles */}
          <div className="flex items-center lg:hidden">
            <div className={`${isScrolled ? '' : 'text-mygreen-dark dark:text-white'}`}> {/* DarkModeToggle for mobile - Updated for light mode when not scrolled */}
              <DarkModeToggle isScrolled={isScrolled} />
            </div>
            <button
              onClick={toggleMenu}
              type="button"
              className={`ml-2 inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                isScrolled ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mygreen-dark/30' : 'text-white hover:bg-mygreen-dark/30 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mygreen`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu content */} 
      <motion.div 
        className={`lg:hidden ${isOpen ? 'block' : 'hidden'} ${
          isScrolled ? 'bg-slate-50 dark:bg-env-green-darkest' : 'bg-env-green-darkest/80 backdrop-blur-md'
        } shadow-lg`}
        id="mobile-menu"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => {
            if (item.type === 'link') {
              return <MobileNavLink key={item.name} to={item.href} onClick={closeMenu} isScrolled={isScrolled}>{item.name}</MobileNavLink>;
            }
            // For dropdowns, mobile usually lists all items directly or uses accordions
            // For simplicity now, let's list parent and then its children, or just parent that does nothing on click
            return (
              <Fragment key={item.name}>
                <div className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>{item.name}</div>
                {item.items.map(subItem => (
                  <MobileNavLink key={subItem.name} to={subItem.href} onClick={closeMenu} isScrolled={isScrolled} className="pl-6">
                    {subItem.name}
                  </MobileNavLink>
                ))}
              </Fragment>
            );
          })}
          
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          {isAuthLoading ? (
            <div className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-400">Loading...</div>
          ) : currentUser ? (
            <>
              <div className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Hi, {currentUser.username}!</div>
              <MobileNavLink to="/submit-article" onClick={closeMenu} isScrolled={isScrolled}>
                Submit Article
              </MobileNavLink>
              <button 
                onClick={handleLogout}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${ isScrolled ? 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mygreen-dark/30' : 'text-white hover:bg-mygreen-dark/30 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]' } hover:text-red-500 dark:hover:text-red-400`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={closeMenu} isScrolled={isScrolled}>Login</MobileNavLink>
              <MobileNavLink to="/register" onClick={closeMenu} isScrolled={isScrolled}>Register</MobileNavLink>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar; 