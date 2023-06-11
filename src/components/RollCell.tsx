import { useEffect, useState } from "react"
import data from "../data/traits.json"

type RollProps = {
    champion : string
    cost: number
    name: string
    traits: string[]
    handleClick : any
    glow : boolean
    disabled: boolean
}

let colourMap = new Map<number, string>([
    [1, "linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(16,26,48,1) 34%, rgba(72,78,89,1) 100%)"],
    [2, "linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(9,121,28,1) 34%, rgba(51,196,59,1) 100%)"],
    [3, "linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(9,46,121,1) 34%, rgba(51,124,196,1) 100%)"],
    [4, "linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(91,9,121,1) 34%, rgba(171,51,196,1) 100%)"],
    [5, "linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(121,106,9,1) 34%, rgba(196,179,51,1) 100%)"],
]);

export function RollCell({name, champion, cost, traits, handleClick, glow, disabled}: RollProps){
    const [empty, setEmpty] = useState<boolean>(false)
    const [images, setImages] = useState<string[]>([...Array(0)])

    const setArray = () => {
        const array : string[] = []
        traits.forEach(trait => {
        const test = data.find((d) => d.name === trait)
        array.push(test!.icon)
        })
        setImages(array)
    }
    useEffect(()=> {
        setEmpty(false)
        setArray()
    },[name])
    return(
        <div id={name} key={name} style={{padding: "0.2%", position: "relative", width: "200px", height: "150px", pointerEvents: empty ? "none" : "auto", filter: !disabled ? "grayscale(100%)" : ""}} 
        onClick={(e) => handleClick(e, cost) ? setEmpty(true) : undefined}>
        {!empty ? 
        <div style={{height: "100%", width: "100%", background: colourMap.get(cost), boxShadow: glow ? "0 0 60px 10px #fff" : "",
        border: "2px solid black", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center"}}> 
        <div style={{marginTop: "1%",height: "80%", width: "98%", border: "2px solid black",
        backgroundImage: `url(${champion.replace('2','')})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition:"center"}}>
            <div style={{color: "white", display: "flex", justifyContent: "flex-end", flexDirection: "column", height: "95%"}}>
            {[...traits].map((trait,i ) =>
                <div key={i} style={{display: "flex", marginLeft: "6px", marginTop: "5px", alignItems: "center"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "20px", width: "20px", backgroundColor: "#2d3036", borderRadius: "50%"}}>
                    <div style={{width: "85%", height: "85%", backgroundImage: `url(${images[i]})` , backgroundSize: "contain", backgroundRepeat: "no-repeat", 
                    backgroundPosition: "center"}}/> 
                </div> 
                <div style={{fontSize: "12px", marginLeft: "4px"}}>{trait}</div>
                </div>
            )}
            </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", width: "90%"}}> 
        <span style={{fontSize: "16px", color: "white", fontWeight: ""}}>{name}</span>
       
        <span style={{fontSize: "16px", fontWeight: "bold", color: "white"}}>
        <svg style={{marginTop: "-4px"}}fill="#FFFFFF" width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15,22a6,6,0,1,1,6-6A6,6,0,0,1,15,22ZM8.5,8.857c3.038,0,5.5-1.535,5.5-3.428S11.538,2,8.5,2,3,3.535,3,5.429,5.462,8.857,8.5,8.857ZM7.673,12.8a8.018,8.018,0,0,1,1.368-2.119c-.18.011-.356.033-.541.033C5.462,10.714,3,9.179,3,7.286V9.428C3,11.145,5.032,12.549,7.673,12.8Zm-.534,4.656A8.03,8.03,0,0,1,7,16c0-.24.015-.477.036-.712C4.712,14.889,3,13.576,3,12v2.143C3,15.742,4.762,17.077,7.139,17.456ZM8.5,22a8.83,8.83,0,0,0,1.079-.067,5.451,5.451,0,0,1-.673-.762,8.064,8.064,0,0,1-.929-1.345C5.188,19.66,3,18.211,3,16.429v2.142C3,20.465,5.462,22,8.5,22Z"/></svg>
        {cost}</span>
        </div>
        </div>
        : undefined}
        </div>
    )
    }