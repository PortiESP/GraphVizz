import scss from "./exportGraph.module.scss"
import { useLayoutEffect, useRef } from "react"

// Components & functions
import { generateSVG } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import Tabs from "../components/tabs/Tabs"


/**
 * Export graph scene
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the modal
 * 
 * @returns {JSX.Element} 
 */
export default function Export_graph(props) {

    return (
        <div className={scss.wrap}>
            <h3>Export graph</h3>
            <p className={scss.tip}>Choose an option from below to export the graph</p>
            <hr />
            <Tabs tabs={[() => AsSVG, () => AsPNG]} titles={["As SVG", "As PNG"]} closeModal={props.close} />
        </div>
    )
}


/**
 * Displays the tab option "As SVG" in the export graph modal
 */
function AsSVG() {

    const $svg = useRef(null)  // Ref to the SVG element used show a preview of the exported SVG

    // Generate the SVG based on the graph data and display it in the SVG element
    useLayoutEffect(() => {
        // Generate the SVG and set it as the inner HTML of the SVG element
        $svg.current.innerHTML = generateSVG()
    }, [])

    // Download the SVG to the user's device
    const handleExportAsSVG = () => {
        const DOWNLOAD_NAME = "graph.svg"  // The name of the downloaded file

        const svg = $svg.current.firstChild  // Get the SVG element
        const svgData = new XMLSerializer().serializeToString(svg)  // Serialize the SVG element to a string
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })  // Create a blob from the SVG string
        const url = URL.createObjectURL(blob)  // Create a URL from the blob

        // Create a link element and click it (automatically) to download the SVG file, then revoke the URL
        const a = document.createElement("a")
        a.href = url  // Set the URL of the link
        a.download = DOWNLOAD_NAME  // Set the name of the downloaded file
        a.click() // Click the link to download the file automatically
        URL.revokeObjectURL(url) // Revoke the URL
    }

    return (<div className={scss.tab_wrap}>
        <h4>Preview</h4>
        <div className={[scss.export_result, scss.export_svg].join(" ")} ref={$svg}>
        </div>
        <button onClick={() => handleExportAsSVG()}>Download SVG</button>
    </div>)
}


/**
 * Displays the tab option "As PNG" in the export graph modal
 */
function AsPNG() {

    // Generate the PNG image based on the canvas and display it in the image element
    useLayoutEffect(() => {
        // Take a snapshot of the canvas and set it as the image source
        const canvas = window.cvs.$canvas
        const img = document.getElementById("export-img")
        img.src = canvas.toDataURL("image/png")
    }, [])

    // Download the PNG image to the user's device
    const handleExportAsPNG = () => {
        const DOWNLOAD_NAME = "graph.png"  // The name of the downloaded file

        const canvas = window.cvs.$canvas  // Get the canvas element
        const dataURL = canvas.toDataURL("image/png")  // Get the data URL of the canvas
        const a = document.createElement("a")  // Create a link element
        a.href = dataURL  // Set the data URL as the link's URL
        a.download = DOWNLOAD_NAME  // Set the name of the downloaded file
        a.click()  // Click the link to download the file automatically
    }

    return (
        <div className={scss.tab_wrap}>
            <h4>Preview</h4>
            <div className={[scss.export_result, scss.export_png].join(" ")}>
                <img id="export-img" />
            </div>
            <p className={scss.tip}>The resulting image will contain an <strong>exact copy</strong> of the canvas as it is displayed on the screen: <em>the colors, the labels, the position, the grid, etc.</em></p>
            <button onClick={() => handleExportAsPNG()}>Download PNG</button>
        </div>
    )
}