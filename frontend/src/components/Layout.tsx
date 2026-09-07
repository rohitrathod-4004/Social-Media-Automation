import  Sidebar from './Sidebar'
import React, { useState , } from 'react'
import { MenuIcon } from 'lucide-react'
import { Outlet, useLocation } from 'react-router';

const pageTitles : Record<string , string> = {
    '/dashboard': 'Dashboard',
    '/accounts': 'Accounts',
    '/schedule': 'Scheduler',
    '/aicomposer': 'AI Composer'
} 

const Layout = () => {


    const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Social Automation';


  return (
    <div className='flex h-screen bg-slate-50'>

        {/*Mobile Overlay*/}

        {isMobileMenuOpen && <div className='fixed inset-0 bg-slate-900/50 z-40 md:hidden' onClick={()=> setisMobileMenuOpen(false)}/>}

        <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setisMobileMenuOpen}/>

        <div>
            <header className='h-16 bg-white border-b border-slate-200 items-center px-4 md:px-8 gap-4 py-2'>
                <button className='md:hidden p-2 -ml-2 text-slate-500' onClick={()=>setisMobileMenuOpen(true)}>
                    <MenuIcon className="size-6"/> 
                </button>

                <div>
                    <h1 className='text-slate-900'>{title}</h1>
                    <p className='text-sm text-slate-400 hidden sm:block'>Manage and automate your social presence</p>
                </div>
            </header>

            <main className='flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12'>
                <Outlet/>

            </main>



        </div>
    </div>
  )
}

export default Layout