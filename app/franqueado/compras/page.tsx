'use client'

import Sidebar from '../components/Sidebar'
import NotFound from '@/app/franqueado/components/develop'
import HeaderFranqueado from '../components/HeaderFranqueado'
export default function ComprasPage(){


    return (
        <>
            <HeaderFranqueado />
            <Sidebar active="compras" />
            <NotFound />
        </>
    )
}