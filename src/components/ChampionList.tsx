import { Row } from "react-bootstrap"
import data from "../data/champions.json"
import { ChampionListCell } from "./ChampionListCell"
import { useState } from "react"

type ChampionListProps = {
    handleClick : any
}


export function ChampionList({handleClick}: ChampionListProps){
    const [searchedData, setSearchedData] = useState({data: data, search: ""});


    const handleChange = (e : any) => {
        const results = data.filter(d => {
            if (e.target.value === "") 
                return data

            return d.traits.some(v => v.toLowerCase().includes(e.target.value.toLowerCase())) || d.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setSearchedData({data: results, search: e.target.value})
    }
    
    return (
        <div>
            
            <input style={{background: "#3c4047", color: "white", textAlign: "center", border: "none", boxShadow: "none", width: "90%", borderRadius: "5px", height: "38px", 
            marginBottom: "4px"}} 
            onChange={handleChange} value={searchedData.search} type="search" placeholder="Search by champions or traits"/>
            
            <Row style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "left", marginLeft: "0px", maxHeight: "600px", overflowY: "auto"}}>
            {searchedData.data.map((data,j )=> 
            <ChampionListCell key={j} name={data.name} champion={data.icon} cost={data.cost}
            handleClick={handleClick}></ChampionListCell> 
            )}
            </Row>
        </div>
        )
    
}