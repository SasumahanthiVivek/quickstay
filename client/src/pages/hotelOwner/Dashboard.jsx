import React, { useCallback, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/Title';
import { useAppContext } from '../../context/useAppContext';

const Dashboard = () => {

    const { currency, user, getToken, toast, axios, isAdmin } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/bookings/hotel', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                if (data.message === 'No Hotel found') {
                    setDashboardData({ bookings: [], totalBookings: 0, totalRevenue: 0 });
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken, toast])

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [fetchDashboardData, user]);

    const pendingBookings = dashboardData.bookings.filter((item) => !item.isPaid).length;
    const paidBookings = dashboardData.bookings.length - pendingBookings;
    const conversionRate = dashboardData.bookings.length
        ? Math.round((paidBookings / dashboardData.bookings.length) * 100)
        : 0;

    const ownerName = (() => {
        const name = (user?.username || '').trim();
        if (name && name.toLowerCase() !== 'user') return name;
        const email = (user?.email || '').trim();
        if (email.includes('@')) return email.split('@')[0];
        return 'Hotel Manager';
    })();

    const welcomeTitle = isAdmin ? 'Welcome, Admin' : `Welcome back, ${ownerName}`;
    const overviewLabel = isAdmin ? 'Admin Dashboard' : 'Owner Dashboard';

    const getDisplayUserName = (bookingUser) => {
        if (!bookingUser) return "Guest";
        if (bookingUser.username && bookingUser.username.trim()) return bookingUser.username;
        if (bookingUser.email && bookingUser.email.includes('@')) return bookingUser.email.split('@')[0];
        return "Guest";
    }

    return (
        <div className='space-y-8'>
            <div className='rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFF] via-white to-[#F2F7FF] p-6 md:p-8 shadow-sm'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>{overviewLabel}</p>
                        <h2 className='mt-2 text-3xl md:text-4xl font-semibold text-slate-900'>{welcomeTitle}</h2>
                        <p className='mt-2 text-slate-600'>Command bookings, revenue, and operations with clarity and speed.</p>
                    </div>
                    <div className='flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                        Live updates enabled
                    </div>
                </div>
                <div className='mt-6 grid gap-4 md:grid-cols-3'>
                    <div className='rounded-xl border border-slate-200 bg-white/70 p-4'>
                        <p className='text-xs font-semibold text-slate-500'>Total Bookings</p>
                        <div className='mt-3 flex items-center justify-between'>
                            <p className='text-3xl font-semibold text-slate-900'>{dashboardData.totalBookings}</p>
                            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F1FF]'>
                                <svg className='h-5 w-5 text-[#1D4ED8]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M4 4h16v16H4z' />
                                    <path d='M8 4v16M16 4v16' />
                                </svg>
                            </div>
                        </div>
                        <p className='mt-2 text-xs text-slate-500'>All reservations captured.</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 bg-white/70 p-4'>
                        <p className='text-xs font-semibold text-slate-500'>Total Revenue</p>
                        <div className='mt-3 flex items-center justify-between'>
                            <p className='text-3xl font-semibold text-slate-900'>{currency} {dashboardData.totalRevenue}</p>
                            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1E7]'>
                                <svg className='h-5 w-5 text-[#C2410C]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M12 3v18' />
                                    <path d='M8 7h6a3 3 0 010 6H9a3 3 0 000 6h7' />
                                </svg>
                            </div>
                        </div>
                        <p className='mt-2 text-xs text-slate-500'>Gross earnings to date.</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 bg-white/70 p-4'>
                        <p className='text-xs font-semibold text-slate-500'>Payment Conversion</p>
                        <div className='mt-3 flex items-center justify-between'>
                            <p className='text-3xl font-semibold text-slate-900'>{conversionRate}%</p>
                            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#EAFBF2]'>
                                <svg className='h-5 w-5 text-[#15803D]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M4 12l4 4 12-12' />
                                </svg>
                            </div>
                        </div>
                        <p className='mt-2 text-xs text-slate-500'>{pendingBookings} pending payments.</p>
                    </div>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
                <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-xl font-semibold text-slate-900'>Recent Bookings</h3>
                            <p className='text-sm text-slate-500'>Latest activity across your properties.</p>
                        </div>
                        <div className='hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 md:flex'>
                            <span className='h-2 w-2 rounded-full bg-amber-400'></span>
                            Pending: {pendingBookings}
                        </div>
                    </div>

                    {dashboardData.bookings.length === 0 ? (
                        <div className='mt-6 rounded-xl border border-dashed border-slate-300 py-12 text-center'>
                            <p className='text-slate-700 font-medium'>No bookings yet</p>
                            <p className='text-sm text-slate-500 mt-1'>Bookings appear here once guests reserve rooms.</p>
                        </div>
                    ) : (
                        <div className='mt-6 overflow-x-auto rounded-xl border border-slate-200'>
                            <table className='w-full min-w-[680px] text-left text-sm'>
                                <thead className='bg-slate-50 text-slate-600'>
                                    <tr>
                                        <th className='px-4 py-3 font-medium'>Guest</th>
                                        <th className='px-4 py-3 font-medium max-sm:hidden'>Room</th>
                                        <th className='px-4 py-3 font-medium text-center'>Amount</th>
                                        <th className='px-4 py-3 font-medium text-center'>Status</th>
                                        <th className='px-4 py-3 font-medium max-md:hidden'>Check-in</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.bookings.map((item, index) => (
                                        <tr key={index} className='border-t border-slate-200 hover:bg-slate-50/60'>
                                            <td className='px-4 py-3'>
                                                <div className='flex flex-col'>
                                                    <p className='font-medium text-slate-800'>{getDisplayUserName(item.user)}</p>
                                                    <p className='text-xs text-slate-500'>{item?.user?.email || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-slate-500 max-sm:hidden'>{item?.room?.roomType || 'Room'}</td>
                                            <td className='px-4 py-3 text-center font-medium text-slate-700'>{currency} {item.totalPrice}</td>
                                            <td className='px-4 py-3 text-center'>
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${item.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${item.isPaid ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                                                    {item.isPaid ? "Paid" : "Pending"}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3 text-slate-500 max-md:hidden'>
                                                {new Date(item.checkInDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className='space-y-6'>
                    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                        <h3 className='text-lg font-semibold text-slate-900'>Operational Snapshot</h3>
                        <div className='mt-4 space-y-4'>
                            <div className='flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2'>
                                <span className='text-sm text-slate-600'>Paid bookings</span>
                                <span className='font-semibold text-slate-800'>{paidBookings}</span>
                            </div>
                            <div className='flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2'>
                                <span className='text-sm text-slate-600'>Pending payments</span>
                                <span className='font-semibold text-slate-800'>{pendingBookings}</span>
                            </div>
                            <div className='flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2'>
                                <span className='text-sm text-slate-600'>Active listings</span>
                                <span className='font-semibold text-slate-800'>{dashboardData.bookings.length > 0 ? 3 : 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0F172A] p-5 text-white shadow-sm'>
                        <p className='text-xs uppercase tracking-[0.2em] text-slate-300'>Quick Actions</p>
                        <h3 className='mt-3 text-lg font-semibold'>Keep momentum high</h3>
                        <p className='mt-2 text-sm text-slate-300'>Add rooms, review requests, and keep availability up to date.</p>
                        <div className='mt-4 grid gap-3'>
                            <button className='rounded-lg bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/20'>Add a new room</button>
                            <button className='rounded-lg bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/20'>Review pending payments</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
