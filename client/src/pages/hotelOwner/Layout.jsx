import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext'

const Layout = () => {

    const { isSignedIn, loadingUser, isAdmin, navigate, toast } = useAppContext()

    useEffect(() => {
        if (!loadingUser && !isSignedIn) {
            navigate('/')
            return;
        }

        if (!loadingUser && isSignedIn && !isAdmin) {
            toast.error('Access denied. Admin dashboard is only for authorized admin email.');
            navigate('/my-bookings');
        }
    }, [isSignedIn, loadingUser, isAdmin, navigate, toast])

    return (
        <div className='flex flex-col min-h-screen bg-gray-50/70'>
            <Navbar />
            <div className='flex flex-1 flex-col md:flex-row overflow-hidden'>
                <Sidebar />
                <div className='flex-1 p-3 sm:p-4 pt-6 md:pt-8 md:px-8 lg:px-10 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout