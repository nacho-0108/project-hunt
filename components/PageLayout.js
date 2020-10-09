import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
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
import Collapse from "@material-ui/core/Collapse";
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

function ProfilePopper({isOpen, profilePic, toggleLoading}) {
    const id = open ? 'simple-popper' : undefined;
    const router = useRouter()

    function signOut() {
        toggleLoading(true)
        fb.auth().signOut().then(function () {
            toggleLoading(false)
            router.push('')
        })
            .catch(() => toggleLoading(false))
    }

    return (

        <Popper id={id} open={true} anchorEl={profilePic.current}>
            <Grow in={isOpen} style={{ transformOrigin: 'top right' }}>
                <Paper className="m-2" elevation={4}>
                    <List className="w-56">
                        <ListItem className="w-full" button>
                            <ListItemText>View profile</ListItemText>
                        </ListItem>
                        <ListItem className="w-full" button>
                            <ListItemText>My projects</ListItemText>
                        </ListItem>
                        <ListItem className="w-full" button>
                            <ListItemText>Account settings</ListItemText>
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

    return <>
        <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
            <List className="w-64">
                <ListItem button>
                    <ListItemText>Hello</ListItemText>
                </ListItem>
            </List>
        </Drawer>
        <AppBar position="fixed" className="border-b border-lightGray" elevation={0} color="inherit">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit"
                            aria-label="menu" onClick={() => toggleDrawer(true)}>
                    <MenuIcon/>
                </IconButton>
                <Link href="/">
                    <a className="text-xl font-bold flex-grow focus:text-gray-500 focus:outline-none">
                        Project Hunt
                    </a>
                </Link>
                {authState === 1 ?
                    <ClickAwayListener onClickAway={() => toggleProfileDropdown(false)}>

                        <div>
                            <IconButton onClick={() => toggleProfileDropdown(!profileDropdown)} size="small">
                                <Avatar
                                        ref={profilePic}>{getInitialsFromName(sessionInfo ? sessionInfo.displayName : null)}</Avatar>
                            </IconButton>

                            <ProfilePopper profilePic={profilePic} isOpen={profileDropdown} toggleLoading={toggleLoading}/>
                        </div>

                    </ClickAwayListener> :
                    <span className="space-x-2">
                    <Button color="inherit" onClick={() => router.push('/signin')}>Log in</Button>
                <Button color="primary" variant="contained" onClick={() => router.push('/signup')}>Sign up</Button>
                </span>}
            </Toolbar>

            <LinearProgress hidden={!loading}/>
        </AppBar>

        <div className="pt-20">
            {children}
        </div>

    </>
}