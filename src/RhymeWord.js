function RhymeWord(props) {
    return(<div>{props.sylVal ? <h2>{props.sylVal}</h2> : ""}
            <li key={props.keyVal}>{props.description} <button onClick={props.onClickSaveWords}>(save)</button></li>
            </div>) 
}

export default RhymeWord;