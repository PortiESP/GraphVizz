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
        setLines(e.target.value?.split("\n").map(line => line.trim()) || [])
        setTextarea(e.target.value)
    }

    const handleFocus = (e) => {
        e.preventDefault()
        e.stopPropagation()
        $tArea.current.focus()
    }

    useEffect(() => {
        const eList = generateEdgeList()
        setLines(eList)
        setTextarea(eList.join("\n"))
    }, [])

    useEffect(() => {
        const validEdges = []
        const invalidLines = []

        lines.forEach((line, i) => {
            if (line === "") return

            if (isValidEdge(line)) validEdges.push(line)
            else invalidLines.push(i)
        })

        console.log(validEdges)
        loadFromEdgePlainTextList(validEdges.join("\n"))
        circularArrange(window.graph.nodes)
        focusOnAllNodes()
    }, [lines])



    return (
        <div className={scss.wrap}>
            <div className={scss.lines_nums_extended}>
                {
                    lines.concat([null]).map((line, i) => <div key={i} className={scss.line_num}></div>)
                }
            </div>
            <div className={scss.lines_nums}>
                {
                    lines.map((line, i) => <div key={i} className={scss.line_num}>{i + 1}</div>)
                }
                <div className={scss.line_num}>{lines.length + 1}</div>
            </div>
            <textarea name="live-editor" id="live-editor" autoCapitalize="off" wrap="off" autoCorrect="off" spellCheck="false" ref={$tArea} 
                onChange={handleTextChange}
                onClick={handleFocus}
                value={textarea}
            ></textarea>
        </div>
    )
}


