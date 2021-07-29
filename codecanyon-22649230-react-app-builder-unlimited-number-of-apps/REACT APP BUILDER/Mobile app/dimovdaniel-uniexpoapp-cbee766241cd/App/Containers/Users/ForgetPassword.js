import React, { Component} from "react";
import { Text, View, TouchableOpacity,ScrollView} from 'react-native';
import { FormInput } from 'react-native-elements'
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import SmartIcon from '@smarticon';
import ButtonUNI from '../../Components/Buttons/AccentButton';
  

export default class ForgetPassword extends Component {
    static navigationOptions = {
        title: '',
        header: null
      };
    constructor(props) {
        super(props);
        this.state = {
            userEmail:""
        };
    
    }  
   
resetPasswordPressed(){
    firebase.auth().sendPasswordResetEmail(this.state.userEmail).then(function() {
       //Email sent.
      alert("Email sent");
      }).catch(function(error) {
       alert(error.message)
      });
      
}

backToLogin()
{
  this.props.navigation.pop();
}
  
    render(){
        return(
                <ScrollView style={{backgroundColor:'white'}}>  
                  <TouchableOpacity 
                    onPress={this.backToLogin.bind(this)}
                    style={{marginTop:css.isIphoneX()?60:30,marginLeft:15}}>
                      <SmartIcon defaultIcons={"MaterialIcons"} name={"FeChevronLeft"} size={30} color='black'/>
                  </TouchableOpacity>
                  <Text style={css.layout.forgetPassTxt}>
                    {T.forgetPassInView}
                  </Text>
                  <Text style={css.layout.subForgetPassTxt}>
                      {T.forgetPassEmail}
                  </Text>
                  <View style={{marginLeft:30,marginRight:30}}>
                  <Text style={css.layout.emailFPTxt}>{T.email}</Text>
                    <FormInput
                        value={this.state.email}
                        ref={email => this.email = email}
                        autoCapitalize = 'none'
                        onChangeText={text => this.setState({email:text})}
                        inputStyle={{color:'rgb(233, 69, 120)',fontSize:20}}
                    
                    />
                    <ButtonUNI 
                        onPress={this.resetPasswordPressed.bind(this)}
                        color1='rgb(233, 69, 120)'
                        color2='rgb(233, 69, 120)'
                        style={[css.layout.signUpButtonContainer,{marginTop:45}]}
                        title={T.register}
                        title={T.sendPass}
                        textStyle={[css.layout.signUpButtonText,{margin:18}]}
                    />
                  </View>
                  
                </ScrollView> 
            );
    }
}
