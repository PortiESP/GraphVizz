import './App.css'
import Graph from './components/graph-manager/GraphManager'
import Header from './components/header/Header'
import ToolOverlay from './components/tool-overlay/ToolOverlay'
import Help from './components/help/help'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const SCENES = {
  "canvas": <ToolOverlay><Graph /></ToolOverlay>,
  "help": <Help />,
}

function App() {

  return (
    <Router>
      <div className='wrapper'>
        <Header/>
        <Routes>
          <Route path='/' element={SCENES.canvas} />
          <Route path='/help' element={SCENES.help} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
