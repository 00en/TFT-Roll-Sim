import { Button, ButtonGroup, Card } from "react-bootstrap";
import { ChampionList } from "./ChampionList";
import { useEffect, useState } from "react";

type BoardSetupProps = {
    handleClick : any
    handleSettingsChange: any
    clearBoard: any
    handleRestart: any
    savedGold: number
    savedThinkFast: boolean
    savedLevel: number
}

export function BoardSetup({handleClick, handleSettingsChange, clearBoard, handleRestart, savedGold, savedLevel, savedThinkFast}:BoardSetupProps){
    const [gold, setGold] = useState<number>(savedGold)
    const [level, setLevel] = useState<number>(savedLevel)
    const [thinkFast, setThinkFast] = useState<boolean>(savedThinkFast)

    useEffect(()=> {
    },[savedGold, savedLevel, savedThinkFast])

    const handleSave = () => {
        handleSettingsChange(gold, level, thinkFast);
    }

    const handleGoldChange = (event: any) => {
        const result = event.target.value.replace(/\D/g, '');
        result.length > 4 ? setGold(Math.floor(result / 10)) : result.length = setGold(result) 
    }

    return(
        <Card text="white" style={{background: "#00a087", marginTop: "30px", width: "500px", color: "white", textAlign: "center", display: "block", zIndex: "5"}}>
            <Card.Body className="d-flex row">  
            <div style={{width: "33%", alignItems: "center"}}>
                <h5>Set Level</h5>
                <ButtonGroup style={{width: "100%"}}>
                    <Button variant="dark" style={{width: "33%"}} disabled={level <= 3} onClick={() => setLevel(level-1)}>-</Button>
                    <div style={{display: "flex", background: "#3c4047", color: "white", alignItems: "center", justifyContent: "center", width: "34%", height: "38px"}}>{level} </div>
                    <Button variant="dark" style={{width: "33%"}} disabled={level >= 10} onClick={() => setLevel(level+1)}>+</Button>
                </ButtonGroup>
            </div>

            <div style={{width: "33%"}}>
                <h5>Set Gold</h5>
                <input style={{background: "#3c4047", color: "white", textAlign: "center",border: "none", boxShadow: "none", width: "100%", borderRadius: "5px", height: "38px"}} type="text" value={gold} onChange={handleGoldChange}/>
            </div>

            <div style={{width: "33%"}}>
                <h5>Think Fast</h5>
                <ButtonGroup style={{width: "100%"}}>
                    <Button variant="dark" style={{width: "33%"}} disabled={thinkFast} onClick={() => setThinkFast(true)}>On</Button>
                    <Button variant="dark" style={{width: "33%"}} disabled={!thinkFast} onClick={() => setThinkFast(false)}>Off</Button>
                </ButtonGroup>
            </div>

            <div style={{width: "33%", marginTop: "10px"}}>
            <Button variant="dark" style={{width: "100%"}} onClick={() => handleSave()}>Save Settings</Button> 
            </div>

            <div style={{width: "33%", marginTop: "10px"}}>
            <Button variant="dark" style={{width: "100%"}} onClick={() => clearBoard()}>Clear Board</Button> 
            </div>

            <div style={{width: "33%", marginTop: "10px"}}>
            <Button variant="dark" style={{width: "100%"}} onClick={() => handleRestart()}>Restart</Button> 
            </div>

            <div style={{marginTop: "10px"}}> 
            <h4>Add Units</h4>
            
            <ChampionList handleClick={handleClick}></ChampionList>
            
            </div>
            </Card.Body>
        </Card>
    )
}