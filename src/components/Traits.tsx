import { useEffect, useState } from "react";
import data from "../data/champions.json"
import traitsData from "../data/traits.json"
import { TraitItem } from "../components/TraitItem";

type TraitsProps = {
    board: {index: number; champion: string; cost: number, star: number}[]
}
const soloTrait = ["Darkin", "Empress", "Wanderer", "Redeemer", "Technogenius"]

export function Traits({board}: TraitsProps){
    const [traits, setTraits] = useState<[trait: string, count: number][]>([])

    useEffect(() => {
        const state = [...board].filter((element) => (element.champion !== "" && element.index < 28)
        ).map(filteredObj => filteredObj.champion)
        const unique = [...new Set(state)];

        const traitsMap = new Map<string, number>()
        unique.forEach((obj)=> {
            const champsTraits = data.find((d: { icon: string }) => d.icon === obj)?.traits
            champsTraits?.forEach((i) => {
                traitsMap.set(i, traitsMap.has(i) ? traitsMap.get(i)! + 1 : 1)
                
            })
        })
        const toArray = Array.from(traitsMap).sort((a,b) => a[0].localeCompare(b[0])).sort((a,b) => b[1] - a[1])
        const solo = toArray.filter(ind => soloTrait.includes(ind[0]))
        const notSolo = toArray.filter(ind => !soloTrait.includes(ind[0]))
        setTraits(solo.concat(notSolo))    

    }, [board])
    return (
        <div style={{color: "white", width: "180px"}}>
        <>
        {
            [...traits].map((a, i) => (
                <TraitItem key={i} trait={traitsData.find(e => e.name === a[0])!} amount={a[1]}></TraitItem>
            ))
        }
        </>
        </div>

    )
}