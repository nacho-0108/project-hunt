import Button from "@material-ui/core/Button";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Box from "@material-ui/core/Box";
import React, {useContext, useEffect, useState} from "react";
import fb from "../src/firebase-config";
import AuthContext from "../src/AuthContext";
import {useRouter} from "next/router";

export default function ({projectId}) {
    const {sessionInfo, authState} = useContext(AuthContext)
    const [isLiked, toggleLiked] = useState(false)
    const [isLoading, toggleLoading] = useState(true)
    const router = useRouter()

    const [totalLikes, setTotalLikes] = useState("Like")

    useEffect(() => {
        if (authState === 1) {
            fb.firestore().collection("projects").doc(projectId).collection("likes").doc(sessionInfo.uid)
                .onSnapshot(function (doc) {
                    toggleLoading(false)
                    if (doc.data()) {
                        toggleLiked(true)
                    } else {
                        toggleLiked(false)
                    }
                });
        } else {
            toggleLoading(false)
        }

        fb.firestore().collection("projects").doc(projectId).collection("likes")
            .onSnapshot(function (doc) {
                setTotalLikes(doc.docs.length)
            });

    }, [])

    function likeProject() {
        if (authState !== 1) {
            router.push('/signup')
        } else {
            toggleLoading(true)
            if (!isLiked) {
                fb.firestore().collection("projects").doc(projectId).collection("likes").doc(sessionInfo.uid).set({
                    liked_at: new Date()
                })
                    .then(function() {
                        toggleLiked(true)
                        toggleLoading(false)
                    })
                    .catch(function(error) {
                        toggleLoading(false)
                    });
            } else {
                fb.firestore().collection("projects").doc(projectId).collection("likes").doc(sessionInfo.uid).delete()
                    .then(function() {
                        toggleLiked(false)
                        toggleLoading(false)
                    })
                    .catch(function(error) {
                        toggleLoading(false)
                    });
            }
        }

    }

    return  <Button
        color={isLiked ?  "secondary" : "inherit"}
        size="120"
        disabled={isLoading}
        onClick={likeProject}
        startIcon={isLiked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
    >
        {totalLikes}
    </Button>
}