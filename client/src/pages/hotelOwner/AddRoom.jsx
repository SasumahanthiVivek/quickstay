import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/useAppContext'

const AddRoom = () => {

    const { axios, getToken } = useAppContext()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: 0,
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Check if all inputs are filled
        if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('roomType', inputs.roomType)
            formData.append('pricePerNight', inputs.pricePerNight)
            // Converting Amenities to Array & keeping only enabled Amenities
            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
            formData.append('amenities', JSON.stringify(amenities))

            // Adding Images to FormData
            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const { data } = await axios.post('/api/rooms/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    roomType: '',
                    pricePerNight: 0,
                    amenities: {
                        'Free WiFi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false
                    }
                })
                setImages({ 1: null, 2: null, 3: null, 4: null })
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='space-y-6'>
            <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.' />

            <div className='bg-white border border-gray-200 rounded-xl p-5 md:p-6'>
                <p className='text-gray-800 font-medium'>Room Images</p>
                <p className='text-sm text-gray-500 mt-1'>Upload at least one image. Best results come with 3-4 images.</p>
                <div className='grid grid-cols-2 sm:flex gap-4 my-4 flex-wrap'>
                    {Object.keys(images).map((key) => (
                        <label key={key} htmlFor={`roomImage${key}`} className='border border-gray-200 rounded-lg p-2 bg-gray-50 cursor-pointer'>
                            <img className='h-16 w-24 object-cover rounded opacity-85' src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="room-upload" />
                            <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                                onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                        </label>
                    ))}
                </div>

                <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                    <div className='sm:col-span-2'>
                        <p className='text-gray-800 text-sm font-medium'>Room Type</p>
                        <select className='border border-gray-300 mt-1 rounded-lg p-2.5 w-full bg-white' value={inputs.roomType} onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}>
                            <option value=''>Select Room Type</option>
                            <option value='Single Bed'>Single Bed</option>
                            <option value='Double Bed'>Double Bed</option>
                            <option value='Luxury Room'>Luxury Room</option>
                            <option value='Family Suite'>Family Suite</option>
                        </select>
                    </div>

                    <div>
                        <p className='text-gray-800 text-sm font-medium'>Price <span className='text-xs'>/night</span></p>
                        <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded-lg p-2.5 w-full bg-white' value={inputs.pricePerNight} onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                    </div>
                </div>

                <p className='text-gray-800 mt-5 font-medium'>Amenities</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-gray-600 max-w-xl'>
                    {Object.keys(inputs.amenities).map((amenity, index) => (
                        <label key={index} htmlFor={`amenities${index + 1}`} className='flex items-center gap-2 py-1'>
                            <input type='checkbox' id={`amenities${index + 1}`} checked={inputs.amenities[amenity]}
                                onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })}
                            />
                            <span>{amenity}</span>
                        </label>
                    ))}
                </div>

                <button className='bg-primary text-white px-8 py-2.5 rounded-lg mt-8 cursor-pointer hover:bg-primary-dull transition-all' disabled={loading}>
                    {loading ? "Adding..." : "Add Room"}
                </button>
            </div>
        </form>
    )
}

export default AddRoom
