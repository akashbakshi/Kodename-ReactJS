import React, {Component} from 'react';
import {Switch,BrowserRouter,Route} from "react-router-dom";
import './App.css';
import {MainMenu} from "./components/MainMenu";
import {Game} from "./components/Game";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import indigo from "@material-ui/core/colors/indigo";
import deepOrange from "@material-ui/core/colors/deepOrange";

import {AppBar,Toolbar,Typography} from "@material-ui/core";
import { withRouter } from "react-router-dom";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo.A700
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
                <Typography>
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
            room:null
        }

        this.getMainMenuInfo = this.getMainMenuInfo.bind(this);
    }

    getMainMenuInfo(nickname,roomId){
        console.log("main menu "+nickname);
        console.log("main menu "+roomId);

        this.setState({
            nickname:nickname,
            room:roomId
        })

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

                        <Route path={"/game"} render={(props)=><Game nickname={this.state.nickname} search={props.location.search}/>  } />
                    </Switch>

            </ThemeProvider>
        );
    }
}

export default withRouter(App);
