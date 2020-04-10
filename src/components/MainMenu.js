import React,{Component} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails} from "@material-ui/core";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export class MainMenu extends Component{

    constructor(props) {
        super(props);
        this.state={
            nickname:"",
            room:""
        }
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom = ()=>{
        let nickname = document.getElementById("nickname").value;

        fetch("http://localhost:5000/game",{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                msgType: 'JOIN',
                nickname:nickname
            })
        })
            .then(response => {
                response.json().then(json => {
                    // code that can access both here

                    this.setState({
                        nickname:nickname,
                        room:json.room
                    });

                    this.props.gameInfo(nickname,json.room);
                })
            })
    }


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
                      <Typography variant={"h3"} component={"h3"} >Kodenames</Typography>
                  </Grid>

                  <Grid item alignItems={"center"}>
                      <TextField  id="nickname" name="nickname" label="Nickname" variant="outlined" />
                      <br/>
                      <br/>
                      <Button onClick={this.createRoom} variant={"contained"} color={"secondary"}>Join</Button>
                  </Grid>

                  <Grid item alignItems={"center"} padding={"xs"}>
                      <ExpansionPanel>
                          <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header" >

                              <Typography variant={"h6"} component={"h6"}>Rules</Typography>
                          </ExpansionPanelSummary>

                          <ExpansionPanelDetails>
                              <Typography>
                                  1) Each team will be assigned either 8 or 9 words randomly, the team with 9 words starts their turn first. The objective is to guess all the words

                              </Typography>
                          </ExpansionPanelDetails>


                          <ExpansionPanelDetails>
                              <Typography>
                                  In Addition to the 17 words the two teams will have to guess there will be 6 neutral words and 1 land mine for a total of 24 words
                              </Typography>
                          </ExpansionPanelDetails>
                         <ExpansionPanelDetails>
                              <Typography>
                                  2) Two teams will choose one person each from their team to become the 'Spy Master'.
                              </Typography>
                          </ExpansionPanelDetails>
                          <ExpansionPanelDetails>
                              <Typography>
                                  The Spy Master will give their team 'x' number of words they have to guess and one general word that relates to those 'x' number of words
                              </Typography>
                          </ExpansionPanelDetails>


                          <ExpansionPanelDetails>
                              <Typography>
                                  3) The Spy Master will give their team 'x' number of words they have to guess and one general word that relates to those 'x' number of words
                              </Typography>
                          </ExpansionPanelDetails>
                          <ExpansionPanelDetails>
                              <Typography>
                                  4) If they select either the wrong word or a neutral word their turn is automatically done and the next team starts theirs.
                              </Typography>
                          </ExpansionPanelDetails>

                          <ExpansionPanelDetails>
                              <Typography>
                                  If any team selects the landmine word they lose.
                              </Typography>
                          </ExpansionPanelDetails>

                      </ExpansionPanel>
                  </Grid>
              </Grid>

          </Grid>
        );
    }

}