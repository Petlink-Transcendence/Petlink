import './Home.css'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    document.title = "Home | PetLink";
  }, []);
  
  return (
    <>
      <h1>This will be a homepage soon!</h1>
    </>
  )
}
