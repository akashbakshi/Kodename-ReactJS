import React, {Component} from 'react';
import {Switch,BrowserRouter,Route} from "react-router-dom";
import './App.css';
import {MainMenu} from "./components/MainMenu";
import {Game} from "./components/Game";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import indigo from "@material-ui/core/colors/indigo";
import deepOrange from "@material-ui/core/colors/deepOrange";
import { HubConnectionBuilder } from '@microsoft/signalr';
import {AppBar,Toolbar,Typography} from "@material-ui/core";
import { withRouter } from "react-router-dom";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo.A700
        },
        primaryDark:{
            main: indigo.A200
        },
        secondary:{
            main: deepOrange.A400
        }
    },
});

function Menu(){
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant={"h4"}>
                    Kodenames
                </Typography>

            </Toolbar>
        </AppBar>
    )
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state ={
            nickname:null,
            room:null,
            roundTime:null,
            isTimed: false
        }

        this.getMainMenuInfo = this.getMainMenuInfo.bind(this);
    }

    getMainMenuInfo(nickname,isTimed,roomId,roundTime){

        this.setState({
            nickname:nickname,
            room:roomId,
            roundTime: roundTime,
            isTimed: isTimed
        });



        this.props.history.push("/game?room="+roomId)
    }



    render() {
        return (
            <ThemeProvider theme={theme}>
                <Menu/>
                    <Switch>
                        <Route exact path={"/"}>
                            <MainMenu gameInfo={this.getMainMenuInfo}/>
                        </Route>

                        <Route path={"/game"} render={(props)=><Game nickname={this.state.nickname} isTimed={this.state.isTimed} roundTime={this.state.roundTime} newgame={true} history={props.history} search={props.location.search}/>  } />
                    </Switch>

            </ThemeProvider>
        );
    }
}

export default withRouter(App);
