import React from 'react'
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    const sidebarLinks = [
        { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
        { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
        { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
    ];

    return (
        <div className="w-full md:w-68 border-b md:border-b-0 md:border-r h-auto md:h-full text-base border-gray-200 bg-white pt-2 md:pt-4 flex flex-col justify-between transition-all duration-300">
            <div className='w-full overflow-x-auto'>
                <p className='hidden md:block px-6 text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3'>Owner Panel</p>
                <div className='flex md:block px-2 md:px-0 pb-2 md:pb-0 min-w-max md:min-w-0'>
                {sidebarLinks.map((item, index) => (
                    <NavLink to={item.path} key={index} end='/owner' className={({ isActive }) => `cursor-pointer mx-2 rounded-lg flex items-center py-3 px-3 md:px-5 gap-3 transition-all ${isActive ? "bg-blue-600/10 text-blue-600" : "hover:bg-gray-100/90 text-gray-700"}`}>
                        <img className="h-5 w-5" src={item.icon} alt={item.name} />
                        <p className="text-sm font-medium whitespace-nowrap">{item.name}</p>
                    </NavLink>
                ))}
                </div>
            </div>

            <div className='hidden md:block m-3 p-3 rounded-lg bg-primary/5 border border-primary/10'>
                <p className='text-xs text-gray-500'>QuickStay</p>
                <p className='text-sm font-semibold text-gray-700 mt-1'>Hotel Management</p>
            </div>
        </div>
    );
}

export default Sidebar