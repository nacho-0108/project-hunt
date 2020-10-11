import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from '@material-ui/icons/Menu';
import {useRouter} from 'next/router'
import Avatar from "@material-ui/core/Avatar";
import getInitialsFromName from "../src/getInitialsFromName";
import React, {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../src/AuthContext";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import {ClickAwayListener} from '@material-ui/core';
import fb from "../src/firebase-config";
import Grow from "@material-ui/core/Grow";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}));

function ProfilePopper({isOpen, profilePic, toggleLoading, onClose}) {
    const id = open ? 'simple-popper' : undefined;
    const { sessionInfo } = useContext(AuthContext)
    const router = useRouter()

    function signOut() {
        toggleLoading(true)
        fb.auth().signOut().then(function () {
            toggleLoading(false)
            window.location.href = '/'
        })
            .catch(() => toggleLoading(false))
    }

    useEffect(() => {
        if (sessionInfo) {
            fb.firestore().collection("profiles").doc(sessionInfo.uid)
                .onSnapshot(function (doc) {
                    if (!doc.data()) {
                        router.push('/complete-profile')
                    }
                });
        }

    }, [sessionInfo]);

    function navigateToPage(route) {
        onClose()
        router.push(route)
    }

    return (<Popper id={id} open={true} anchorEl={profilePic.current} className={!isOpen && "pointer-events-none"}>
            <Grow in={isOpen} style={{transformOrigin: 'top right'}}>
                <Paper className="m-5" elevation={4}>
                    <List className="w-56">
                        <ListItem className="w-full" button onClick={() => navigateToPage(`/profile/${sessionInfo.uid}`)} >
                            <ListItemText>View profile</ListItemText>
                        </ListItem>
                        <ListItem className="w-full" button >
                            <ListItemText>My projects</ListItemText>
                        </ListItem>
                        <ListItem className="w-full" button onClick={() => navigateToPage(`/profile/edit`)}>
                            <ListItemText>Edit profile</ListItemText>
                        </ListItem>
                        <ListItem className="w-full" button onClick={signOut}>
                            <ListItemText>Sign out</ListItemText>
                        </ListItem>
                    </List>

                </Paper>
            </Grow>
        </Popper>

    );
}

export default function ({children, isLoading}) {
    const classes = useStyles();
    const router = useRouter()
    const {authState, sessionInfo} = useContext(AuthContext)
    const [drawerOpen, toggleDrawer] = useState(false)
    const [profileDropdown, toggleProfileDropdown] = useState(false)
    const profilePic = useRef(null)

    const [loading, toggleLoading] = useState(isLoading)

    useEffect(() => toggleLoading(isLoading), [isLoading])

    return <div className="h-screen">
        <AppBar position="fixed" className="border-b border-lightGray relative" elevation={0} color="inherit">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit"
                            aria-label="menu" onClick={() => toggleDrawer(true)}>
                    <MenuIcon/>
                </IconButton>
                <span>
                function MyImage() {
                    return <img src="/Banner_M.png" alt="my image" />
                }

                export default MyImage     
                </span>
                <span className="flex-grow">
                     <Link href="/">
                    <a className="text-xl font-semibold focus:text-gray-500 hover:text-gray-700 focus:outline-none">
                        Project Hunt
                    </a>
                </Link>
                </span>

                {authState === 1 ?
                    <ClickAwayListener onClickAway={() => toggleProfileDropdown(false)}>

                        <div>
                            <IconButton onClick={() => toggleProfileDropdown(!profileDropdown)} size="small">
                                <Avatar
                                    ref={profilePic}>{getInitialsFromName(sessionInfo ? sessionInfo.displayName : null)}</Avatar>
                            </IconButton>

                            <ProfilePopper onClose={() => toggleProfileDropdown(false)} profilePic={profilePic} isOpen={profileDropdown}
                                           toggleLoading={toggleLoading}/>
                        </div>

                    </ClickAwayListener> :
                    <span className="space-x-2">
                    <Button color="inherit" onClick={() => router.push('/signin')}>Log in</Button>
                <Button color="primary" variant="contained" onClick={() => router.push('/signup')}>Sign up</Button>
                </span>}
            </Toolbar>
            <LinearProgress hidden={!loading}/>
        </AppBar>

        <div className="py-24 h-full">
            {children}
            <div className="h-8"/>
        </div>

        <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
            <List className="w-64">
                <ListItem button>
                    <ListItemText>Hello</ListItemText>
                </ListItem>
            </List>
        </Drawer>

    </div>
}
