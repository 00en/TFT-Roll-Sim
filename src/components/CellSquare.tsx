type CellProps = {
    id : number
    champion : string
    star : number
    cost: number
    handleStartClick : any
    handleEndClick : any
    handleDragOver : any
}

export function CellSquare({id, champion, star, cost, handleStartClick, handleEndClick, handleDragOver}: CellProps){
    

return(
    <div id={id.toString()} style={{padding: ".5%", position: "relative", width: "90px", aspectRatio: "1"}} draggable={champion !== "" ? "true" : "false"} 
    onDragStart={handleStartClick} onDrop={handleEndClick} onDragOver={handleDragOver}>
    <div style={{height: "100%", width: "100%", background: "#212121", border: cost == 5 ? '4px solid gold' : cost == 4 ? "4px solid purple" : cost == 3 ? "4px solid blue" : cost == 2 ? "4px solid green" : 
    cost == 1 ? "4px solid gray" : ""}}> 
        <div style={{height: "100%", width: "100%", backgroundImage: `url(${champion})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition:"right"}}></div>
    </div>
    {star != 0 
        ?
        <div style={{position: "absolute", top: "0%", right: "31%", fontSize: "60px", fontWeight: "bold", color: "white", opacity: "80%", textShadow:"-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}}>{star}</div>
        : ""
        }
    </div>
)
}