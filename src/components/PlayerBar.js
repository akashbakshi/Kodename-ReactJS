import {Box, Button, Chip, Paper, useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const Roles = {
    PLAYER: 0,
    SPYMASTER: 1
}
const useStyles = makeStyles((theme) => ({
    root: {
        margin: 25,
    },
    section:{
        margin:25
    },
    paper:{

        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(1),
    },

    chip: {
        margin: theme.spacing(1),
    },
}));

const PlayerBar = ({teams,currentTeam,currentRole,onTeamChange,onRoleChange,winner})=>{
    const classes = useStyles();
    return(
        <div className={classes.root} >
            <div className={classes.section}>

                <Box component="div" display="inline">

                    {
                       winner === 0 ?
                           <Typography color={"primary"} className={classes.title} variant={"h5"}>Blue Wins</Typography>
                           :
                           <Typography color={"primary"} className={classes.title} variant={"h5"}>Blue Team - {teams[0].wordsRemaining} Word(s) Left</Typography>

                    }

                    {currentTeam === 0 ? (

                        <Button variant={"contained"} color={"primary"} disabled>Join Blue</Button>
                    ):(

                        <Button variant={"contained"} color={"primary"} onClick={()=>onTeamChange(0)}>Join Blue</Button>
                    )}
                    {
                        currentTeam === 0 ?
                            (currentRole === Roles.SPYMASTER ? <Button variant={"contained"} color={"primaryDark"} onClick={()=>onRoleChange(Roles.PLAYER)}>Leave Spymaster</Button>:<Button variant={"contained"} color={"primaryDark"} onClick={()=>onRoleChange(Roles.SPYMASTER)}>Spymaster</Button> )
                            :(<Button variant={"contained"} color={"primary"} disabled>Spymaster</Button>)
                    }
                </Box>

                <Paper className={classes.paper} elevation={3}>
                    {
                        teams[0].players.length > 0 ?
                        teams[0].players.map((player)=><Chip className={classes.chip} key={player.key} color={"primary"} label={player.nickname}/>)
                            :<Typography variant={"h6"}>No Players</Typography>
                    }

                </Paper>

            </div>

            <div className={classes.section}>
                <Box component="div" display="inline">

                    {
                        winner === 1 ?
                            <Typography className={classes.title} color={"secondary"} variant={"h5"}>Orange Wins</Typography>
                            :
                            <Typography className={classes.title} color={"secondary"} variant={"h5"}>Orange Team - {teams[1].wordsRemaining} Word(s) Left</Typography>

                    }
                    {currentTeam === 1 ? (

                        <Button variant={"contained"} color={"secondary"} disabled>Join Orange</Button>
                    ):(

                        <Button variant={"contained"} color={"secondary"} onClick={()=>onTeamChange(1)}>Join Orange</Button>
                    )}
                    {
                        currentTeam === 1 ?
                            (currentRole === Roles.SPYMASTER ? <Button variant={"contained"} color={"primaryDark"} onClick={()=>onRoleChange(Roles.PLAYER)}>Leave Spymaster</Button>:<Button variant={"contained"} color={"primaryDark"} onClick={()=>onRoleChange(Roles.SPYMASTER)}>Spymaster</Button> )
                            :(<Button variant={"contained"} color={"primaryDark"} disabled>Spymaster</Button>)
                    }

                </Box>
                <Paper className={classes.paper} elevation={3}>
                    {
                        teams[1].players.length > 0 ?
                        teams[1].players.map((player)=><Chip className={classes.chip} key={player.key} color={"secondary"} label={player.nickname}/>)
                        :<Typography variant={"h6"}>No Players</Typography>
                    }
                </Paper>
            </div>


        </div>
    );
};

export default PlayerBar;