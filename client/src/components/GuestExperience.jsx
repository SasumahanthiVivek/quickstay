import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const servicePillars = [
    {
        title: 'Pre-Arrival Planning',
        description: 'Get clear check-in details, room expectations, and city guidance before your trip starts.',
        icon: assets.locationFilledIcon,
    },
    {
        title: 'On-Stay Reliability',
        description: 'From room readiness to support response, every touchpoint is managed for comfort and consistency.',
        icon: assets.badgeIcon,
    },
    {
        title: 'Post-Stay Follow Through',
        description: 'We keep improving with guest feedback to make each next booking smoother and better.',
        icon: assets.heartIcon,
    },
]

const GuestExperience = () => {
    return (
        <section className='px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch'>
                    <div className='lg:col-span-7 lg:flex'>
                        <div className='space-y-6 w-full h-full flex flex-col'>
                            <Title
                                align='left'
                                title='A Complete Guest Journey, Designed Professionally'
                                subTitle='Urbanza Suites combines premium stays with practical service operations, so every booking feels transparent, reliable, and polished from search to checkout.'
                            />

                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                                <div className='rounded-xl border border-slate-200 p-4 bg-slate-50 min-h-[96px] flex flex-col justify-center'>
                                    <p className='text-2xl font-semibold text-slate-900'>10K+</p>
                                    <p className='text-xs text-slate-600 mt-1 leading-5'>Guest nights supported</p>
                                </div>
                                <div className='rounded-xl border border-slate-200 p-4 bg-slate-50 min-h-[96px] flex flex-col justify-center'>
                                    <p className='text-2xl font-semibold text-slate-900'>98%</p>
                                    <p className='text-xs text-slate-600 mt-1 leading-5'>On-time confirmations</p>
                                </div>
                                <div className='rounded-xl border border-slate-200 p-4 bg-slate-50 min-h-[96px] flex flex-col justify-center'>
                                    <p className='text-2xl font-semibold text-slate-900'>4.9/5</p>
                                    <p className='text-xs text-slate-600 mt-1 leading-5'>Average stay experience</p>
                                </div>
                            </div>

                            <div className='space-y-4 flex-1 flex flex-col'>
                                {servicePillars.map((item) => (
                                    <article key={item.title} className='rounded-2xl border border-slate-200 p-4 sm:p-5 bg-white shadow-sm min-h-[108px] flex items-center flex-1'>
                                        <div className='flex items-start gap-3'>
                                            <div className='h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0'>
                                                <img src={item.icon} alt={item.title} className='h-5 w-5' />
                                            </div>
                                            <div>
                                                <h3 className='text-base sm:text-lg font-semibold text-slate-900 leading-7'>{item.title}</h3>
                                                <p className='text-sm text-slate-600 mt-1 leading-7'>{item.description}</p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='lg:col-span-5 h-full lg:flex'>
                        <div className='rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white h-full flex flex-col'>
                            <img src={assets.regImage} alt='Hotel guest concierge support' className='w-full h-60 sm:h-72 lg:h-[250px] object-cover' />

                            <div className='p-5 sm:p-6 space-y-5 flex-1 flex flex-col'>
                                <div>
                                    <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>Hospitality Standard</p>
                                    <p className='text-xl font-semibold text-slate-900 mt-2 leading-8'>Built for business and leisure travelers</p>
                                    <p className='text-sm text-slate-600 mt-2 leading-7'>Whether you travel for meetings, family breaks, or weekend escapes, our service process is tuned for speed, clarity, and quality.</p>
                                </div>

                                <img src={assets.roomImg3} alt='Premium room interior' className='w-full h-44 lg:h-[170px] object-cover rounded-xl' />

                                <div className='grid grid-cols-2 gap-3 mt-auto'>
                                    <div className='rounded-lg bg-slate-50 border border-slate-200 p-3 min-h-[96px] flex flex-col justify-center'>
                                        <p className='text-xs text-slate-500'>Average support reply</p>
                                        <p className='text-base font-semibold text-slate-900 mt-1'>Under 15 min</p>
                                    </div>
                                    <div className='rounded-lg bg-slate-50 border border-slate-200 p-3 min-h-[96px] flex flex-col justify-center'>
                                        <p className='text-xs text-slate-500'>Verified hotel partners</p>
                                        <p className='text-base font-semibold text-slate-900 mt-1'>Curated list</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GuestExperience
