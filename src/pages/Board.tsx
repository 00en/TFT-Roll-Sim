import { Cell } from "../components/Cell"
import { Traits } from "../components/Traits"
import { CellSquare } from "../components/CellSquare"
import { Button, Card, Container,  Row } from "react-bootstrap";
import data from "../data/champions.json"
import { useEffect, useState } from "react";
import { BoardSetup } from "../components/BoardSetup";
import { Roll } from "../components/Roll";

const poolMap = new Map<string, number>()

data.forEach((d) => {
    poolMap.set(d.icon, d.pool);
})

export function Board(){
    const [currentUnits, setCurrentUnits] = useState<{index: number; champion: string; cost: number, star: number}[]>([...Array(37)].fill({index: 0, champion: "", cost: 0, star: 0}));
    const [savedUnits, setSavedUnits] = useState<{index: number; champion: string; cost: number, star: number}[]>([...Array(37)].fill({index: 0, champion: "", cost: 0, star: 0}));

    const [startUnit, setStartUnit] = useState<number>(-1)
    const [gold, setGold] = useState<number>(50)
    const [savedGold, setSavedGold] = useState<number>(50)
    const [savedLevel, setSavedLevel] = useState<number>(6)
    const [savedThinkFast, setSavedThinkFast] = useState<boolean>(false)

    const [onBoard, setOnBoard] = useState<number>(0)
    const [upgradeUnits, setUpdgradeUnits] = useState<{champion: string; count: number}[]>([...Array(0)].fill({index: [0], champion: "", count: 0}));
    const [hideSetup, setHideSetup] = useState<boolean>(false)
   

    //for inital board state (adds champ that is clicked)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>, cost: number) =>{
        const id = e.currentTarget.id
        const tempBoard = [...currentUnits]
        //const champion = data.find(element => element.name === id)
        const index = data.findIndex(e => e.name === id)
        const upgradeResult = upgradeUnits.find((element)  => element.champion === data[index].icon)

        //searching if space is on bench (and finds earliest spot to place champion)
        const result = tempBoard.findIndex((element, i)  => element.champion === "" && i > 27)

        if(gold - cost < 0)
            return false

        if (upgradeResult !== undefined){ //if upgrade is possible for unit select 
            setGold(gold-cost)
            const indexTwo: number[] = []; // finding each occurance of selected adding each index so we can find lowest index to upgrade units
            const indexThree: number[] = [];
            tempBoard.forEach((element) => { if (element.champion === data[index].icon){
                    element.star === 1 ? indexTwo.push(element.index) : element.star === 2 ? indexThree.push(element.index): undefined}
            })
            if(upgradeResult.count % 9 === 8) {
                indexThree.concat(indexTwo).forEach((element) => {tempBoard[element] = {index: 0, champion: "", cost: 0, star: 0} })
                 tempBoard[Math.min(...indexThree)] = {index: Math.min(...indexThree), champion: data[index].icon, cost: data[index].cost, star: 3}
                 setCurrentUnits(tempBoard) 
                 poolMap.set(data[index].icon, 0);
            }
            else if (upgradeResult.count % 3 === 2) { // upgrade to 2 star
               indexTwo.forEach((element) => { tempBoard[element] = {index: 0, champion: "", cost: 0, star: 0} })
                tempBoard[Math.min(...indexTwo)] = {index: Math.min(...indexTwo), champion: data[index].icon, cost: data[index].cost, star: 2}
                setCurrentUnits(tempBoard) 
                poolMap.set(data[index].icon, (poolMap.get(data[index].icon)!-1));
            }
            return true
        }
        else if (result != -1){ //for normal non upgrade purchase (needs board space)
            tempBoard[result] = {index: result, champion: data[index].icon, cost: data[index].cost, star: 1}
            setGold(gold-cost)
            setCurrentUnits(tempBoard) 
            poolMap.set(data[index].icon, (poolMap.get(data[index].icon)!-1));
            return true
        }    
        return false
    }

    useEffect(()=> {
        dupeCheck()
        boardCheck()
    },[currentUnits])

    const boardCheck = () => {
        const state = [...currentUnits].filter((element) => element.champion !== "" && element.index < 28)
        setOnBoard(state.length)
    }

    const dupeCheck = () => {
        const state = [...currentUnits].filter((element) => element.champion !== "")
        const map = new Map();

        state.forEach(element => {
            if (!map.has(element.champion)){
                map.set(element.champion, {count: element.star === 1? 1 : element.star  === 2? 3: element.star  === 3? 9 : 1})
            }else {
                const temp = map.get(element.champion)
                map.set(element.champion, {count: temp.count + (element.star === 1? 1 : element.star  === 2? 3: element.star  === 3? 9 : 1)})// need to figure out how to make index have multiple values 
            }
        })
        const tempUpgrades = [...Array(0)].fill({champion: "", count: 0})
        for (let key of map.keys()) {
            const values = map.get(key)
            if (values.count % 3 === 2)
            tempUpgrades.push({champion: key, count: values.count})
        }
        setUpdgradeUnits(tempUpgrades)
    }

    //for initial unit that you want to move
    const handleStartClick = (e : React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const id = e.currentTarget.id
        setStartUnit(parseInt(id));
    }

    //for end movement
    const handleEndClick = (e : React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const id = e.currentTarget.id
        performSwap(startUnit, parseInt(id))
    }

    const handleDragOver = (e :  React.DragEvent<HTMLDivElement>) =>
    {
        e.stopPropagation();
        e.preventDefault();
    }

    const performSwap = (from : number, to: number) => {
        if (currentUnits[from].champion === ""){
            return
        }
        if (to === 41){
            const tempBoard = [...currentUnits]
          //  selling units + getting gold for selling units
            const index = data.findIndex(e => e.icon === currentUnits[from].champion)
            setGold(gold + (currentUnits[from].cost * (currentUnits[from].star === 1 ? 1 : currentUnits[from].star === 2 ? 3: 9)
            - (currentUnits[from].cost !== 1 && currentUnits[from].star !== 1 ? 1 : 0) ))
            tempBoard[from] = {index: 0, champion: "", cost: 0, star: 0}
            poolMap.set(data[index].icon, (poolMap.get(data[index].icon)!+ (currentUnits[from].star === 1 ? 1 : currentUnits[from].star === 2 ? 3: data[index].pool)))
  
            setCurrentUnits(tempBoard)
            return
        } 
        if (currentUnits[to].champion === "" && onBoard >= savedLevel && to < 28 && from > 27){
            return
        }
        
        const tempBoard = [...currentUnits]
        tempBoard[to] = {index: to, champion: currentUnits[from].champion, cost: currentUnits[from].cost, star:currentUnits[from].star} 
        tempBoard[from] = {index: from, champion: currentUnits[to].champion, cost: currentUnits[to].cost, star:currentUnits[to].star}   
        setCurrentUnits(tempBoard)
        
        setStartUnit(-1)  
    }
    const handleSettingsChange = (g: number, l: number, t: boolean) => {
        setSavedGold(g);
        setGold(g);
        setSavedLevel(l);
        setSavedThinkFast(t);
        setSavedUnits(currentUnits);
        data.forEach((d) => {
            poolMap.set(d.icon, d.pool);
        })
        currentUnits.forEach((u) => {
            if (u.champion !== ""){
                if (u.star === 3){
                    poolMap.set(u.champion, 0)
                }else if (u.star === 2)  {
                    poolMap.set(u.champion, (poolMap.get(u.champion)!-3));
                }else{
                    poolMap.set(u.champion, (poolMap.get(u.champion)!-1));
                }
            }
        })
    }

    const handleClearBoard = () => {
        setCurrentUnits([...Array(37)].fill({index: 0, champion: "", cost: 0, star: 0}))
        setSavedUnits([...Array(37)].fill({index: 0, champion: "", cost: 0, star: 0}))
        data.forEach((d) => {
            poolMap.set(d.icon, d.pool);
        })
    }

    const handleRestart = () => {
        setGold(savedGold)
        setCurrentUnits(savedUnits);
        data.forEach((d) => {
            poolMap.set(d.icon, d.pool);
        })
        savedUnits.forEach((u) => {
            if (u.champion !== ""){
                if (u.star === 3){
                    poolMap.set(u.champion, 0)
                }else if (u.star === 2)  {
                    poolMap.set(u.champion, (poolMap.get(u.champion)!-3));
                }else{
                    poolMap.set(u.champion, (poolMap.get(u.champion)!-1));
                }
            }
        })
    }

    const handleGold = () =>{
        if (!savedThinkFast && gold >=2){
            setGold(gold - 2)
        }
    }

    return (
        <>
        <div style={{width: "100%", position: "fixed", top: "0", left: "0", backgroundColor: "#00a087", height: "70px", zIndex: "999"}}>
            <Container style={{height: "70px", display: "flex", justifyContent: "right", alignItems: "center"}}> 
                <Button variant="dark" style={{display: "flex", marginRight: "10px", alignItems: "center",
                justifyContent: "center", height: "40px", aspectRatio: "1/1", borderRadius: "50%"}} onClick={() => handleRestart()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                </Button>

                <Button variant="dark" style={{display: "flex", marginRight: "40px", alignItems: "center",
                justifyContent: "center", height: "40px", aspectRatio: "1/1", borderRadius: "50%"}} onClick={() => setHideSetup(!hideSetup)}>
                { !hideSetup ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
                }
                </Button>
            </Container>
        </div>
        <Container style={{maxWidth: "unset"}}>
            <Card style={{position: "relative", margin: "auto", width: "1210px", color: "white", background: "#0c1416",
             marginTop: "80px", height: "650px"}}>
            <div style={{position: "absolute", top: "4px", left: "4px", maxHeight: "610px", overflowY: "hidden"}}>
                <Traits board={currentUnits}></Traits>
            </div>
            <h2 style={{textAlign: "center", marginTop: "10px", marginBottom: "10px"}}>{onBoard}/{savedLevel}</h2>
            <div style={{width: "1000px", position: "relative", margin: "auto"}}>
            {[0,1,2,3].map((e) =>
                <Row key={e} className="justify-content-center" style={{marginLeft: e%2 == 1 ? "45px" : "-45px", marginTop: "-20px"}}>
                    {[0,1,2,3,4,5,6].map((k) => 
                    <Cell id={(e*7+k)} key={(e*7+k)} champion={currentUnits[e*7+k].champion} cost={currentUnits[e*7+k].cost} star={currentUnits[e*7+k].star}
                        handleStartClick={handleStartClick} handleEndClick={handleEndClick} handleDragOver={handleDragOver}
                    ></Cell>
                    )}
                </Row>
            )}
            </div>
            <Row className="justify-content-center" style={{width: "1000px", position: "relative", margin: "auto", marginTop: "-10px"}}> 
                {[0,1,2,3,4,5,6,7,8].map((e) => 
                <CellSquare id={(28+e)} key={(28+e)} champion={currentUnits[28+e].champion} cost={currentUnits[28+e].cost} star={currentUnits[28+e].star}
                    handleStartClick={handleStartClick} handleEndClick={handleEndClick} handleDragOver={handleDragOver}
                ></CellSquare>
                )}
            </Row>
            <Row className="justify-content-center" style={{width: "1000px", position: "relative", margin: "auto"}}>
                <div id={"41"} key={"41"} style={{marginTop: "-20px", display: "flex", background: "#424242", width: "800px", aspectRatio: "8/1", borderRadius: "15px", alignItems: "center", justifyContent: "center"}} 
                onDragOver={handleDragOver} onDrop={handleEndClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                    </svg>
                </div>
            </Row>
            </Card>
            { hideSetup ?
            <div style={{position: "absolute", top: "50px", right: "20px"}}>
            <BoardSetup handleClick={handleClick} clearBoard={handleClearBoard} handleRestart={handleRestart} savedGold={savedGold}
                handleSettingsChange={handleSettingsChange} savedThinkFast={savedThinkFast} savedLevel={savedLevel}></BoardSetup>
            </div> : undefined
            }
            { !hideSetup ?       
          <Roll gold={gold} handleClick={handleClick} thinkFast={savedThinkFast} board={currentUnits} pool={poolMap}
            level={savedLevel} handleGold={handleGold} upgradeUnits={upgradeUnits}></Roll>
        : undefined}
        </Container>
        </>
    )
}