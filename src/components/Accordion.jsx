import clsx from 'clsx';
import uniqid from 'uniqid';
import {ArrowDownIcon} from "@src/assets/icons/index";
import {createContext, useContext, useEffect, useState} from 'react';

const Context = createContext(null)

function Accordion({children}) {
  const [open, setOpen] = useState(false)

  return (
    <div className='h-full flex flex-col gap-2'>
      <Context.Provider value={{open, setOpen}}>
        {children}
      </Context.Provider>
    </div>
  )
}


function Panel({children, title, defaultExpanded, disabled}) {
  const {open, setOpen} = useContext(Context)
  const [id] = useState(uniqid())

  useEffect(() => {
    if (defaultExpanded && !disabled) setOpen(id)
  }, []);

  const handleOpen = () => {
    if (disabled) return
    setOpen(id)
  }

  return (
    //TODO: Improve transitions & revoir overflows
    <div
      className={clsx('h-[56px] flex shrink-0 flex-col px-4 rounded-lg border border-c-neutral-700 bg-c-neutral-800 overflow-hidden duration-200', {'grow': open === id})}>
      <div
        className='flex items-center py-2'
        onClick={handleOpen}>
        <span className='mr-4'>
          <img src='/assets/icons/defaultIcon.svg' alt='pierre' className='size-6 m-2'/>
        </span>
        <span className='grow'>{title}</span>

        {disabled ? null :
          <span className='ml-4'>
          <img
            src={ArrowDownIcon} alt='Open'
            // className={clsx(open === id || disabled ? 'invisible relative top-1.5' : '', 'invert size-3 duration-2000 top-0')}/>
            className={clsx(open === id ? 'opacity-0 top-3' : ' top-0', 'transition-all invert size-3 duration-200 relative')}/>
          </span>
        }
      </div>


      <div className={clsx('py-2', open === id ? 'grow overflow-hidden' : '')}>
        {children}
      </div>
    </div>
  )
}


Accordion.Panel = Panel

export default Accordion