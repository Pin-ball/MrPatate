import Menu from '@src/components/Menu'
import Header from '@src/components/Header'
import Viewer from '@src/components/Viewer'
import Mobile from "@src/components/Mobile.jsx";
import useMediaQuery from "@src/hooks/useMediaQuery.jsx";

function App() {
  const isMobile = useMediaQuery('(max-width: 800px)');
  if (isMobile) return <Mobile/>

  return (
    <div className='h-screen flex p-7'>
      <nav className='min-w-[390px] w-1/3'>
        <Menu/>
      </nav>
      <main className='grow flex flex-col'>
        <Header/>
        <Viewer/>
      </main>
    </div>
  )
}

export default App
