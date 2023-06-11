type ChampionListCellProps = {
    champion : string
    cost: number
    name: string
    handleClick : any
}


export function ChampionListCell({name, champion, cost, handleClick}: ChampionListCellProps){
    

return(
    <div id={name} key={name} style={{padding: "0.5%", position: "relative", width: "70px", aspectRatio: "1/1"}} 
    onClick={(e) => handleClick(e,0)}>
    <div style={{height: "100%", width: "100%", border: cost == 5 ? '4px solid gold' : cost == 4 ? "4px solid purple" : cost == 3 ? "4px solid blue" : cost == 2 ? "4px solid green" : 
    cost == 1 ? "4px solid gray" : "4px solid black", cursor: "pointer"}}> 
        <div style={{height: "100%", width: "100%", backgroundImage: `url(${champion})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition:"right"}}></div>
    </div>
        <div style={{textAlign: "center", fontSize: "10px", color: "white"}}>{name}</div>
    </div>
)
}