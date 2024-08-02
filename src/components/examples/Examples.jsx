import { Link } from "react-router-dom"
import scss from "./example.module.scss"
import Basic1SVG from "./thumbnails/basic-1.svg?react"
import Tree1SVG from "./thumbnails/tree-1.svg?react"
import Circle1SVG from "./thumbnails/circular-1.svg?react"
import Tests1SVG from "./thumbnails/tests-1.svg?react"


/**
 * # List of examples
 * 
 * Each example has an id, title, description, and thumbnail 
 * - id: unique identifier for the example (used in the URL query string and must match a file in the /public/examples folder)
 * - title: title of the example
 * - description: description of the example
 * - thumbnail: A JSX component that renders the thumbnail image for the example
 */
const EXAMPLES = [  // <-- EDIT THIS ARRAY TO CRUD THE EXAMPLES
    {
        id: "tests-1",
        title: "Tests",
        description: "Tests",
        thumbnail: <Tests1SVG />
    },
    {
        id: "basic-1",
        title: "Basic graph",
        description: "Basic example of a non-directed graph with default weights",
        thumbnail: <Basic1SVG />
    },
    {
        id: "tree-1",
        title: "Horizontal Tree graph",
        description: "Tree arrangement of nodes",
        thumbnail: <Tree1SVG />
    },
    {
        id: "circular-1",
        title: "circular-1",
        description: "Circular graph",
        thumbnail: <Circle1SVG />
    },
]


/**
 * Component that renders the examples page
 * 
 * This component renders the examples defined in the EXAMPLES array using the ExampleCard component (defined below)
 */
export default function Examples() {

    return (
        <div className={scss.wrap}>
            <div className={scss.content}>
                <h1>Examples</h1>

                <div className={scss.examples_wrap}>
                    {EXAMPLES.map((example, index) => {
                        return <ExampleCard key={index} id={example.id || "#"} title={example.title} description={example.description} thumbnail={example.thumbnail} />
                    })}
                </div>
            </div>
        </div>
    )
}

/**
 * Component that renders an example card
 * 
 * This component renders a card for an example with a thumbnail, title, and description. The card is a link that navigates to the example when clicked.
 * 
 * @param {Object} props - The props for the component
 * @param {string} props.id - The unique identifier for the example
 * @param {string} props.title - The title of the example
 * @param {string} props.description - The description of the example
 * @param {JSX.Element} props.thumbnail - The JSX element that renders the thumbnail image for the example
 */
function ExampleCard(props) {

    return (
        <Link to={`/?example=${props.id}`} className={scss.example}>
            <div className={scss.thumbnail}>
                {props.thumbnail}
            </div>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </Link>
    )
}
