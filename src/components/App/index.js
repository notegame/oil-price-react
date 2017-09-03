import React, { Component } from 'react';
import { AppBar, Drawer, MenuItem, CircularProgress } from 'material-ui';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import './style.scss';
import OliPrice from '../../libs/oilprice'
import moment from 'moment'
require("moment/locale/th")

class About extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: true,
      currentPrice: {},
      oilprice: {
        currentPrice: {},
        oilTypes: {},
        operators: {},
        tomorrowPrice: {}
      }
    };

    this.iconStyles = {
      marginRight: 24,
    };

    moment.locale('th');

    OliPrice.init().then(res=>{
      
      this.oilprice = res

      let firstOperatorKey = null

      if(!this.state.currentOperator){
        firstOperatorKey = Object.keys(res.operators)[0]
      }else{
        firstOperatorKey = this.state.currentOperator
      }

      this.setState({
        oilprice: res,
        loading:false,
      })
      
      this.getCurrentPrice(firstOperatorKey)
      
      console.log(firstOperatorKey, this.oilprice, this.state.currentPrice)

    })

  }

  getCurrentPrice(firstOperatorKey){
    let tomorrowPrice = {}

    if(this.oilprice.tomorrowPrice){
      tomorrowPrice = this.oilprice.tomorrowPrice.operators[firstOperatorKey]
    }else{
      tomorrowPrice = this.oilprice.currentPrice.operators[firstOperatorKey]
    }

    this.setState({
      currentOperator: firstOperatorKey,
      currentPrice: this.oilprice.currentPrice.operators[firstOperatorKey],
      tomorrowPrice: tomorrowPrice
    })

  }

  handleToggle = () => this.setState({open: !this.state.open});

  clickMenu(el, currentOperator){
    this.getCurrentPrice(currentOperator)
    this.handleToggle()
  }

  render() {

    // OliPrice.init().then(res=>{
    //   this.setState({loading:false})
    //   console.log("init", res)
    // })

    let operators = Object.keys(this.state.oilprice.operators).map((key) =>{ 
      let active = this.state.currentOperator == key ? 'active' : ''
      return (
      <MenuItem key={key} className={'menu-item '+active} onClick={el=>this.clickMenu(el, key)} >{this.state.oilprice.operators[key]}</MenuItem>
      )
    });

    let oilTable = Object.keys(this.state.currentPrice).map((oilType) => {
        let name = this.state.oilprice.oilTypes[oilType]
        let price = this.state.currentPrice[oilType]
        let tomorrowPrice = this.state.tomorrowPrice[oilType]

        let type = 'normal'

        if(parseFloat(tomorrowPrice) > parseFloat(price)){
          type = 'up'
        }else
        if(parseFloat(tomorrowPrice) < parseFloat(price)){
          type = 'down'
        }

        return (
          <TableRow key={oilType}>
            <TableRowColumn className="name">{name}</TableRowColumn>
            <TableRowColumn className="price">{price}</TableRowColumn>
            <TableRowColumn className={'price price-new '+type}>
              <i className={'icon fa fa-chevron-'+type} aria-hidden="true"></i>
              {tomorrowPrice}
            </TableRowColumn>
          </TableRow>
        )
    });

    let year = parseInt(moment().format("YYYY"))+543

    let date = moment().format("DD MMMM ") + year

    return (
        <div className="oil-table">
          <AppBar
            className="bar"
            title={this.state.oilprice.operators[this.state.currentOperator]}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />

          {this.state.loading ? 
          (<div className="loading">
            <CircularProgress/>
          </div>) : (
            <div>
              <Table className="table">
                <TableHeader
                  displaySelectAll={false}
                  adjustForCheckbox={false}
                >
                  <TableRow>
                    <TableHeaderColumn className="name">{date}</TableHeaderColumn>
                    <TableHeaderColumn className="price">Today</TableHeaderColumn>
                    <TableHeaderColumn className="price">Tomorrow</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                >
                  {oilTable}
                </TableBody>
              </Table>

              
              <Drawer 
              className="sidebar"
              docked={false}
              open={this.state.open}
              containerStyle={{
                backgroundColor:"#2d2c32",
                color:"#FFF"
              }}
              onRequestChange={(open) => this.setState({open})}
              >
                {operators}
              </Drawer>
            </div>
          )
          
          }

        </div>
    );
  }
}

export default About;
