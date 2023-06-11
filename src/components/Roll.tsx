import { Button, Row } from "react-bootstrap"
import data from "../data/champions.json"
import { useEffect, useState } from "react"
import { RollCell } from "./RollCell"

type RollProps = {
    gold : number
    level : number
    upgradeUnits : {champion: string, count: number}[]
    handleGold: any
    handleClick : any
    thinkFast: boolean
    board: {index: number; champion: string; cost: number, star: number}[]
    pool : any
}

let oddsMap = new Map<number, number[]>([
    [3, [75,25,0,0,0]],
    [4, [55,30,15,0,0]],
    [5, [45,33,20,2,0]],
    [6, [25,40,30,5,0]],
    [7, [19,30,35,15,1]],
    [8, [16,20,35,25,4]],
    [9, [9,15,30,30,16]],
    [10, [5,10,20,40,25]],
]);

let colourMap = new Map<number, string>([
    [1, "lightgray"],
    [2, "green"],
    [3, "rgba(51,124,196,1)"],
    [4, "purple"],
    [5, "gold"],
]);


export function Roll({gold, upgradeUnits, level, handleGold, handleClick, thinkFast, board, pool}: RollProps){
    const [array, setArray] = useState(oddsMap.get(level))
    const [roll, setRoll] = useState<{name: string, champion: string, cost: number, traits: string[]}[]>([...Array(0)])


    useEffect(()=> {
        setArray(oddsMap.get(level))
    },[level, upgradeUnits])

    useEffect(()=> {
        handleRoll()
    },[thinkFast, level])

    useEffect(() => {
        document.addEventListener('keydown', keyDownEvent)
        return () => document.removeEventListener('keydown', keyDownEvent)
    }, [roll, board])


    const keyDownEvent = (event: any) => {
        if (event.key === "d" && (thinkFast || (!thinkFast && gold >= 2)))
        {
            handleRoll();
            handleGold();
        }
    }
    
    const handleRoll = () => {
        const odds = oddsMap.get(level)!
        const temp: {name: string, champion: string, cost: number, traits: string[]}[] = [...Array(0)]

        for(let j = 0; j < 5 ; j++){
        const rand = 1 + Math.random() * (100 - 1);
        var unit = 0; 
        var total: number = 0.0
        for (let i = 0; i < odds.length ; i++){
            total = total + odds[i]
            if (total <= rand)
            {
                unit = (i + 1)
            }
        }
        const champs = data.filter((d: { cost: number }) => d.cost === (unit + 1))
        const arrayOdds : string[] = []

        champs.forEach(element => {
            let i = 0;
            for (i = 0; i< pool.get(element.icon); i++){
                arrayOdds.push(element.name)
            }
        });

        const champRand = Math.trunc(1 + Math.random() * (arrayOdds.length - 1));
        const finalChamp = data.find((d: { name: string }) => d.name === arrayOdds[champRand])

        if (finalChamp !== undefined){
            temp[j] = {name: finalChamp!.name, champion: finalChamp!.icon, cost: finalChamp!.cost, traits: finalChamp!.traits}
        }  else {
            temp[j] = {name: "", champion: "", cost: 0, traits: []}
        }
       
        }

        setRoll(temp)
    }

    return( 
        <>
        <div style={{margin: "auto", display: "flex", flexDirection: "row", width: "1210px"}}>
            <div style={{display: "flex", justifyContent: "left", alignItems: "center", width: "400px"}}> 
            {[...array!].map((e,i) => <div key={i} style={{width: "70px", display: "flex", justifyContent: "left", alignItems: "center"}}> <div style={{height: "20px", width: "20px", borderRadius: "50%", background: colourMap.get(i+1)}} ></div> 
            <span style={{marginLeft: "4px", fontWeight: "bold", color: colourMap.get(i+1)}}>{e}%</span></div>)}
            </div>
            
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "400px"}}>
            <svg fill="#FFFFFF" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15,22a6,6,0,1,1,6-6A6,6,0,0,1,15,22ZM8.5,8.857c3.038,0,5.5-1.535,5.5-3.428S11.538,2,8.5,2,3,3.535,3,5.429,5.462,8.857,8.5,8.857ZM7.673,12.8a8.018,8.018,0,0,1,1.368-2.119c-.18.011-.356.033-.541.033C5.462,10.714,3,9.179,3,7.286V9.428C3,11.145,5.032,12.549,7.673,12.8Zm-.534,4.656A8.03,8.03,0,0,1,7,16c0-.24.015-.477.036-.712C4.712,14.889,3,13.576,3,12v2.143C3,15.742,4.762,17.077,7.139,17.456ZM8.5,22a8.83,8.83,0,0,0,1.079-.067,5.451,5.451,0,0,1-.673-.762,8.064,8.064,0,0,1-.929-1.345C5.188,19.66,3,18.211,3,16.429v2.142C3,20.465,5.462,22,8.5,22Z"/></svg>
            <h2 style={{ color: "white", marginLeft: "5px", marginTop: "4px"}}>{gold.toString().length !== 0  ? gold : 0}</h2>
            </div>
        </div> 

        <Row className="justify-content-center" style={{position: "relative", margin: "auto", width: "1210px", display: "flex", alignItems: "center", justifyContent: "center", 
        background: "#0c1416", border: "2px solid black", height: "162px"}}> 
            <div style={{padding: "0.2%", position: "relative", width: "200px", height: "150px"}}> 
            <Button variant="dark" disabled={(!thinkFast && gold < 2)} onClick={() => { handleRoll(); handleGold()}} style={{display: "flex", width: "100%", border: "2px solid black",
             height: "100%", fontSize: "32px", borderRadius: "0%"}}>
            <div style={{display: "flex", flexDirection: "column", textAlign: "left", height: "100%", width: "100%"}}> 
            <span style={{marginRight: "4px", fontSize: "36px"}}>Refresh</span>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                <span>
                <svg fill="#FFFFFF" width="26px" height="26px" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M15,22a6,6,0,1,1,6-6A6,6,0,0,1,15,22ZM8.5,8.857c3.038,0,5.5-1.535,5.5-3.428S11.538,2,8.5,2,3,3.535,3,5.429,5.462,8.857,8.5,8.857ZM7.673,12.8a8.018,8.018,0,0,1,1.368-2.119c-.18.011-.356.033-.541.033C5.462,10.714,3,9.179,3,7.286V9.428C3,11.145,5.032,12.549,7.673,12.8Zm-.534,4.656A8.03,8.03,0,0,1,7,16c0-.24.015-.477.036-.712C4.712,14.889,3,13.576,3,12v2.143C3,15.742,4.762,17.077,7.139,17.456ZM8.5,22a8.83,8.83,0,0,0,1.079-.067,5.451,5.451,0,0,1-.673-.762,8.064,8.064,0,0,1-.929-1.345C5.188,19.66,3,18.211,3,16.429v2.142C3,20.465,5.462,22,8.5,22Z"/></svg>
                {thinkFast ? 0 : 2}
                </span>
                <svg style={{justifySelf: "right" }} xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg> 
            </div>
            </div>
            </Button> 
            </div>
            {roll.map((data, i) => 
            <RollCell key={i} name={data.name} champion={data.champion} cost={data.cost} traits={data.traits} glow={upgradeUnits.some(d => d.champion === data.champion)}
            handleClick={handleClick} disabled={data.cost <= gold}></RollCell>
            )
            }
            </Row>
        </>
    )


}