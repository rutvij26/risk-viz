import { observer } from "mobx-react-lite";

export default observer(function Footer() {
    return (
        <div className="flex justify-center items-center h-full text-white bg-black/60">
            <h1> Designed & Developed by {" "}
                <a href="https://rutvijsathe.dev" className="underline">Rutvij Sathe</a>
            </h1>
        </div>
    )
})