import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const ThemeContext = createContext({toggleTheme: ()=>{}, darkMode: false})

export default function ThemeProvider({children}) {
  const [darkMode, setDarkMode] = useState(false)
  
  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  if (darkMode) document.body.classList.add('dark')
  else document.body.classList.remove('dark')

  return (
    <ThemeContext.Provider value={{toggleTheme, darkMode}}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
