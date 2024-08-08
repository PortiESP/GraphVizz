import scss from "./header.module.scss"

// Components & functions
import Nav from "./nav/Nav"


export default function Header() {
    return (
        <header className={scss.header_wrap}>
            <Nav />
        </header>
    )
}
