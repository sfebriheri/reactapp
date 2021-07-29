'use strict';

import React, {Component} from "react";
import {Text, View, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import moment from 'moment';

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  render() {
    var rowsStyle=css.dynamic.rows;
    return (
      <View>
        <View style={[style.standardRow,{backgroundColor:css.dynamic.rows.backgroundColor}]}>
          <View style={style.standardRowImageIconArea} >
            <Image style={style.userImage} source={this.props.image != ""?{uri:this.props.image}:require('@images/blank-image.jpg')} />
          </View>
          <View style={style.standardRowTitleAreaUsers} >
            <View style={{flexDirection:"row",backgroundColor:"red",marginTop:10}}>
              <Text  style={[style.nameAndLastname,{color:rowsStyle.titleColorOnRow}]} >{this.props.title}</Text>
              <Text  style={[style.username,{color:rowsStyle.titleColorOnRow,marginLeft:20}]} >{moment(this.props.lastChat).fromNow()}</Text>
            </View>
            <Text  style={[style.username,{color:rowsStyle.titleColorOnRow,marginLeft:20}]} >{this.props.subtitle.text}</Text>
          </View>
        </View>
        <View style={[style.standardRowSeparator,{backgroundColor:css.dynamic.rows.backgroundColor}]}>
        <View style={[style.border,{backgroundColor:css.dynamic.rows.separatorColor}]} ></View></View>
      </View>
    );
  }
}
