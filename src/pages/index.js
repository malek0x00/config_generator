import Image from 'next/image'
import { Inter } from 'next/font/google'
import ConfigPreview from './components/config_prev'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from './components/nav'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [files, setFiles] = useState([])
  useEffect(()=>{
    axios.get("/api/data").then((res)=>{
      setFiles(res.data)
      console.log(res.data)
    })
  },[])
  return (
   <>
   <Nav />
    <div className='p-4 flex flex-row gap-8'>
      
      {files && files.map((file, index) => {
        if (file.name.endsWith(".json")){
         return(
          <ConfigPreview key={index} path={file.name} name={JSON.parse(file.content).name} configfile={JSON.parse(file.content).config_path} />
        )
      }})}
    </div>
   </>
  )
}
