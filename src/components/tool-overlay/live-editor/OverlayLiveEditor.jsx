import { useRef } from "react"
import scss from "./liveEditor.module.scss"
import { useState } from "react"
import { generateEdgeAndNodesList, generateEdgeList } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import { useEffect } from "react"
import { isSingleNodeEdge, isValidEdge, loadFromEdgePlainTextList, parseEdge } from "../../graph-manager/utils/load_graph"
import { circularArrange, getNodeById, organicArrange } from "../../graph-manager/utils/arrangements"
import { focusOnAllNodes } from "../../graph-manager/utils/view"

export default function GraphEditor(props) {

    const [lines, setLines] = useState([])
    const [textarea, setTextarea] = useState("")
    const [forceUpdate, setForceUpdate] = useState(0) // Force update when the selected elements change
    const $tArea = useRef(null)

    const handleTextChange = (e) => {
        const newLines = e.target.value?.split("\n") || []
        setLines(newLines)
        setTextarea(e.target.value)
        
        const validEdges = []
        const invalidLines = []
        
        $tArea.current.style.height = "auto"
        $tArea.current.style.height = $tArea.current.scrollHeight + "px"
        
        newLines.forEach((line, i) => {
            if (line === "") return
            
            if (isValidEdge(line)) validEdges.push(line)
            else invalidLines.push(i)
        })

        const nodesBefore = Object.fromEntries(window.graph.nodes.map(node => [node.label, node]))
        loadFromEdgePlainTextList(validEdges.join("\n"), nodesBefore)

        // Create a object containing the old nodes to avoid repositioning them
        organicArrange(nodesBefore)
        focusOnAllNodes()

    }

    useEffect(() => {
        if (document.activeElement === $tArea.current) return

        const resList = generateEdgeAndNodesList()  
        setLines(resList)
        setTextarea(resList.join("\n"))

    }, [forceUpdate])
    
    useEffect(() => {
        window.graph.graphListeners.push(() => setForceUpdate(old => old + 1))
    }, [])


    return (
        <div className={scss.wrap}>
            <div className={scss.lines_nums}>
                {
                    lines.map((line, i) => <div key={i} className={scss.line_num}>{i + 1}</div>)
                }
                {
                    lines.length === 0 && <div className={scss.line_num}>{1}</div>
                }
            </div>
            <textarea name="live-editor" id="live-editor" autoCapitalize="off" wrap="off" autoCorrect="off" spellCheck="false" ref={$tArea} 
                onInput={handleTextChange}
                value={textarea}
                rows={lines.length}
            ></textarea>
        </div>
    )
}


