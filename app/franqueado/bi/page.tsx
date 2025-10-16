'use client'

import NotFound from '@/app/franqueado/components/develop'
import HeaderFranqueado from '../components/HeaderFranqueado'
import Sidebar from '../components/Sidebar'
export default function BIPage(){

    return (
        <>
        <HeaderFranqueado />
        <Sidebar active='bi' />
        <NotFound />
        </>
    )
}