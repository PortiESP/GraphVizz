import './App.css'
import Graph from './components/graph-manager/GraphManager'
import Header from './components/header/Header'
import Overlay from './components/tool-overlay/Overlay'
import Help from './components/help/help'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Examples from './components/examples/Examples'

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
            <div className='wrapper'>
                <Header />
                <Routes>
                    {
                        Object.entries(ROUTES).map(([path, component]) => (
                            <Route key={path} path={path} element={component} />
                        ))
                    }
                </Routes>
            </div>
        </Router>
    )
}

export default App
