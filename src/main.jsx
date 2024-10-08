import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global object to store functions that can be called from anywhere in the app (mainly used to store state setters, so they can be called from the canvas main loop)
window.ui = {
    funcs: {},  // Global functions will be stored here (should not be used directly, use the `set` and `call` instead)
    set: (name, func) => window.ui.funcs[name] = func,  // Set a function in the global object
    call: (name, ...args) => window.ui.funcs[name] ? window.ui.funcs[name](...args): undefined,  // Call a function from the global object
}  

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
