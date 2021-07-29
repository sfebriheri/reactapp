import React from 'react';
import { Text, View, TouchableOpacity,ImageBackground,ScrollView,Alert,ActivityIndicator} from 'react-native';
import { FormInput,Input } from 'react-native-elements'
import * as firebase from 'firebase';
import Config from '../../../config'
import T from '@functions/translation';
import css from '@styles/global';
import ButtonUNI from '../../Components/Buttons/AccentButton';
import Tabbar from '@components/Tabbar'
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;


class LoginScreen extends React.Component {

  static navigationOptions = {
    
    title: 'Login',
    header: null,
  };

  
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      isReqUserVarification:false

    };
    this.tabSelector=this.tabSelector.bind(this);
    this.loginWithFacebook=this.loginWithFacebook.bind(this);
    this.signInWithGoogleAsync=this.signInWithGoogleAsync.bind(this);
    this.showActivityIndicator=this.showActivityIndicator.bind(this); 
    this.onLoginPress=this.onLoginPress.bind(this)
  }

  
  checkAllowedUsers()
  {
    users=[]
    this.props.allowedUsers.map((item)=>{
      users.push(item.email)
       
    })
    if(users.indexOf(this.state.email) > -1){
      this.onLoginPress()
     }else{
       alert(T.userWithNoAccess)
     }
  }

  onLoginPress()
  {
    this.setState({
      loading: true
    })

    const {email, password} = this.state;
    var _this=this;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      _this.setState({
        loading: false
      })

    }).catch(function(error){
    
      Alert.alert(error.message)
      _this.setState({
        loading: false
      })
      
    })
    
  }

  async loginWithFacebook() {

    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(Config.loginSetup.facebookID, { permissions: ['public_profile'] })
        if (type == 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential(token)
          firebase.auth().signInWithCredential(credential).catch((error) => {

        })
      }
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        iosClientId: Config.loginSetup.googleIOSid,
        androidClientId: Config.loginSetup.googleAndroidId,
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        return result.accessToken;
      } else {
        return {cancelled: true};
      }
    } catch(e) {
      return {error: true};
    }
  }



onSignInPress()
{
  this.props.navigation.navigate('SignUp')
}

showActivityIndicator(animating){
  if(animating)
  {
      return(
        <View style={css.layout.activityIndicatorView2}>  
          <View style={css.layout.activitiIndicatorContainer2}>
              <ActivityIndicator
                    animating={animating}
                    style={css.layout.activityIndicator}
                    color='white'
                    size="small"
                    hidesWhenStopped={true}/>
          </View>
      </View>
      )
       
  }
}
shouldComponentUpdate() {
  return false
  
}

renderButtonOrLoading()
  {
    return <View>
      <ButtonUNI 
        onPress={this.props.isReqUserVarification?this.checkAllowedUsers.bind(this):this.onLoginPress}
        color1='#f947ac'
        color2='#ff6569'
        style={css.layout.loginButton}
        title={T.login}
        textStyle={css.layout.loginBtnTxt}
        />
        {this.showActivityIndicator(this.state.loading)}
    <View style={css.layout.forgetPassAndCAParent}>
        <TouchableOpacity onPress={this.forgotPassword.bind(this)} >
            <Text style={css.layout.forgetPass}>{T.forgetPass}</Text>
        </TouchableOpacity>
        <ConditionalDisplay condition={!this.props.isReqUserVarification}>
          <TouchableOpacity onPress={this.onSignInPress.bind(this)} >
                <Text  style={css.layout.createAccount}>{T.createAccount}</Text>
          </TouchableOpacity>
        </ConditionalDisplay>
        
      </View>
    </View>
  }


  forgotPassword(){
    this.props.navigation.navigate('ForgetPassword')
  }

  tabSelector(selected){
    if(selected == "fb")
    {
      (async () => {
        await this.loginWithFacebook();
      })();
      
    }
    else if(selected == 'google')
    {
      (async () => {
        await this.signInWithGoogleAsync();
      })();
    }
  }

  render() {

    return (
    <ImageBackground
      source={require('@images/login_bg.jpg')}
      style={css.layout.imageBackground}
    >
        <ScrollView>  
        <View style={{ alignItems:'center',marginTop:css.isIphoneX()?120:60}}>
            <Text style={css.layout.welcomeText}>
                {Config.loginSetup.welcomeText}
            </Text>
          </View>
          <View style={css.layout.loginContainer}>
            <Text style={css.layout.emailTxtLogin}>{T.email}</Text>
                <FormInput
                  value={this.state.email}
                  ref={email => this.email = email}
                  autoCapitalize = 'none'
                  onChangeText={text => this.setState({email:text})}
                  underlineColorAndroid="#ff0000"
                  
                  
                />
                <Text style={[css.layout.emailTxtLogin,{marginTop:25}]}>{T.password}</Text>
                <FormInput
                  secureTextEntry
                  value={this.state.password}
                  ref={password => this.password = password}
                  onChangeText={(text) => this.setState({password:text})}
                  inputStyle={{color:'white'}}
      
                />
          </View>
          {this.renderButtonOrLoading()}
        </ScrollView>  
        <ConditionalDisplay condition={!this.props.isReqUserVarification}>
            <Tabbar
              animating={this.state.animating}
              isRoot={false}
              tintColor={"#ffffff"}
              accentColor={"#f947ac"}
              lineColor={"#ffffff"}
              default={"email"}
              tabRarStyle={"tabBar4"}
              selector={this.tabSelector}
              options={[{title:"Email","id":"email"},Config.loginSetup.facebookLogin?{title:"Facebook","id":"fb"}:{},Config.loginSetup.googleLogin?{title:"Google","id":"google"}:{}]}
            />
         </ConditionalDisplay>
        
    </ImageBackground>
    );
  }
}

export default LoginScreen;
