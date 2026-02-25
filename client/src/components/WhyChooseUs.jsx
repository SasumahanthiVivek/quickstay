import React from 'react'
import Title from './Title'

const highlights = [
    {
        title: 'Curated Premium Properties',
        description: 'Every listed stay is selected for design quality, guest comfort, and consistent service standards.',
        metric: '120+ Verified Stays',
    },
    {
        title: 'Priority Guest Support',
        description: 'Our hospitality team responds quickly with practical solutions before, during, and after your stay.',
        metric: '24/7 Assistance',
    },
    {
        title: 'Transparent Booking Confidence',
        description: 'Clear pricing, reliable room details, and smooth confirmations help you plan every trip with confidence.',
        metric: '4.8/5 Service Rating',
    },
]

const WhyChooseUs = () => {
    return (
        <section className='px-6 md:px-16 lg:px-24 py-18 bg-slate-50'>
            <div className='max-w-6xl mx-auto space-y-10'>
                <Title
                    title='Why Choose Urbanza Suites'
                    subTitle='A hospitality-first experience built for modern travelers who expect premium stays, dependable support, and world-class comfort.'
                />

                <div className='grid lg:grid-cols-[1.15fr_.85fr] gap-6'>
                    <div className='grid md:grid-cols-3 lg:grid-cols-1 gap-5'>
                        {highlights.map((item) => (
                            <article
                                key={item.title}
                                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'
                            >
                                <p className='text-xs font-semibold tracking-wider text-blue-700 uppercase'>{item.metric}</p>
                                <h3 className='mt-2 text-xl font-semibold text-slate-900'>{item.title}</h3>
                                <p className='mt-3 text-slate-600 leading-relaxed'>{item.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className='relative group rounded-2xl overflow-hidden border border-slate-200 shadow-lg'>
                        <img
                            src='https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80'
                            alt='Luxury hotel interior'
                            className='w-full h-full min-h-[430px] object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent' />

                        <div className='absolute left-4 right-4 bottom-4 rounded-xl bg-white/95 p-4 border border-white/70 shadow-md'>
                            <p className='text-xs font-semibold tracking-wider text-blue-700 uppercase'>Urbanza Signature</p>
                            <p className='mt-1 text-slate-900 font-semibold text-lg'>Luxury stays with detail-driven hospitality</p>
                            <p className='text-sm text-slate-600 mt-1'>From refined interiors to responsive service, every moment is designed to feel effortless and elevated.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
