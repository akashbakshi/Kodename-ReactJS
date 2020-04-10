import React,{Component} from 'react';
import {Container} from "@material-ui/core";
import {Dialog,DialogTitle,DialogContent,DialogContentText,TextField,DialogActions,Button} from "@material-ui/core";

function GetUsername(props){
    const handleJoin = ()=>{
        let nickname = document.getElementById("nickname").value;
        props.updateNickname(nickname);

    }

    return(
        <div>
        <Dialog open={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter Your Nickname
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nickname"
                    label="Nickname"
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

export class Game extends Component{
    constructor(props) {
        super(props);
        this.state={
            nickname:this.props.nickname,
            room:null
        }
    }

    componentDidMount() {
        console.log(this.props);
        const query = new URLSearchParams(this.props.search);
        this.setState({
            room:query.get("room")
        })
        this.updateNickname = this.updateNickname.bind(this);
    }

    updateNickname(name){
        this.setState({nickname:name});
        console.log(this.state.nickname);
        console.log(name);
    }
    render() {

        if(this.state.nickname == null){
            return(
              <GetUsername updateNickname={this.updateNickname} isOpen={true}/>
            );
        }else{
            return(
                <Container>
                    <h1>{this.state.nickname}</h1>
                </Container>
            );
        }

    }

}