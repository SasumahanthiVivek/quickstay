import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'

const MyBookings = () => {

    const CHECK_IN_HOUR = 12;
    const PAYMENT_DEADLINE_HOURS = 3;

    const { axios, getToken, user, isAdmin, navigate } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [payingBookingId, setPayingBookingId] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();


    const fetchUserBookings = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken])

    const handlePayment = async (bookingId) => {
        try {
            setPayingBookingId(bookingId);
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                if (data.url) {
                    window.location.href = data.url
                } else {
                    await fetchUserBookings();
                    toast.success(data.message || 'Payment already completed')
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to start payment. Please try again.')
        } finally {
            setPayingBookingId('');
        }
    }

    const verifyStripeSessionPayment = useCallback(async () => {
        const sessionId = searchParams.get('session_id');
        const paymentStatus = searchParams.get('payment');

        if (!sessionId || paymentStatus !== 'success') return;

        try {
            const { data } = await axios.post(
                '/api/bookings/verify-payment',
                { sessionId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success('Payment successful. Booking updated.');
            } else {
                toast.error(data.message || 'Payment verification failed');
            }

            await fetchUserBookings();
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('session_id');
            nextParams.delete('payment');
            setSearchParams(nextParams, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to verify payment right now.');
        }
    }, [axios, fetchUserBookings, getToken, searchParams, setSearchParams]);

    useEffect(() => {
        if (!user || !isAdmin) return;

        toast.error('Admin account cannot access user bookings dashboard.');
        navigate('/owner');
    }, [isAdmin, navigate, user]);

    useEffect(() => {
        if (isAdmin) return;
        if (user) {
            fetchUserBookings();
        }
    }, [fetchUserBookings, isAdmin, user]);

    useEffect(() => {
        if (isAdmin) return;
        if (user) {
            verifyStripeSessionPayment();
        }
    }, [isAdmin, user, verifyStripeSessionPayment]);

    if (isAdmin) {
        return null;
    }

    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const unpaidCount = bookings.filter((booking) => !booking.isPaid).length;
    const paidCount = bookings.length - unpaidCount;
    const upcomingCount = bookings.filter((booking) => new Date(booking.checkInDate) >= new Date()).length;

    const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const getPaymentDeadline = (checkInDate) => {
        const checkIn = new Date(checkInDate);
        if (Number.isNaN(checkIn.getTime())) return null;
        checkIn.setHours(CHECK_IN_HOUR, 0, 0, 0);
        return new Date(checkIn.getTime() - PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000);
    };

    const hasPaymentWindowExpired = (booking) => {
        if (booking?.isPaid) return false;
        if (booking?.status === 'expired') return true;
        const deadline = getPaymentDeadline(booking?.checkInDate);
        if (!deadline) return false;
        return new Date() >= deadline;
    };

    const rows = useMemo(() => bookings.map((booking, index) => {
        const roomImages = booking?.room?.images;
        const image = Array.isArray(roomImages) && roomImages.length > 0
            ? roomImages[0]
            : [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4][index % 4];

        return {
            ...booking,
            image,
            hotelName: booking?.hotel?.name || 'Hotel',
            address: booking?.hotel?.address || 'Address unavailable',
            roomType: booking?.room?.roomType || 'Room',
        };
    }), [bookings]);

    const userDisplayName = (() => {
        const name = (user?.username || '').trim();
        if (name && name.toLowerCase() !== 'user') return name;
        const email = (user?.email || '').trim();
        if (email.includes('@')) return email.split('@')[0];
        return 'User';
    })();

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 space-y-6'>
            <div className='rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFF] via-white to-[#F2F7FF] p-6 md:p-8 shadow-sm'>
                <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>User Dashboard</p>
                <h2 className='text-3xl md:text-4xl font-semibold text-slate-900 mt-2'>Welcome, {userDisplayName}</h2>
                <p className='text-slate-600 mt-2'>Track your stays, payments, and upcoming trips in one place.</p>
            </div>

            <Title title='My Bookings' subTitle='Manage your past, current, and upcoming reservations with clear status and quick actions.' align='left' />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4'>
                    <div className='h-11 w-11 rounded-full bg-[#E8F1FF] flex items-center justify-center'>
                        <img className='h-6 w-6' src={assets.totalBookingIcon} alt='total-bookings' />
                    </div>
                    <div>
                        <p className='text-xs text-slate-500 font-semibold'>Total Bookings</p>
                        <p className='text-2xl text-slate-900 font-semibold'>{bookings.length}</p>
                    </div>
                </div>
                <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                    <p className='text-xs text-slate-500 font-semibold'>Paid Bookings</p>
                    <p className='text-2xl text-slate-900 font-semibold mt-1'>{paidCount}</p>
                    <p className='text-xs text-slate-500 mt-2'>Confirmed payments</p>
                </div>
                <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                    <p className='text-xs text-slate-500 font-semibold'>Upcoming Stays</p>
                    <p className='text-2xl text-slate-900 font-semibold mt-1'>{upcomingCount}</p>
                    <p className='text-xs text-slate-500 mt-2'>Future check-ins</p>
                </div>
                <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                    <p className='text-xs text-slate-500 font-semibold'>Total Spent</p>
                    <p className='text-2xl text-slate-900 font-semibold mt-1'>${totalSpent}</p>
                    <p className='text-xs text-slate-500 mt-2'>{unpaidCount} unpaid booking(s)</p>
                </div>
            </div>

            <div className='max-w-6xl w-full text-slate-800 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-xl font-semibold text-slate-900'>Booking History</h3>
                    <div className='hidden md:flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                        Paid: {paidCount}
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-slate-300 py-12 text-center'>
                        <p className='text-slate-700 font-medium'>No bookings found</p>
                        <p className='text-sm text-slate-500 mt-1'>Your reservations will appear here after your first booking.</p>
                    </div>
                ) : (
                    <div className='overflow-x-auto rounded-xl border border-slate-200'>
                        <table className='min-w-full text-sm'>
                            <thead className='bg-slate-50 text-slate-600'>
                                <tr>
                                    <th className='text-left px-4 py-3 font-medium'>Stay</th>
                                    <th className='text-left px-4 py-3 font-medium'>Check-In</th>
                                    <th className='text-left px-4 py-3 font-medium'>Check-Out</th>
                                    <th className='text-left px-4 py-3 font-medium'>Guests</th>
                                    <th className='text-left px-4 py-3 font-medium'>Amount</th>
                                    <th className='text-left px-4 py-3 font-medium'>Payment</th>
                                    <th className='text-left px-4 py-3 font-medium'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((booking) => {
                                    const paymentExpired = hasPaymentWindowExpired(booking);

                                    return (
                                    <tr key={booking._id} className='border-t border-slate-200 align-top hover:bg-slate-50/70 transition-colors'>
                                        <td className='px-4 py-3'>
                                            <div className='flex items-start gap-3 min-w-[280px]'>
                                                <img className='w-20 h-14 rounded-md object-cover' src={booking.image} alt='booking-room' />
                                                <div>
                                                    <p className='font-medium text-slate-900'>{booking.hotelName}</p>
                                                    <p className='text-xs text-slate-500'>{booking.roomType}</p>
                                                    <div className='flex items-center gap-1 text-xs text-slate-500 mt-1'>
                                                        <img src={assets.locationIcon} alt='location-icon' className='w-3.5 h-3.5' />
                                                        <span>{booking.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-slate-700 whitespace-nowrap'>{formatDate(booking.checkInDate)}</td>
                                        <td className='px-4 py-3 text-slate-700 whitespace-nowrap'>{formatDate(booking.checkOutDate)}</td>
                                        <td className='px-4 py-3 text-slate-700'>{booking.guests}</td>
                                        <td className='px-4 py-3 font-semibold text-slate-900'>${booking.totalPrice}</td>
                                        <td className='px-4 py-3'>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${booking.isPaid ? 'bg-emerald-100 text-emerald-700' : paymentExpired ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${booking.isPaid ? 'bg-emerald-500' : paymentExpired ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                                {booking.isPaid ? 'Paid' : paymentExpired ? 'Expired' : 'Not Paid'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3'>
                                            {booking.isPaid ? (
                                                <span className='text-xs text-emerald-700 font-semibold'>Payment Done</span>
                                            ) : paymentExpired ? (
                                                <p className='text-xs text-red-700 font-medium max-w-[250px]'>
                                                    Sorry, this reservation was not paid before the required deadline, so the room has been released. Please book again and complete payment at least 3 hours before check-in.
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={() => handlePayment(booking._id)}
                                                    disabled={payingBookingId === booking._id}
                                                    className='px-3 py-1.5 text-xs rounded-md font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60'
                                                >
                                                    {payingBookingId === booking._id ? 'Redirecting...' : 'Pay Now'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyBookings