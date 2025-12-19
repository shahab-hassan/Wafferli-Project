function Loader({type}) {
    return (
        <div className={type==="checkmate"? "loadingCheckmate": type === "simple"? "loadingSimple" : type==="simpleMini"? "loadingSimpleMini" : type==="simpleMax"? "loadingSimpleMax" : type==="miniPlus"? "loadingMiniPlus" : "loadingMini"}>
            <div className="loadingSpinner">
                <div className="spinner"></div>
            </div>
        </div>
    )
}

export default Loader