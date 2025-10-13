import React from 'react'


interface Props{
    children:React.ReactNode
}
export default function Conatiner({children }:Props) {
  return (
    <div className='min-h-screen p-2  bg-neutral-50 dark:bg-neutral-950  max-w-7xl mx-auto w-full'>{children}</div>
  )
}
