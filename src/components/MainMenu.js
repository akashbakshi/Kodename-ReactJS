import React,{Component} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Switch,
    FormControlLabel
} from "@material-ui/core";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export class MainMenu extends Component{

    constructor(props) {
        super(props);
        this.state={
            nickname:"",
            room:"",
            timedRound:false,
            roundTime:60,
        }
        this.createRoom = this.createRoom.bind(this);
        this.onTimeSwitchChange = this.onTimeSwitchChange.bind(this);
    }

    createRoom = ()=>{
        this.props.gameInfo(this.state.nickname,this.state.timedRound,this.state.room,this.state.roundTime);
    }

    onTimeSwitchChange = (e)=>{
        this.setState({timedRound: !this.state.timedRound})
    };

    render(){
        return(
          <Grid container  spacing={0}
                direction="column"
                alignItems="center"
                justify={"center"}>

              <Grid container  direction="column"
                    alignItems="center"
                    justify={"center"}
                    xs={12} spacing={2}>
                  <Grid item alignItems={"center"}>
                      <Typography variant={"h3"} component={"h3"} onClick={()=>console.log("home")} >Kodenames</Typography>
                  </Grid>

                  <Grid item alignItems={"center"}>
                      <TextField value={this.state.nickname} InputLabelProps={{ shrink: this.state.nickname != "", }} onChange={(e)=>this.setState({nickname:e.target.value})}  label="Nickname" variant="outlined" />
                      <br/>
                      <br/>
                      <TextField value={this.state.room} InputLabelProps={{ shrink: this.state.room != "", }}  onChange={(e)=>this.setState({room:e.target.value})}  label="Room Name" variant="outlined" />
                      <br/>
                      <br/>
                      <FormControlLabel control={
                          <Switch
                              checked={this.state.timedRound}
                              onChange={this.onTimeSwitchChange}
                              name="timeSwitch"
                              inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />

                      } label={"Time Limit"}/>
                      <br/>
                      <br/>
                      <TextField disabled={this.state.timedRound === false} value={this.state.roundTime} InputLabelProps={{ shrink: true, }} type={"number"} onChange={(e)=>this.setState({roundTime:e.target.value})}  label="Round Time" variant="outlined" />
                      <br/>
                      <br/>
                      <Button onClick={this.createRoom} variant={"contained"} color={"secondary"}>Join</Button>
                  </Grid>

                  <Grid item alignItems={"center"} padding={"xs"} xs={12} md={8}>
                      <ExpansionPanel>
                          <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header" >

                              <Typography variant={"h6"} component={"h6"}>Rules</Typography>
                          </ExpansionPanelSummary>

                          <ExpansionPanelDetails>
                              <Typography>
                                  1) Each team will be assigned either 8 or 9 words randomly, the team with 9 words starts their turn first. The objective is to guess all the words before the other team

                              </Typography>
                          </ExpansionPanelDetails>


                          <ExpansionPanelDetails>
                              <Typography>
                                  In addition to the 17 words the two teams will have to guess there will be 7 neutral words and 1 land mine for a total of 25 words
                              </Typography>
                          </ExpansionPanelDetails>
                         <ExpansionPanelDetails>
                              <Typography>
                                  2) Each team will choose one person from their team to become the 'Spy Master'.
                              </Typography>
                          </ExpansionPanelDetails>

                          <ExpansionPanelDetails>
                              <Typography>
                                  3) The Spy Master will give their team 'x' number of words they have to guess and a one word clue that describes those 'x' number of words, ex. "3 fruit", if they were describing the words Apple,Orange, Strawberry.
                              </Typography>
                          </ExpansionPanelDetails>
                          <ExpansionPanelDetails>
                              <Typography>
                                  4) Once given the hint the rest of the team has 'x' number of minutes (x being the number of seconds you select at the main menu) to guess the word(s) they think the Spy Master is hinting at. All team members must agree before choosing the word(s), if they happen to select a word that is neutral or belongs to the other team their turn is over.
                              </Typography>
                          </ExpansionPanelDetails>

                          <ExpansionPanelDetails>
                              <Typography>
                                  5) If any team selects the landmine word they lose automatically and the game is over.
                              </Typography>
                          </ExpansionPanelDetails>

                      </ExpansionPanel>
                  </Grid>
              </Grid>

          </Grid>
        );
    }

}