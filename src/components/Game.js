import React,{Component} from 'react';
import {Box, Chip, Container, Grid, LinearProgress, Paper, Snackbar} from "@material-ui/core";
import {Dialog,DialogTitle,DialogContent,DialogContentText,TextField,DialogActions,Button} from "@material-ui/core";
import PlayerBar from "./PlayerBar";
import * as signalR from "@microsoft/signalr";
import Typography from "@material-ui/core/Typography";
import {HubConnectionState} from "@microsoft/signalr";
import Board from "./Board";


function GetUsername(props){
    const handleJoin = ()=>{
        let nickname = document.getElementById("nickname").value;
        props.updateNickname(nickname);

    }

    return(
        <div>
        <Dialog open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Your Nickname</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nickname"
                    label="Enter Nickname"
                    type="text"
                    halfWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleJoin} color="primary">
                    Join
                </Button>

            </DialogActions>
        </Dialog>
    </div>
    )
}

const Roles = {
    PLAYER: 0,
    SPYMASTER: 1
}

const States = {
    GAME_PENDING: 0,
    GAME_START: 1,
    ROUND_INPROGRESS:2,
    ROUND_END: 3,
    GAME_END: 4
}

class Player{
    constructor(nickname,role) {
        this.nickname = nickname;
        this.role = role;
    }
}

class Team{
    constructor(wordsRemaining,players) {
        this.wordsRemaining = wordsRemaining;
        this.players = players;
    }
}

class GameSession{
    constructor(sessionId,currentState,name,isTimed,time,timeLeft,teams,words,winner) {
        this.SessionId = sessionId;
        this.CurrentState = currentState;
        this.RoomName = name;
        this.time = time > 0 ? time : 60;
        this.isTimed = isTimed;
        this.timeLeft = timeLeft > 0 ? timeLeft : 60;
        this.teams = teams;
        this.words = words;
        this.winner = winner
    }

    startNewSession(){
        const coinFlip = Math.floor(Math.random()*(1-0) + 0);
        var teamAWords;
        var teamBWords;

        if(coinFlip == 1){
            teamAWords = 8;
            teamBWords = 9;
        }else{
            teamAWords = 9;
            teamBWords = 8;
        }
        var teamA = new Team(teamAWords,[]);
        var teamB = new Team(teamBWords,[]);

        this.teams.push(teamA);
        this.teams.push(teamB);
        this.CurrentState = States.GAME_PENDING;
    }
}


export class Game extends Component{
    constructor(props) {
        super(props);
        this.state={
            nickname:this.props.nickname,
            room:null,
            connection: null,
            error:null,
            roundTime:this.props.roundTime,
            gameSession: null,
            isTimed:this.props.isTimed,
            team:0,
            role:Roles.PLAYER
        }
    }

   async componentDidMount() {
        console.log(this.props);
        const query = new URLSearchParams(this.props.search);

        const roomName = query.get("room");
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/gamehub')
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();


        if(connection){
            connection.start().then(()=>{

                console.log("Connected");
                console.log(connection.connectionId);

                this.setState({
                    room:roomName,
                    connection: connection
                });

                let joinPayload = {
                    connection: connection.connectionId,
                    nickname: this.state.nickname,
                    role: Roles.PLAYER
                }



                if(this.props.newgame === true){
                    let newGameSession = new GameSession(null,States.GAME_PENDING,roomName,this.state.isTimed,this.state.roundTime,this.state.roundTime,[],null);
                    newGameSession.startNewSession();

                    console.log(newGameSession);
                    connection.invoke("NewGame",roomName,newGameSession.teams[0],newGameSession.teams[1],newGameSession.isTimed,newGameSession.time);
                }

                connection.on("NewMove",(moveInfo,teamAWords,teamBWords)=>{
                     //copy over current session so we can change it and update the state
                     var tmpGameSession = this.state.gameSession;
                     tmpGameSession.teams[0].wordsRemaining = teamAWords;
                     tmpGameSession.teams[1].wordsRemaining = teamBWords;

                     //need to change the state of the word to update isPushed
                     Object.values(tmpGameSession.words[moveInfo.wordSelected])[0].isPushed = true;

                    this.setState({
                        gameSession:tmpGameSession
                    });

                });

                connection.on("SyncSession",(info)=>{

                    var gameSession = new GameSession(info.sessionId,info.currentState,roomName,info.isTimed,info.roundTime,info.roundTime,info.teams,Object.entries(info.words).map((e) => ( { [e[0]]: e[1] } )),info.winner);

                    var myTeamIndex = gameSession.teams.findIndex(t=>t.players.find(p=>p.nickname === this.state.nickname))
                    var myPlayer = gameSession.teams[myTeamIndex].players.find(p=>p.nickname === this.state.nickname);

                    console.log(info.currentState);
                    console.log(gameSession);
                    this.setState({
                        gameSession:gameSession,
                        role: myPlayer.role,
                        team: myTeamIndex
                    });
                });
                connection.on("SessionInfo",(info)=>{


                    if(this.state.nickname != null){
                        connection.invoke("PlayerJoined",joinPayload,0,info.roomName).catch((err)=>console.log(err))
                    }
                });



                connection.on("NicknameExists",(nickname,room)=>{
                    console.log("Error: Player with nickname "+nickname+" already exists in room "+room);
                    this.setState({error:0});
                });

                connection.on("RoomInactive",(room)=>{
                    console.log("Error: Room "+room+" isn't active");
                    this.setState({error:1});
                });

                connection.on("RoomExists",(room)=>{
                    console.log("Info: Room with name "+room+" already exists, going to join");
                    if(this.state.nickname != null){

                        connection.invoke("PlayerJoined",joinPayload,0,room).catch((err)=>console.log(err))
                    }
                });


            }).catch((err)=>console.log(err));
            this.setState({connection:connection});
        }



        this.handleDuplicateNicknameClose = this.handleDuplicateNicknameClose.bind(this);
        this.handleInactiveRoomClose = this.handleInactiveRoomClose.bind(this);
        this.handleSpyMasterChange = this.handleSpyMasterChange.bind(this);
        this.handleTeamChange = this.handleTeamChange.bind(this);
        this.updateNickname = this.updateNickname.bind(this);
        this.onConnectionSuccess = this.onConnectionSuccess.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleWordClick = this.handleWordClick.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    resetGame = ()=>{
        if(this.state.connection.state === HubConnectionState.Connected){
            this.state.connection.invoke("ResetGame",this.state.gameSession.SessionId);
        }
    }

    handleWordClick = (wordIndex,wordInfo)=>{

        if(this.state.connection.state === HubConnectionState.Connected){

            let movePayload = {
                selectedBy:this.state.team,
                wordSelected: wordIndex

            }

            if(!wordInfo.isPushed)
                this.state.connection.invoke("BoardSelection",movePayload,this.state.gameSession.SessionId)
            else
                console.log("already pushed")
        }


    }
    startNewGame(){

    }
    onConnectionSuccess(){

    }

    handleSnackbarClose = ()=>{
        this.setState({error: null});
    }

    handleSpyMasterChange = (roleToSet)=>{


        if(roleToSet === Roles.SPYMASTER && this.state.connection.state === HubConnectionState.Connected){
            if(this.state.gameSession.teams[this.state.team].players.find(p=>p.role === Roles.SPYMASTER) === undefined)
            {
                let changeRolePayload = {
                    connection: this.state.connection.connectionId,
                    nickname: this.state.nickname,
                    role:this.state.role
                }
                this.state.connection.invoke("ChangeRole",changeRolePayload,this.state.team,roleToSet,this.state.gameSession.SessionId).catch((err)=>console.log(err))

            }else{
                console.log("Exists");
                this.setState({error:3});
            }
        }else{

            console.log(this.state)
            let changeRolePayload = {
                connection: this.state.connection.connectionId,
                nickname: this.state.nickname,
                role:this.state.role
            }
            this.state.connection.invoke("ChangeRole",changeRolePayload,this.state.team,roleToSet,this.state.gameSession.SessionId).catch((err)=>console.log(err))

        }


    }

    handleTeamChange = (newTeam)=>{
        let changeTeamPayload = {
            connection: this.state.connection.connectionId,
            nickname: this.state.nickname,
            role:this.state.role
        }


        this.state.connection.invoke("ChangeTeams",changeTeamPayload,this.state.team,newTeam,this.state.gameSession.SessionId).catch((err)=>console.log(err))

    }

    handleInactiveRoomClose = ()=>{
        this.setState({error:null});
        this.props.history.push("/");
    }

    handleDuplicateNicknameClose = ()=>{
     this.setState({
         error:null,
         nickname: null
     })
    }

    updateNickname(name){

        this.setState({nickname:name});

        if(name != null && this.state.room != null){
            let joinPayload = {
                connection: this.state.connection.connectionId,
                nickname: name,
                role:Roles.PLAYER
            }

            this.state.connection.invoke("PlayerJoined",joinPayload,0,this.state.room).catch((err)=>console.log(err))
        }
        console.log(name);
    }
    render() {

        if(this.state.nickname == null){
            return(
              <GetUsername updateNickname={this.updateNickname} isOpen={true}/>
            );
        }
        if(this.state.gameSession == null){
           return(
               <div>
                   <LinearProgress />
                   <Typography align={"center"}  variant={"h5"}>Waiting for Game to Start ...</Typography>
               </div>

               );
        }
        if( (this.state.error == null || this.state.error === 3) && this.state.connection != null && this.state.gameSession != null){
            return(
                <Grid container direction={"row"} >
                    <Grid item xs={12} md={3} lg={3}>

                        <PlayerBar winner={this.state.gameSession.winner} onRoleChange={this.handleSpyMasterChange} onTeamChange={this.handleTeamChange} teams={this.state.gameSession.teams} currentRole={this.state.role} currentTeam={this.state.team}  />
                    </Grid>

                    <Grid item xs={12} md={6} lg={5}  justify="center"
                          alignItems="center" >
                        <Snackbar open={this.state.error === 3} onClose={this.handleSnackbarClose} message={"Someone on your team is already the Spymaster"}/>

                            <Board isFinished={this.state.gameSession.CurrentState} isSpymaster={this.state.role === Roles.SPYMASTER} onPieceClick={this.handleWordClick} words={this.state.gameSession.words}/>

                    </Grid>

                    <Grid item xs={12} md={3} lg={3}>
                        <Box  display="flex"
                              justifyContent="center"
                              alignItems="center" m={3}  >

                            <Button onClick={()=>this.resetGame()} variant={"contained"} color={"primary"}>New Game</Button>
                        </Box>

                     </Grid>
                </Grid>
            );
        }else{
            switch(this.state.error){
                case 0:
                    return(
                        <Dialog
                            open={true}
                            onClose={this.handleDuplicateNicknameClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Nickname Already Exists"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Oops! Someone in this room already has that nickname! Please enter a different nickname when prompted
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleDuplicateNicknameClose} color="primary" autoFocus>
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );

                case 1:
                    return(
                        <Dialog
                            open={true}
                            onClose={this.handleInactiveRoomClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Room Doesn't Exist"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Oops! The room you are trying to join doesn't exist or is inactive, you will be returned to the main menu where you can create a new room
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleInactiveRoomClose} color="primary" autoFocus>
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                default:
                    console.log("unhandled error code");
            }
        }

    }

}