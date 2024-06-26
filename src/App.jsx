import './App.css'
import Graph from './components/graph-manager/GraphManager'
import Header from './components/header/Header'
import ToolOverlay from './components/tool-overlay/ToolOverlay'

function App() {

  return (
    <div className='wrapper'>
      <Header />
      <ToolOverlay>
        <Graph />
      </ToolOverlay>
    </div>
  )
}

export default App
