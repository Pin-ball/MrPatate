import Menu from '@src/components/Menu'
import Header from '@src/components/Header'
import Viewer from '@src/components/Viewer'

function App() {

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
