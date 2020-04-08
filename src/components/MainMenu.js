import React,{Component} from 'react';
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
export class MainMenu extends Component{

    render(){
        return(
          <Container>
              <Typography>Kodenames</Typography>
              <form>
                    <TextField placeholder={"Nickname"}/>
              </form>
          </Container>
        );
    }

}