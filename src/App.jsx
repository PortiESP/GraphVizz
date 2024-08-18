import './App.css'
import Header from './components/header/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'

// Dynamic imports for components
const Graph = lazy(() => import('./components/graph-manager/GraphManager.jsx'))
const Overlay = lazy(() => import('./components/overlays/Overlay'))
const Help = lazy(() => import('./components/help/help'))
const Examples = lazy(() => import('./components/examples/Examples'))


// Define the routes for the app. 
// - The key is the path. E.g. "/help" will render a component when the path is "/help"
// - The value is the component to render when the path is matched
const ROUTES = {  // <-- EDIT THIS OBJECT TO CRUD THE ROUTES
    "/": <Overlay><Graph /></Overlay>,
    "/help": <Help />,
    "/examples": <Examples />
}

function App() {

    return (
        <Router>
            <main className='wrapper'>
                <Header />
                <Suspense>
                    <Routes>
                        {
                            Object.entries(ROUTES).map(([path, component]) => (
                                <Route key={path} path={path} element={component} />
                            ))
                        }
                    </Routes>
                </Suspense>
                <Toaster position="bottom-right" />
            </main>
        </Router>
    )
}

export default App
