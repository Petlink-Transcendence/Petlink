import './Home.css'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
        document.title = "Login | PetLink";
    }, []);

  return (
    <div className="page-content"> {/* Adicione aqui */}
      <h1>This will be a homepage soon!</h1>
    </div>
  )
}
