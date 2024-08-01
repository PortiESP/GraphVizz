import scss from "./toolBar.module.scss"
import { useState, useEffect } from "react"

// Utils
import { setActivateTool } from "@components/graph-manager/utils/tools/tools_callbacks"
import constants from "@components/graph-manager/utils/constants"

// Icons
import AddNodeIcon from "@assets/add-node.svg?react"
import EdgeIcon from "@assets/edge.svg?react"
import CursorIcon from "@assets/cursor.svg?react"
import DeleteIcon from "@assets/bin.svg?react"

// Define the items that will be shown in the toolbar, tools or separators.
const tools = [
    {
        id: "select",  // id is used to identify the active tool (must match the tool name in the graph manager constants)
        className: scss.tool,  // Used to identify if the item is a tool, a separator, etc.
        title: "Edit & Select",  // Title is used when the mouse hovers over the tool
        icon: CursorIcon,  // Icons shown in the toolbar
        tooltip: "Select, move, delete, edit",  // Text shown in the tooltip when the user activates the tool
        shortcut: "S",  // Keyboard shortcut to activate the tool (this is esthetic, the actual shortcut is set in the graph manager)
        action: ()=> setActivateTool("select")  // Function to call when the tool is clicked
    },
    { className: scss.separator },
    {
        id: "edges",
        className: scss.tool,
        title: "Connect Edge",
        icon: EdgeIcon,
        tooltip: "Click on a node and drag to another node to connect them",
        shortcut: "E",
        action: ()=> setActivateTool("edges")
    },
    {
        id: "add-nodes",
        className: scss.tool,
        title: "Add Node",
        icon: AddNodeIcon,
        tooltip: "Click anywhere to add a node. Hold shift to snap to grid",
        shortcut: "N",
        action: ()=>setActivateTool("add-nodes")
    },
    {
        id: "delete",
        className: scss.tool,
        title: "Delete",
        icon: DeleteIcon,
        tooltip: "Click on an element to delete it",
        shortcut: "D",
        action: ()=> setActivateTool("delete")
    }

]


/**
 * ToolBarOverlay
 * 
 * This component is a toolbar that allows the user to select different tools to interact with the graph.
 */
export default function ToolBarOverlay(){

    const [activeTool, setActiveTool] = useState(constants.DEFAULT_TOOL)
    const [defaultToolTip, setDefaultToolTip] = useState("")
    const [toolTip, setToolTip] = useState("")

    // Initial setup
    useEffect(() => {
        // Set the listeners to update when the tool is changed from other part of the application
        window.graph.toolListeners.push(()=>setActiveTool(window.graph.tool))
        // Store the `setToolTip` function as a global variable. This is used to update the tooltip from other parts of the application when certain events happen.
        window.ui.set("setToolTip", setToolTip)
    }, [])

    // Update the tooltip when the active tool changes
    useEffect(() => {
        const tooltip = tools.find(tool => tool.id === activeTool).tooltip
        setToolTip(undefined)
        setDefaultToolTip(tooltip)
    }, [activeTool])

    return (
      <div className={scss.toolbar_wrap}>
        <div className={scss.container}>
        <span className={scss.tooltip} id="graph-tool-tip">{toolTip || defaultToolTip}</span>
          <div className={scss.toolbar}>
            {tools.map((tool, i) => {
                return (
                    <div key={i} className={[tool.className, activeTool === tool.id ? scss.active : ""].join(" ")} onClick={tool.action} title={tool.title}>
                        {tool.icon && <tool.icon />}
                        {tool.shortcut && <span className={scss.shortcut}>{tool.shortcut}</span>}
                    </div>
                )
            })}
          </div>
        </div>
      </div>
    )
  }