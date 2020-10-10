import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Container} from "@material-ui/core";
import ArrayInputPanel from "./ArrayInputPanel";
import LinearProgress from "@material-ui/core/LinearProgress";
import {nanoid} from "nanoid";
import fb from "../../../src/firebase-config";
import AuthContext from "../../../src/AuthContext";
import {useRouter} from "next/router";

import ReactDOM from 'react-dom';
import Demo from 'components/Timeline';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({isOpen, onClose}) {
    const classes = useStyles();

    const [isLoading, toggleLoading] = useState(false)

    const [projectTitle, setProjectTitle] = useState("")
    const [category, setCategory] = useState("Student Initiative")
    const [overview, setOverview] = useState("")
    const [timeCommitment, setTimeCommitment] = useState("1-2 hours")
    const [skillArray, setSkillArray] = useState([])
    const [softwareArray, setSoftwareArray] = useState([])
    const [languagesArray, setLanguagesArray] = useState([])

    const formValid = projectTitle.length > 0 && overview.length > 0

    const handleClose = () => {
        onClose()
    };

    const router = useRouter()
    const {authState, sessionInfo} = useContext(AuthContext)
    function createProject() {

        const newId = nanoid(12)
        toggleLoading(true)
        fb.firestore().collection("projects").doc(newId).set({
            title: projectTitle,
            description: overview,
            timeCommitment: timeCommitment,
            skills: skillArray,
            software: softwareArray,
            languages: languagesArray,
            created_by: sessionInfo.uid
        })
            .then(function() {
                router.push(`/${newId}`)
            })
            .catch(function(error) {
                toggleLoading(false)
            });

    }




    return (<Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar color="inherit" elevation={0} className="border-b border-lightGray relative">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        New project
                    </Typography>
                    <Button variant="contained" color="primary" disabled={!formValid} onClick={createProject}>
                        Publish
                    </Button>
                </Toolbar>
                <LinearProgress hidden={!isLoading}/>

            </AppBar>
            <div className="overflow-y-scroll">
                <Container maxWidth="md" className="my-24">
                    <h1 className="mb-6 text-3xl font-display ">Create a new project</h1>
                    <div className="space-y-4">
                        <Paper variant="outlined">
                            <Box p={4}>
                                <h2 className="text-xl font-display">Basic Information</h2>
                                <div className="newProjectFormPanelGrid">
                                    <TextField id="outlined-basic" label="Project Title"
                                               variant="outlined" value={projectTitle}
                                               onChange={event => setProjectTitle(event.target.value)}/>
                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={category}
                                            onChange={(event) => setCategory(event.target.value)}
                                            label="Category"

                                        >
                                            <MenuItem value="Student Initiative">Student Initiative</MenuItem>
                                            <MenuItem value="Social Initiative">Social Initiative</MenuItem>
                                            <MenuItem value="Startup">Startup</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="mt-4">
                                    <TextField multiline id="outlined-basic" label="Detailed overview of your project"
                                               variant="outlined"
                                               className="w-full"
                                               value={overview}
                                               onChange={event => setOverview(event.target.value)}/>
                                </div>
                            </Box>
                        </Paper>

                        <Paper variant="outlined">
                            <Box p={4}>
                                <h2 className="text-xl font-display">Approximate time commitment (per week)</h2>
                                <div className="newProjectFormPanelGrid">

                                    <FormControl variant="outlined">
                                        <InputLabel id="demo-simple-select-outlined-label">Hours per week</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={timeCommitment}
                                            onChange={(event) =>
                                                setTimeCommitment(event.target.value)}
                                            label="Hours per week"
                                        >
                                            <MenuItem value="1-2 hours">1-2 hours</MenuItem>
                                            <MenuItem value="3-5 hours">3-5 hours</MenuItem>
                                            <MenuItem value="6-10 hours">6-10 hours</MenuItem>
                                            <MenuItem value="15+ hours">15+ hours</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className="w-full"/>
                                </div>
                                <div>
                                ReactDOM.render(</components/Timeline />, document.querySelector('#root'));
                                </div>

                            </Box>


                        </Paper>

                       <ArrayInputPanel title="Skills I'm looking for"
                                        itemName="skill"
                                        value={skillArray} setValue={setSkillArray}/>

                        <ArrayInputPanel title="Software, programming languages, and technologies"
                                         itemName="software"
                            value={softwareArray} setValue={setSoftwareArray}/>

                        <ArrayInputPanel title="Foreign Languages"
                                         itemName="languages"
                                         value={languagesArray} setValue={setLanguagesArray}/>


                    </div>
                </Container>
            </div>



        </Dialog>
    );
}
