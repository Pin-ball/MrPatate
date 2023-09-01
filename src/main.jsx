import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './assets/styles/index.css'

import { store } from './store/store.js'
import { Provider } from 'react-redux'
import ThemeProvider from './ThemeProvider'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  // </React.StrictMode>,
)
