import {useRouter} from 'next/router'
import {useEffect, useState} from "react";
import fb from "../src/firebase-config";
import PageLayout from "../components/PageLayout";
import {Button, Container} from "@material-ui/core";

export default function DisplayCreator(props) {
    const router = useRouter()
    const [isLoading, toggleLoading] = useState(true)
    const [pageData, setPageData] = useState()

    useEffect(() => {
        fb.firestore().collection("profiles").doc(props.profile_id)
            .onSnapshot(function (doc) {
                setPageData(doc.data());
                toggleLoading(false);
            })
    }, [])

    function navToCreator(){
        router.push(`/profile/${props.profile_id}`);
    }

    return <div isLoading={isLoading}>
        {!isLoading && 
        <Button onClick={navToCreator} variant="contained" color="primary">Created by: {pageData.name}</Button> }
    </div>

}
