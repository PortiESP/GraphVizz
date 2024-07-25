import scss from "../header.module.scss"


export default function AlertView({setView}) {
    
    const resetView = () => {
        window.graph.nodes.forEach(node => node.hidden = false)
        window.graph.nodes.forEach(node => node.bubble = null)
        window.graph.edges.forEach(edge => edge.hidden = false)
        setView(false)
    }

    return <div className={[scss.menu_options_view_msg, scss.alert].join(" ")}>
        <span><strong>Warning: </strong> some elements may be hidden/shown in the current view</span>
        <button onClick={resetView}>Close view</button>
    </div>
}