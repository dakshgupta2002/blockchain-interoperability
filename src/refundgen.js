import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import CreateHTLC from './CreateHTLC.js';
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import logo from './res/logo.jpg'
import bg from './res/back.jpg'
import 'reactjs-popup/dist/index.css';

function myFunctionKeyShow(){

  var x = document.getElementById("secretKey");
    if (x.type === "password"){
      x.type = "text";
    } else{
      x.type = "password";
    }
}

class GenerateData extends Component {



  async componentWillMount() {
	await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
	
  }

  async loadBlockchainData() {
    const web3 = window.web3	
	
	const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    this.setState({networkId})
	
    const networkData = HTLC.networks[networkId]
    if(networkData) {
      const htlc = new web3.eth.Contract(HTLC.abi, networkData.address)
      this.setState({ htlc })
      this.setState({ loading: false})
    } else {
      window.alert('SwapContract not deployed to detected network.')
    }

  }
  
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true
    }
  }
  
  
  initiateRefunds=(transactionId)=>{

    this.setState({ loading: true })
    for(var i=0; i< transactionId.length;i++){
      if(!(transactionId[i]>='0' && transactionId[i]<='9')){
        window.alert("Wrong Transaction Id")
        this.setState({loading:false})
        return;
      }
    }

    this.state.htlc.methods.refund(transactionId).send({from:this.state.account}).on('transactionHash', function(hash){
        console.log(hash);
}).then(result=>
    {
      window.alert("Refund is initiated")
      this.setState({loading : false})
    },e=>{
      window.alert("Refund Failed")
      this.setState({loading : false})
    })

  }
  
  getNetworkName(){
  if(this.state.networkId === 3){
    return "Ropsten"
  }if(this.state.networkId === 42){
    return "Kovan"
  }if(this.state.networkId === 4){
    return "Rinkeby"
  }if(this.state.networkId === 5){
    return "Goerli"
  }if(this.state.networkId === 5777){
    return "Ganache"
  }
}


  render() {

    return (
      <div >
	  
       
		
		
		<div style={{paddingTop : "2%",paddingBottom : "2%"}}>
        <div class="card bg-light" style={{ width: '40%', marginLeft: '58%'}}>
		<div class="card-body">
		<div className="container" >
          <div className="row">
            <main role="main" className="col-lg-12 text-center">
              <div className="content mr-auto ml-auto colour-red">
                <h5 className="mt-2 text-danger" align="center" ><strong>You Are Transferring On {this.getNetworkName()} Network</strong></h5> 
				{   
					this.state.loading ? <div id="loader" style={{zIndex: '1'}} className="spinner-border text-primary text-center"></div> : null
				}
                <div style={{filter: this.state.loading?'blur(1px)':''}}>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      var transactionId = this.transactionId.value
					  this.initiateRefunds(transactionId)
                    }}>
					
                        <div className="form-group my-4" style={{paddingTop: "20px"}}>
						<div className="float-left">Transaction Id</div>
                        <input
                          id="transactionId"
                          type="text"
                          ref={(input) => { this.transactionId = input }}
                          className="form-control"
                          placeholder="Enter Transaction Id."
                          required />
						  <small className="form-text text-muted">Note: Funds can Only Be Claimed after the expiry of Time Lock.</small>
                      </div>
						
						
                      <button
                        style = {{fontSize:20}} 
						className = "btn btn-primary btn-sm my-4">
                          Claim Refund
                      </button>
                    </form>
                    
                  </div>
              </div>
            </main>
          </div>
        </div>
		</div>
		</div>
        </div>
	</div>
    );
}
}

export default GenerateData;
