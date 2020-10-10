import Paper from "@material-ui/core/Paper";
import React, {useEffect, useRef, useState} from "react";
import {IconButton} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Chip from "@material-ui/core/Chip";
import {connectHits, connectSearchBox} from 'react-instantsearch-dom';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {useRouter} from "next/router";
import TagChip from "./TagChip";


const Hits = ({hits}) => {
    const router = useRouter()

    if (hits.length === 0) return null

    return <Paper elevation={6}>
        <List>
            {hits.map(hit => (
                <ListItem button onClick={(e) => {
                    e.preventDefault()
                    router.push(`/${hit.objectID}`)
                }} key={hit.objectID}>
                    <ListItemText>
                        {hit.title}
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    </Paper>
};


const CustomHits = connectHits(Hits);

const SearchBar = ({currentRefinement, refine, hitCards, prefilledTerm}) => {
    const [isFocused, toggleIsFocused] = useState(false)
    const searchRef = useRef(null)
    const id = open ? 'transitions-popper' : undefined;

    useEffect(() => {
        if (prefilledTerm) {
            refine(prefilledTerm)
        }

    }, [prefilledTerm])

    return <>
        <div className="relative">
            <div className={`border rounded-lg ${isFocused ? "border-transparent" : "border-lightGray"}`}
                 ref={searchRef}>
                <Paper elevation={isFocused ? 3 : 0}>
                    <div className="p-2 flex justify-start">
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                        <input
                            onChange={e => refine(e.currentTarget.value)}
                            value={currentRefinement}
                            onFocus={() => toggleIsFocused(true)}
                            onBlur={() => setTimeout(() => toggleIsFocused(false), 500)}
                            className="w-full py-3 pr-3 pl-1 focus:outline-none text-lg"
                            placeholder="Search"/>
                    </div>
                </Paper>

            </div>

            {(isFocused && !hitCards) && <div className="absolute w-full mt-2 z-50">
                <CustomHits/>
            </div>}

            {hitCards}


        </div>


        {!hitCards && <div className="mt-4">
            <TagChip tag="Student Initiative"/>
            <TagChip tag="Social Initiative"/>
            <TagChip tag="Startups"/>
        </div>}


    </>
}


const ConnectedSearchBox = connectSearchBox(SearchBar);

export default function ({hitCards, prefilledTerm}) {
    return <>
        <ConnectedSearchBox hitCards={hitCards} prefilledTerm={prefilledTerm}/>

    </>
}



