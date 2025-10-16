'use client'

import NotFound from '@/app/franqueado/components/develop'
import HeaderFranqueado from '../components/HeaderFranqueado'
import Sidebar from '../components/Sidebar'
export default function MarketingPage(){

    return (
        <>
        <HeaderFranqueado />
        <Sidebar active='marketing' />
        <NotFound />
        </>
    )
}