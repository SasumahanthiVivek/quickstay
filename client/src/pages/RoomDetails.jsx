import React, { useCallback, useEffect, useState } from 'react'
import { assets, roomCommonData, roomsDummyData } from '../assets/assets'
import { useAppContext } from '../context/useAppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const defaultRoomImages = [assets.roomImg1, assets.roomImg2, assets.roomImg3, assets.roomImg4];

const getNextDateString = (dateString) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};

const CheckMarkIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.727-1.36 3.492 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate, isAdmin, currency } = useAppContext();

    const [room, setRoom] = useState(null);
    const [roomLoading, setRoomLoading] = useState(true);
    const [roomError, setRoomError] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [nights, setNights] = useState(0);
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const normalizeRoom = useCallback((rawRoom) => {
        const images = Array.isArray(rawRoom?.images) && rawRoom.images.length > 0
            ? rawRoom.images.filter(Boolean)
            : defaultRoomImages;

        const normalizedImages = images.length >= 4 ? images : [...images, ...defaultRoomImages].slice(0, 4);
        const hotelData = typeof rawRoom?.hotel === 'object' && rawRoom?.hotel !== null ? rawRoom.hotel : {};

        return {
            ...rawRoom,
            amenities: Array.isArray(rawRoom?.amenities) ? rawRoom.amenities : [],
            images: normalizedImages,
            hotel: {
                ...hotelData,
                name: hotelData?.name || 'Hotel',
                address: hotelData?.address || 'Address unavailable',
                owner: hotelData?.owner || {},
            },
        };
    }, []);

    const onChangeCheckInDate = (value) => {
        setCheckInDate(value);
        setHasCheckedAvailability(false);
        setIsAvailable(false);

        const minCheckoutDate = getNextDateString(value);
        if (checkOutDate && minCheckoutDate && checkOutDate < minCheckoutDate) {
            setCheckOutDate('');
        }
    };

    const onChangeCheckOutDate = (value) => {
        if (!checkInDate) {
            toast.error('Please select Check-In date first');
            setCheckOutDate('');
            return;
        }

        const minCheckoutDate = getNextDateString(checkInDate);
        if (value && minCheckoutDate && value < minCheckoutDate) {
            toast.error('Check-Out date must be after Check-In date');
            setCheckOutDate('');
            return;
        }

        setCheckOutDate(value);
        setHasCheckedAvailability(false);
        setIsAvailable(false);
    };

    // Check if the Room is Available
    const checkAvailability = async () => {
        try {
            if (!checkInDate) {
                toast.error('Please select Check-In date first');
                return;
            }

            if (!checkOutDate) {
                toast.error('Please select Check-Out date');
                return;
            }

            //  Check is Check-In Date is greater than Check-Out Date
            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date')
                return;
            }

            setCheckingAvailability(true);
            setHasCheckedAvailability(false);
            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate })
            if (data.success) {
                setHasCheckedAvailability(true);
                if (data.isAvailable) {
                    setIsAvailable(true)
                    toast.success('Room is available for your dates!')
                } else {
                    setIsAvailable(false)
                    toast.error('Sorry, room is booked for these dates')
                }
            } else {
                setIsAvailable(false)
                toast.error(data.message)
            }
        } catch (error) {
            setIsAvailable(false)
            if (error?.code === 'ERR_NETWORK') {
                toast.error('Unable to connect to server. Please make sure backend is running.')
            } else {
                toast.error(error?.response?.data?.message || error.message || 'Failed to check availability')
            }
        } finally {
            setCheckingAvailability(false);
        }
    }

    // onSubmitHandler function to check availability & book the room
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (bookingInProgress || showBookingSuccess) {
                return;
            }
            if (!isAvailable) {
                return checkAvailability();
            } else {
                setBookingInProgress(true);
                const { data } = await axios.post('/api/bookings/book', { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, { headers: { Authorization: `Bearer ${await getToken()}` } })
                if (data.success) {
                    setShowBookingSuccess(true)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBookingInProgress(false);
        }
    }

    // Calculate nights when dates change
    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setNights(calculatedNights > 0 ? calculatedNights : 0);
        } else {
            setNights(0);
            setIsAvailable(false);
            setHasCheckedAvailability(false);
        }
    }, [checkInDate, checkOutDate]);

    useEffect(() => {
        let isMounted = true;

        const loadRoomDetails = async () => {
            try {
                setRoomLoading(true);
                setRoomError('');

                const selectedRoom = rooms.find(room => room._id === id) || roomsDummyData.find(room => room._id === id);

                if (selectedRoom) {
                    const normalizedRoom = normalizeRoom(selectedRoom);
                    if (!isMounted) return;
                    setRoom(normalizedRoom);
                    setMainImage((prev) => (normalizedRoom.images.includes(prev) ? prev : (normalizedRoom.images[0] || null)));
                    return;
                }

                const { data } = await axios.get('/api/rooms');
                const apiRoom = (data?.rooms || []).find(room => room._id === id);

                if (!isMounted) return;

                if (!apiRoom) {
                    setRoom(null);
                    setMainImage(null);
                    setRoomError('Room details not found.');
                    return;
                }

                const normalizedRoom = normalizeRoom(apiRoom);
                setRoom(normalizedRoom);
                setMainImage((prev) => (normalizedRoom.images.includes(prev) ? prev : (normalizedRoom.images[0] || null)));
            } catch (error) {
                if (!isMounted) return;
                setRoom(null);
                setMainImage(null);
                setRoomError('Unable to load room details right now. Please try again.');
            } finally {
                if (isMounted) {
                    setRoomLoading(false);
                }
            }
        };

        loadRoomDetails();

        return () => {
            isMounted = false;
        };
    }, [id, rooms, axios, normalizeRoom]);

    const totalPrice = room && nights > 0 ? room.pricePerNight * nights : 0;

    if (roomLoading) {
        return (
            <div className='py-24 md:py-35 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>
                <p className='text-gray-500'>Loading room details...</p>
            </div>
        )
    }

    if (!room) {
        return (
            <div className='py-24 md:py-35 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>
                <p className='text-gray-500'>{roomError || 'Room details not found.'}</p>
                <button onClick={() => navigate('/hotels')} className='mt-4 px-4 py-2 rounded bg-primary text-white cursor-pointer'>Back to Hotels</button>
            </div>
        )
    }

    return (
        <div className='py-24 md:py-35 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>

            {showBookingSuccess && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
                    <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm font-semibold text-green-600'>Booking Confirmed</p>
                            <button onClick={() => setShowBookingSuccess(false)} className='text-gray-400 hover:text-gray-600'>✕</button>
                        </div>
                        <h2 className='mt-3 text-2xl font-bold text-gray-900'>Congratulations! Your stay is booked.</h2>
                        <p className='mt-2 text-gray-600'>We have reserved your room for the selected dates. You can manage payment and details from your bookings.</p>
                        <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                            <button
                                onClick={() => {
                                    setShowBookingSuccess(false);
                                    navigate('/my-bookings');
                                    scrollTo(0, 0);
                                }}
                                className='w-full rounded-lg bg-primary py-2.5 text-white font-semibold hover:bg-primary-dull'
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => setShowBookingSuccess(false)}
                                className='w-full rounded-lg border border-gray-300 py-2.5 font-semibold text-gray-700 hover:bg-gray-50'
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Room Details Header */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 mb-4'>
                <div>
                    <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}</h1>
                    <p className='text-gray-600 mt-1'>{room.roomType}</p>
                </div>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>Special Offer</p>
            </div>
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2 text-gray-600'>200+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt='location-icon' />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-8 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img className='w-full rounded-xl shadow-lg object-cover h-64 sm:h-80 md:h-96'
                        src={mainImage} alt='Room Image' />
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images.length > 1 && room.images.map((image, index) => (
                        <img key={index} onClick={() => setMainImage(image)}
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer h-40 transition-all ${mainImage === image && 'ring-2 ring-orange-500'}`} src={image} alt='Room Image' />
                    ))}
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-12 mb-8'>
                <div className='flex-1'>
                    <h2 className='text-2xl md:text-3xl font-playfair mb-4'>Room Features</h2>
                    <div className='flex flex-wrap items-center gap-3 mb-6'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all'>
                                {facilityIcons[item] && <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />}
                                <p className='text-sm font-medium'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
                <div className='md:text-right'>
                    <p className='text-4xl font-bold text-primary'>{currency}{room.pricePerNight}</p>
                    <p className='text-gray-600'>per night</p>
                </div>
            </div>

            {/* CheckIn CheckOut Form */}
            {!isAdmin ? (
                <form onSubmit={onSubmitHandler} className='bg-white shadow-lg rounded-xl p-6 md:p-8 mb-12'>
                    <h2 className='text-2xl font-bold mb-6'>Book Your Stay</h2>

                    <div className='grid md:grid-cols-4 gap-4 mb-6'>
                        <div className='flex flex-col'>
                            <label htmlFor='checkInDate' className='font-semibold text-gray-700 mb-2'>Check-In</label>
                            <input onChange={(e) => onChangeCheckInDate(e.target.value)} value={checkInDate || ''} id='checkInDate' type='date' min={today} className='w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 outline-none focus:border-primary transition-all' required />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='checkOutDate' className='font-semibold text-gray-700 mb-2'>Check-Out</label>
                            <input
                                onFocus={() => {
                                    if (!checkInDate) {
                                        toast.error('Please select Check-In date first')
                                    }
                                }}
                                onChange={(e) => onChangeCheckOutDate(e.target.value)}
                                value={checkOutDate || ''}
                                id='checkOutDate'
                                type='date'
                                min={getNextDateString(checkInDate) || ''}
                                disabled={!checkInDate}
                                className='w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 outline-none focus:border-primary transition-all'
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='guests' className='font-semibold text-gray-700 mb-2'>Guests</label>
                            <input onChange={(e) => setGuests(e.target.value)} value={guests} id='guests' type='number' min="1" max="10" className='w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 outline-none focus:border-primary transition-all' required />
                        </div>
                        <div className='flex flex-col justify-end'>
                            <button type='button' onClick={checkAvailability} disabled={!checkInDate || !checkOutDate || checkingAvailability} className='bg-primary hover:bg-primary-dull disabled:bg-gray-400 text-white rounded-lg py-2.5 font-semibold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed'>
                                {checkingAvailability ? 'Checking...' : 'Check'}
                            </button>
                        </div>
                    </div>

                    {/* Availability Status */}
                    {hasCheckedAvailability && checkInDate && checkOutDate && (
                        <>
                            {isAvailable ? (
                                <div className='mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3'>
                                    <CheckMarkIcon />
                                    <div>
                                        <p className='font-semibold text-green-800'>Available!</p>
                                        <p className='text-sm text-green-700'>This room is available for {nights} night{nights !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3'>
                                    <AlertIcon />
                                    <div>
                                        <p className='font-semibold text-red-800'>Not Available</p>
                                        <p className='text-sm text-red-700'>This room is already booked for your requested dates. Please select different dates.</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Price Summary */}
                    {nights > 0 && (
                        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                            <div className='flex justify-between mb-2'>
                                <span className='text-gray-700'>{currency}{room.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}</span>
                                <span className='font-semibold'>{currency}{totalPrice}</span>
                            </div>
                            <div className='flex justify-between pt-2 border-t-2 border-gray-200'>
                                <span className='font-bold'>Total Amount</span>
                                <span className='text-2xl font-bold text-primary'>{currency}{totalPrice}</span>
                            </div>
                        </div>
                    )}

                    {/* Book Button */}
                    <button type='submit' className={`w-full py-3 md:py-4 rounded-lg font-semibold text-white text-lg transition-all active:scale-95 cursor-pointer ${
                        isAvailable && hasCheckedAvailability && checkInDate && checkOutDate && !bookingInProgress && !showBookingSuccess
                            ? 'bg-primary hover:bg-primary-dull'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`} disabled={!isAvailable || !hasCheckedAvailability || !checkInDate || !checkOutDate || bookingInProgress || showBookingSuccess}>
                        {bookingInProgress ? "Booking..." : (isAvailable ? "Book Now" : "Select Dates & Check Availability")}
                    </button>
                </form>
            ) : (
                <div className='bg-white shadow-lg rounded-xl p-6 md:p-8 mb-12 border border-slate-200'>
                    <h2 className='text-2xl font-bold mb-2'>Booking Disabled for Admin</h2>
                    <p className='text-slate-600'>This account is used for hotel management, so booking actions are hidden to prevent inventory conflicts and inaccurate revenue reporting.</p>
                </div>
            )}

            {/* Common Specifications */}
            <div className='mt-12 bg-gray-50 rounded-xl p-8'>
                <h2 className='text-2xl font-bold mb-8'>What's Included</h2>
                <div className='space-y-6'>                
                    {roomCommonData.map((spec, index) => (
                        <div key={index} className='flex items-start gap-4'>
                            <img className='w-8 h-8 flex-shrink-0' src={spec.icon} alt={`${spec.title}-icon`} />
                            <div>
                                <p className='font-semibold text-gray-800'>{spec.title}</p>
                                <p className='text-gray-600 text-sm'>{spec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className='mt-12 border-y border-gray-300 py-10 text-gray-600'>
                <p className='leading-relaxed'>Guests will be allocated according to availability. You get a comfortable room with modern amenities and excellent service. The price is per guest - adjust the guest count for accurate pricing. Our staff will ensure your stay is comfortable and memorable with ground floor access and premium facilities.</p>
            </div>

            {/* Host Information */}
            <div className='mt-12 flex flex-col items-start gap-6 pb-8'>
                <div className='flex gap-4 items-start'>
                    <img className='h-16 w-16 md:h-20 md:w-20 rounded-full object-cover' src={room.hotel.owner?.image || assets.logo} alt='Host' />
                    <div>
                        <p className='text-xl md:text-2xl font-bold'>Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-2'>
                            <StarRating />
                            <p className='ml-2 text-gray-600 text-sm'>4.8 (127 reviews)</p>
                        </div>
                        <p className='text-gray-600 text-sm mt-1'>Professional hotel with premium service</p>
                    </div>
                </div>
                <button className='px-8 py-3 rounded-lg text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer font-semibold'>
                    Message Host
                </button>
            </div>
        </div>
    )
}

export default RoomDetails
