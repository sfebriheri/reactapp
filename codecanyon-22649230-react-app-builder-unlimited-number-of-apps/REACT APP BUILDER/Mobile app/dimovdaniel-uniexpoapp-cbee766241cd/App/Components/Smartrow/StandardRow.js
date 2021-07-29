'use strict';

import React, {Component} from "react";
import {Text, View, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class StandardRow extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  render() {
    return (
      <View>
        <View style={[style.standardRow,{backgroundColor:css.dynamic.rows.backgroundColor}]}>
          <View style={style.standardRowImageIconArea} >
            <Image style={style.standardRowImage} source={{uri:this.props.image}} />
          </View>
          <View style={style.standardRowTitleArea} >
            <Text  style={[{color:css.dynamic.rows.titleColorOnRow}]} >{this.props.title}</Text>
          </View>
          <View style={style.standardRowArrowArea} >
            <MaterialIcons name={"navigate-next"} size={24} style={{ color: css.dynamic.rows.arrowColor }} />
          </View>
        </View>
        <View style={[style.standardRowSeparator,{backgroundColor:css.dynamic.rows.backgroundColor}]}><View style={[style.border,{backgroundColor:css.dynamic.rows.separatorColor}]} ></View></View>
      </View>
    );
  }
}
