import {Button, Paper, useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {Component} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        "& > *": {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16)
        }
    },
    section: {
        margin: 25
    },
    paper: {
        backgroundColor: "#fff",
        width: '100%',
    },
    buttonDefault:{
        backgroundColor: "#e0e0e0",
        fontSize: "1.5rem",
        color: "#000",
        width: '100%',
        height: '100%'
    },
    buttonRevealBlue:{
        backgroundColor: "#304ffe",
        width: '100%',
        height: '100%'
    },
    buttonRevealOrange:{
        backgroundColor: "#ff3d00",
        width: '100%',
        height: '100%'
    },
    buttonRevealNeutral:{
        backgroundColor: "#f3e5f5",
        width: '100%',
        height: '100%'
    },
    buttonRevealLandmine:{
        backgroundColor: "#000000",
        color:"#fff",
        width: '100%',
        height: '100%'
    },
    chip: {
        margin: theme.spacing(1),
    },
}));


const BoardPiece = ({word,index,wordSelected,isFinished,isSpymaster})=>{
    const classes = useStyles();
    const isPushed = Object.values(word)[0].isPushed;
    const revealColour = (wordInfo)=>{
        if(wordInfo.wordType === 0)
            return ' btnBlue';
        else if(wordInfo.wordType === 1)
            return  ' btnOrange';
        else if(wordInfo.wordType === 2)
            return  ' btnNeutral';
        else if(wordInfo.wordType === 3)
            return  ' btnLandmine';

    }
    return(
        <Grid item xs={3} >
            <div className={classes.root}>
                <Paper className={classes.paper} variant={"contained"} color={"primary"}>
                    <Button className={ isPushed || isSpymaster || isFinished ? classes.buttonDefault+revealColour(Object.values(word)[0]): classes.buttonDefault} variant={"contained"} key={index} onClick={()=> wordSelected(index,Object.values(word)[0])} disabled={isFinished  || isPushed} >
                        {Object.keys(word)}
                    </Button>
                </Paper>
            </div>
        </Grid>

    )
}

class Board extends Component {
    constructor(props) {
        super(props);

    }
    state={
        words: this.props.words,
        onPieceClick: this.props.onPieceClick,
        isGameDone: this.props.isFinished
    }


    render() {
        return(
            <Grid container direction={"row"} justify={"center"} alignItems={"center"} >

                {

                    this.props.words.map((word,index)=><BoardPiece wordSelected={this.props.onPieceClick} word={word} index={index} isFinished={this.props.isFinished === 4} isSpymaster={this.props.isSpymaster}/>)

                }
            </Grid>


        );
    }

}


export default Board;