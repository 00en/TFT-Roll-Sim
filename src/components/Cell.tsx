/* eslint-disable */
// @ts-ignore
import Hexagon from 'react-svg-hexagon';
/* eslint-enable */

type CellProps = {
    id : number
    champion : string
    star : number
    cost: number
    handleStartClick : any
    handleEndClick : any
    handleDragOver : any
}

export function Cell({id, champion, star, cost, handleStartClick, handleEndClick, handleDragOver}: CellProps){
    

return(
    <div id={id.toString()} style={{padding: ".5%", position: "relative", width: "90px", aspectRatio: "1"}} 
    draggable={champion !== "" ? "true" : "false"}  onDragStart={handleStartClick} onDrop={handleEndClick} onDragOver={handleDragOver}>
    <Hexagon fill={"#424242"} radius={2} strokeWidth={5} stroke={cost == 5 ? 'gold' : cost == 4 ? "purple" : cost == 3 ? "blue" : cost == 2 ? "green" : cost == 1 ? "gray" : ""} height={90}>
    <div id={id.toString()} style={{height: "100%", width: "100%", backgroundImage: `url(${champion})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition:"right"}}>
    {star != 0 
        ?
        <h1 style={{display: "flex", justifyContent: "center", marginTop: "5px", fontSize: "60px", fontWeight: "bold", color: "white", opacity: "80%", textShadow:"-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}}>{star}</h1>
        : ""
        }
    </div>
    </Hexagon>
    </div>
)
}