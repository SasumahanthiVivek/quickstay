import React, { useCallback, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const ListRoom = () => {

    const { axios, getToken, user } = useAppContext()
    const [rooms, setRooms] = React.useState([])

    // Fetch Rooms of the Hotel Owner
    const fetchRooms = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setRooms(data.rooms)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken])

    // Toggle Availability of the Room
    const toggleAvailability = async (roomId) => {
        const { data } = await axios.post("/api/rooms/toggle-availability", { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
        if (data.success) {
            toast.success(data.message)
            fetchRooms()
        } else {
            toast.error(data.message)
        }
    }

    // Fetch Rooms when user is logged in
    useEffect(() => {
        if (user) {
            fetchRooms()
        }
    }, [fetchRooms, user])

    return (
        <div className='space-y-4'>
            <Title align='left' font='outfit' title='Room Listings' subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.' />
            <div className='bg-white border border-gray-200 rounded-xl p-5'>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-gray-700 font-medium'>Total Rooms</p>
                    <span className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium'>{rooms.length}</span>
                </div>

                {rooms.length === 0 ? (
                    <div className='rounded-lg border border-dashed border-gray-300 py-10 text-center'>
                        <p className='text-gray-700 font-medium'>No rooms listed yet</p>
                        <p className='text-sm text-gray-500 mt-1'>Add your first room to start receiving bookings.</p>
                    </div>
                ) : (
                    <div className='w-full text-left border border-gray-200 rounded-lg max-h-96 overflow-auto'>
                <table className='w-full min-w-[640px]' >
                    <thead className='bg-gray-50 sticky top-0'>
                        <tr>
                            <th className='py-3 px-4 text-gray-700 font-medium'>Room Type</th>
                            <th className='py-3 px-4 text-gray-700 font-medium max-sm:hidden'>Amenities</th>
                            <th className='py-3 px-4 text-gray-700 font-medium'>Price / night</th>
                            <th className='py-3 px-4 text-gray-700 font-medium text-center'>Availability</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {
                            rooms.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50/70'>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-200 font-medium'>{item.roomType}</td>
                                    <td className='py-3 px-4 text-gray-500 border-t border-gray-200 max-sm:hidden'>{item.amenities.join(', ')}</td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-200'>${item.pricePerNight}</td>
                                    <td className='py-3 px-4 border-t border-gray-200 text-center'>
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input type="checkbox" className="sr-only peer" onChange={() => toggleAvailability(item._id)} checked={item.isAvailable} />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
                )}
            </div>
        </div>
    )
}

export default ListRoom