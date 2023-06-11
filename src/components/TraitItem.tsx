import { useEffect, useState } from "react";

type TraitItemProps = {
    trait: {name: string; icon: string; amount: number[]}
    amount: number
}

export function TraitItem({trait, amount}: TraitItemProps){
    const [color, setColor] = useState<string>("#2d3036")
    
    useEffect(() => {
        if (trait.amount.length === 1){
            setColor("gold")
        }
        else if (trait.amount.length === 4 || trait.amount.length === 5){
            amount >= trait.amount[3] ? setColor("white") : amount >= trait.amount[2] ? setColor("gold") : 
            amount >= trait.amount[1] ? setColor("silver") : amount >= trait.amount[0] ? setColor("brown") :  setColor("#2d3036")
        }
        else if (trait.amount.length === 3){
            amount >= trait.amount[2] ? setColor("gold") : 
            amount >= trait.amount[1] ? setColor("silver") : amount >= trait.amount[0] ? setColor("brown") :  setColor("#2d3036")
        }
        else if (trait.amount.length === 2){
            amount >= trait.amount[1] ? setColor("gold") : amount >= trait.amount[0] ? setColor("brown") :  setColor("#2d3036")
        }
        else {
            setColor("#2d3036")
        }
    }, [amount, trait])

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "30px", width: "30px", backgroundColor: color, borderRadius: "50%", 
            marginRight: "10px", marginBottom: "tpx", border: "2px solid black"}}>
            <div style={{width: "70%", aspectRatio: "1/1", backgroundImage: `url(${trait.icon})` , backgroundSize: "cover", backgroundRepeat: "no-repeat", 
            backgroundPosition: "center", filter: "brightness(0%)"}}/> 
            </div> 
            <div style={{color: "white", fontSize: "18px", marginRight: "10px"}}>{amount}</div>
            <div style={{flexDirection: "column"}}> 
                <div style={{color: "white"}}>{trait.name}</div>
                <div style={{color: "gray", fontSize: "12px", marginTop: "-4px"}}>{trait.amount.toString().replaceAll(","," ")} </div>
            </div> 
        </div>
    )    
}
