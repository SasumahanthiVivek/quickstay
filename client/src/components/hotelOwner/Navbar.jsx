import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext'

const Navbar = () => {

    const { isAdmin } = useAppContext();

    return (
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white transition-all duration-300">
            <div className='flex items-center'>
                <Link to="/">
                    <img className="h-9 invert opacity-80" src={assets.logo} alt="logo" />
                </Link>
            </div>

            <div className='flex items-center gap-3'>
                <span className={`hidden md:inline-flex px-3 py-1 rounded-full text-xs font-medium ${isAdmin ? "bg-blue-600/10 text-blue-600" : "bg-primary/10 text-primary"}`}>
                    {isAdmin ? "Admin" : "Owner"}
                </span>
                <UserButton />
            </div>
        </div>
    )
}

export default Navbar