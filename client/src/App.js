import React, { Component } from "react";
import Exchange from "./contracts/Exchange.json";
import Token from "./contracts/MyToken.json";
import getWeb3 from "./getWeb3";
import {RecoilRoot,atom,selector,useRecoilState,useRecoilValue,} from "recoil";
import logo from './logo.svg';
import "./App.css";


import { BrowserRouter as Router, Route,Link, Switch } from "react-router-dom";
import { Navigation, Footer, ExchangeOverview, About, ManageToken } from "./components";




  const Hoe=()=>{
    
    return(
    <div>
    <h3>home</h3>
    
    </div>

      );
  };

class App extends Component {
  constructor(){
    super();
    this.state = { CurrentAddress:"0X123" ,Load:false, NTokens:0,AllowanceToken:0,AllowanceAddress:"0X123",balance:0,Reciepent:"0x123",TokenValue:1,NameOfToken:"DE",AddressOfToken:"0x64aeBc75a0285D7b2D2d5c6A20eB3E7B97277E9C",Tokenevent:"",WithDrawEther:0,DepositEther:0,DepositToken:10,WithDrawToken:0,DSymbol:"DE",WSymbol:""};
  }
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      

      this.ExchangeInstance=new this.web3.eth.Contract(
        Exchange.abi,
        Exchange.networks[this.networkId] && Exchange.networks[this.networkId].address,
      );

      this.TokenInstance=new this.web3.eth.Contract(
        Token.abi,
        Token.networks[this.networkId]&&Token.networks[this.networkId].address,
      );
      
      

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ CurrentAddress : Token.networks[this.networkId].address,Load: true,  },this.handleBalanceEther);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  ///////////////
  //ManageToken//
  //////////////
  handleDepositEther=async ()=>{
    let vaue=this.state.DepositEther;
    await this.ExchangeInstance.methods.depositEther().send({from:this.accounts[0],value:this.web3.utils.toWei("0.05", "ether")});
    this.handleBalanceEther();
  }

  handleWithDrawEther=async()=>{
    let vaue=this.web3.utils.toString(this.state.WithDrawEther);
    await this.ExchangeInstance.methods.withdrawEther(this.web3.utils.toWei("0.01","ether")).send({from:this.accounts[0]})
    this.handleBalanceEther();
  }
  handleBalanceEther=async()=>{
    let balance=await this.ExchangeInstance.methods.getEthBalanceInWei().call({from:this.accounts[0]});
    this.setState({balance:balance});
  }

  UpdateUserToken=async ()=>{
    let usertoken=await this.TokenInstance.methods.balanceOf(this.accounts[0]).call({from:this.accounts[0]});
    console.log(usertoken);
    this.setState({NTokens:usertoken});
  }
   
  
  TransferToken=async ()=>{
    await this.TokenInstance.methods.transfer(this.state.Reciepent,this.state.TokenValue).send({from:this.accounts[0]});
    this.UpdateUserToken();
    console.log(this.state.Reciepent,this.state.TokenValue);
    
 }

 DepositToken=async()=>{
  await this.ExchangeInstance.methods.depositToken(this.state.DSymbol,this.state.DepositToken).send({from:this.accounts[0]});
  this.UpdateUserToken();
 }

 WithDrawToken=async()=>{
  await this.ExchangeInstance.methods.withToken(this.state.WSymbol,this.state.WithDrawToken).send({from:this.accounts[0]});
  this.UpdateUserToken();
 }

 InputHandleChangeForText=(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;
  

   this.setState({Reciepent:value});
   console.log(value);
   
 }


 
 InputHandleChangeForValue=(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;
  
  this.setState({TokenValue:value});
  console.log(value);
 
}

InputHandleChangeForSymbolToken=async(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;
  this.setState({NameOfToken:value})
}

InputHandleChangeForSymbolAddress=async(event)=>{
  const target=event.target;
  const value=target.type==="checkBox" ? target.checked: target.value;

  this.setState({AddressOfToken:value})
}

ApproveAccount=async()=>{
  await this.TokenInstance.methods.approve(this.state.AllowanceAddress,this.state.AllowanceToken).send({from :this.accounts[0]});
  this.UpdateUserToken();
}

 AddTokenToExchange=async()=>{
   let add=await this.ExchangeInstance.methods.addToken("DE","0x64aeBc75a0285D7b2D2d5c6A20eB3E7B97277E9C").send({from:this.accounts[0]});
   this.UpdateUserToken();
   console.log(add);
   alert(
    `Token Added`,
  );
   
 } 
 //////////////////////
 //Buy & Sell Tokens//
 ////////////////////
 BuyToken=async()=>{
  await this.ExchangeInstance.methods.buyToken("DE","10","1").send({from:this.accounts[0]});
 }

 SellToken=async()=>{
  await this.ExchangeInstance.methods.sellToken("DE","9","1").send({from:this.accounts[0]});
 }
 /////////////////////
 //eventlistnerwrong//
 ////////////////////
 EventListener=async()=>{
   let evnt=await this.TokenInstance.OrderBook({},{fromBlock:0});
   
 }

 getSymbolindex=async()=>{
   let sy=await this.ExchangeInstance.methods.getsymbolIndex('DE').call({from:this.accounts[0]});
   this.setState({TokenValue:sy});
 }
  
/*
    <h3>
        {this.state.NTokens}
      </h3>
      <h3>
      {this.state.CurrentAddress}
      </h3>
      <h3>
        {this.state.balance}
      </h3>
      <h3>
        //
        {this.state.Tokenevent}
      </h3>
      <form>
      <span> Reciepent Address</span> <input type="text"   value={this.state.Reciepent} onChange={this.InputHandleChangeForText} />
      <span>Value</span><input type="text"  value={this.state.TokenValue}  onChange={this.InputHandleChangeForValue}/>
      </form>
      <button type="button" onClick={this.handleDepositEther}>deposit Ether</button>
      <button type="button" onClick={this.handleBalanceEther}>Balance</button>
      <button type="button" onClick={this.UpdateUserToken}>Token</button>
      <button type="button" onClick={this.TransferToken}>BuyToken</button>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/About" exact component={() => <About />} />
          <Route path="/ManageToken" exact component={() => <ManageToken />} />
        </Switch>
        <Footer />
      </Router>
  
*/

 

  
  render() {
    if (!this.state.Load) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
    
      <div className="App">
        
         <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <ExchangeOverview Token={this.state.NTokens} balance={this.state.balance} MainApp={this}/>} />
          <Route path="/About" exact component={() => <About MainApp={this} />} />
          <Route path="/ManageToken" exact component={() => <ManageToken  TokenTransfer={this.TransferToken} ApproveToken={this.ApproveAccount} AddTokenToExchange={this.AddTokenToExchange}  state ={this.state} InputHandleChangeForText={this.InputHandleChangeForText}  InputHandleChangeForValue={this.InputHandleChangeForValue} MainApp={this}/>} />
        </Switch>
        <Footer />
      </Router>
      </div>
    
      
    );
  }
}

export default App;
