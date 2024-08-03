import { Link } from "react-router-dom"
import scss from "./example.module.scss"
import Basic1SVG from "./thumbnails/basic-1.svg?react"
import Tree1SVG from "./thumbnails/tree-1.svg?react"
import Circle1SVG from "./thumbnails/circular-1.svg?react"
import Tests1SVG from "./thumbnails/tests-1.svg?react"
import Europe1SVG from "./thumbnails/europe-1.svg?react"
import Cayley1SVG from "./thumbnails/cayley-1.svg?react"
import Complete1SVG from "./thumbnails/complete-1.svg?react"
import Topo1SVG from "./thumbnails/topo-1.svg?react"


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
        title: "Circular graph",
        description: "All the nodes are arranged in a circle shape. This makes it easier to see the connections between the nodes", 
        thumbnail: <Circle1SVG />
    },
    {
        id: "europe-1",
        title: "Map of Europe by population",
        description: "Each node represents a country in Europe, the size of the node is proportional to the population of the country, and the distance between the capitals of the countries that share a land border. (the values are not accurate)",
        thumbnail: <Europe1SVG />
    },
    {
        id: "cayley-1",
        title: "Cayley graph",
        description: "Cayley graph",
        thumbnail: <Cayley1SVG />
    },
    {
        id: "complete-1",
        title: "Complete graph",
        description: "A complete graph is a graph in which each pair of graph vertices is connected by an edge",
        thumbnail: <Complete1SVG />
    },
    {
        id: "topo-1",
        title: "Topological graph",
        description: "A graph that represents that can be sorted in a topological order",
        thumbnail: <Topo1SVG />
    }
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
