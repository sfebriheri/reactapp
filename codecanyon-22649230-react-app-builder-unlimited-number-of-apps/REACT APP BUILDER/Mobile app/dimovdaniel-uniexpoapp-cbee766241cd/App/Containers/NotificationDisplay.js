/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component,PropTypes} from "react";
import {WebView,View} from "react-native";
import Navbar from '@components/Navbar'


export default class NotificationDisplay extends Component {


  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps=props.navigation.state.params==null;

    super(props);
    var theProps=isDataInProps?props:props.navigation.state.params;
   
    this.state = {
      pr:theProps,
    }
  }



  render() {
      var bootstrapedHTML='<html>'+
       '<head>'+
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'+
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'+
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'+
        '</head>'+
        '<body><div class="container"><div class="row">'
            +this.props.navigation.state.params.data+
        '</div></div></body>'+
      '</html>';
    return (
        <View style={{flex:1,flexDirection:'column'}}> 
            <View>
              <Navbar navigation={this.props.navigation} detailsView={true} isRoot={false} />
            </View>
             
            <View style={{flex:1}}>
              <WebView
                  scalesPageToFit={false}
                  javaScriptEnabled={true}
                  source={{html:bootstrapedHTML}}
              />
            </View>
        </View>



     
    );
  }
}
