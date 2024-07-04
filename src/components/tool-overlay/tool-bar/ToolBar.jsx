import scss from "./toolOverlay.module.scss"
import AddNodeIcon from "../../../assets/add-node.svg?react"
import EdgeIcon from "../../../assets/edge.svg?react"
import CursorIcon from "../../../assets/cursor.svg?react"
import DeleteIcon from "../../../assets/bin.svg?react"
import { useState } from "react"
import { useEffect } from "react"
import { setActivateTool } from "../../graph-manager/utils/tools/tools_callbacks"
import constants from "../../graph-manager/utils/constants"

const tools = [
    {
        id: "select",
        className: scss.tool,
        title: "Edit & Select",
        icon: CursorIcon,
        tooltip: "Select, move, delete, edit",
        action: ()=> setActivateTool("select")
    },
    { className: scss.separator },
    {
        id: "edges",
        className: scss.tool,
        title: "Connect Edge",
        icon: EdgeIcon,
        tooltip: "Click on a node and drag to another node to connect them",
        action: ()=> setActivateTool("edges")
    },
    {
        id: "add-node",
        className: scss.tool,
        title: "Add Node",
        icon: AddNodeIcon,
        tooltip: "Click anywhere to add a node",
        action: ()=>{}
    },
    {
        id: "delete",
        className: scss.tool,
        title: "Delete",
        icon: DeleteIcon,
        tooltip: "Click on an element to delete it",
        action: ()=> setActivateTool("delete")
    }

]

export default function ToolBarOverlay(){

    const [activeTool, setActiveTool] = useState(constants.DEFAULT_TOOL)
    const [toolTip, setToolTip] = useState("")

    useEffect(() => {
        window.graph.toolListeners.push(()=>setActiveTool(window.graph.tool))
    }, [])

    useEffect(() => {
        const tooltip = tools.find(tool => tool.id === activeTool).tooltip
        setToolTip(tooltip)
    }, [activeTool])

    return (
      <div className={scss.toolbar_wrap}>
        <div className={scss.container}>
        <span className={scss.tooltip}>{toolTip}</span>
          <div className={scss.toolbar}>
            {tools.map((tool, i) => {
                return (
                    <div key={i} className={[tool.className, activeTool === tool.id ? scss.active : ""].join(" ")} onClick={tool.action} title={tool.title}>
                        {tool.icon && <tool.icon />}
                    </div>
                )
            })}
          </div>
        </div>
      </div>
    )
  }