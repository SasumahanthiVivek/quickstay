import React, { useMemo, useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'

const NewsLetter = () => {
    const { toast } = useAppContext()
    const [email, setEmail] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const adminEmail = useMemo(
        () => (import.meta.env.VITE_ADMIN_EMAIL || 'crazyfunboys576@gmail.com').trim().toLowerCase(),
        []
    )

    const handleSubscribe = (e) => {
        e.preventDefault()
        const trimmedEmail = email.trim().toLowerCase()

        if (!trimmedEmail) {
            toast.error('Please enter your email address.')
            setSuccessMessage('')
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(trimmedEmail)) {
            toast.error('Please enter a valid email address.')
            setSuccessMessage('')
            return
        }

        const [localPart, domainPart] = trimmedEmail.split('@')
        const blockedLocals = ['test', 'testing', 'demo', 'dummy', 'sample', 'example', 'admin', 'user']
        const blockedDomains = [
            'example.com',
            'test.com',
            'dummy.com',
            'mailinator.com',
            'tempmail.com',
            '10minutemail.com',
            'yopmail.com'
        ]

        if (!localPart || !domainPart || blockedLocals.includes(localPart) || blockedDomains.includes(domainPart)) {
            toast.error('Please use a real personal email address.')
            setSuccessMessage('')
            return
        }

        if (trimmedEmail === adminEmail) {
            toast.error('This email is reserved for admin login and cannot be used for newsletter subscription.')
            setSuccessMessage('')
            return
        }

        setSuccessMessage('Thank you for subscribing to Urbanza Suites. You will now receive our latest offers and guest experience updates.')
        setEmail('')
        toast.success('Subscription successful!')
    }

    return (
        <div className='flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white'>
            <Title title="Stay Inspired" subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration." />
            <form onSubmit={handleSubscribe} className='flex flex-col md:flex-row items-center justify-center gap-4 mt-6'>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full'
                    placeholder='Enter your email'
                />
                <button type='submit' className='cursor-pointer flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all'>
                    Subscribe
                    <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert group-hover:translate-x-1 transition-all' />
                </button>
            </form>
            {successMessage && (
                <p className='mt-4 text-sm text-green-300 text-center max-w-2xl'>{successMessage}</p>
            )}
            <p className='text-gray-500 mt-6 text-xs text-center'>By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
    )
}

export default NewsLetter