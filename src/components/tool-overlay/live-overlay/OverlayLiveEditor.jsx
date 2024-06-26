import { useRef } from "react"
import scss from "./liveEditor.module.scss"
import { useState } from "react"
import { generateEdgeList } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import { useEffect } from "react"
import { isSingleNodeEdge, isValidEdge, loadFromEdgePlainTextList, parseEdge } from "../../graph-manager/utils/load_graph"
import { circularArrange } from "../../graph-manager/utils/arrangements"
import { focusOnAllNodes } from "../../graph-manager/utils/view"

export default function GraphEditor(props) {

    const [lines, setLines] = useState([])
    const [textarea, setTextarea] = useState("")
    const $tArea = useRef(null)

    const handleTextChange = (e) => {
        const newLines = e.target.value?.split("\n").map(line => line.trim()) || []
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

        console.log(textarea)
        console.log("Valid", validEdges, "Invalid", invalidLines)
        
        loadFromEdgePlainTextList(validEdges.join("\n"))
        circularArrange(window.graph.nodes)
        focusOnAllNodes()

    }

    useEffect(() => {
        const eList = generateEdgeList()
        setLines(eList)
        setTextarea(eList.join("\n"))
    }, [])



    return (
        <div className={scss.wrap}>
            <div className={scss.lines_nums}>
                {
                    lines.map((line, i) => <div key={i} className={scss.line_num}>{i + 1}</div>)
                }
                <div className={scss.line_num}>{lines.length + 1}</div>
            </div>
            <textarea name="live-editor" id="live-editor" autoCapitalize="off" wrap="off" autoCorrect="off" spellCheck="false" ref={$tArea} 
                onInput={handleTextChange}
                value={textarea}
                rows={lines.length + 1}
            ></textarea>
        </div>
    )
}


