"use client";
import { AuthModel } from '@/components/client/auth-model'
import { Footer } from '@/components/client/footer'
import { Loader } from '@/components/client/loaders';
import { Navbar } from '@/components/client/navbar'
import { useAppStore } from '@/store';
import { useDisclosure } from '@nextui-org/react'
import { usePathname } from 'next/navigation';
import React from 'react'

const PageLayout = ({children}:{children:React.ReactNode}) => {
  const {isOpen,onOpen,onOpenChange} = useDisclosure()
  const pathName= usePathname();
  const {isScraping} = useAppStore();
  return (
    <>
    {pathName.includes("/admin") ? (
        children
      ):(
    <div className='relative flex flex-col' id='app-container'>
      <main className='flex flex-col relative'>
        {isScraping && <Loader/>}
        <Navbar onOpen = {onOpen}/>
        <section className='h-full flex-1'>
            {children}
        </section>
        <AuthModel  isOpen={isOpen}
              onOpen={onOpen}
              onOpenChange={onOpenChange}/>
        <Footer/>
      </main>
    </div>
     )
    }
     </>
     
  )
}

export default PageLayout
