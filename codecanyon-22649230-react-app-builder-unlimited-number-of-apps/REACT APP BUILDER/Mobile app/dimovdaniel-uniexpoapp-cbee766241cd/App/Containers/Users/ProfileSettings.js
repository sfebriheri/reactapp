import React, { Component } from "react";
import { Text, View, TouchableOpacity,ImageBackground, TextInput,Image,ScrollView,Alert,ActivityIndicator} from 'react-native';
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import { ImagePicker,Permissions } from 'expo';
import ButtonUNI from '../../Components/Buttons/AccentButton';
import SmartIcon from '@smarticon';


export default class ProfileSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEmail:"",
            isLoggedIn:false,
            waitingForStatus:true,
            progress: 1,
            name:"",
            avatar:"",
            isReady: false,
            description:"",
            animating:false,
            instagram:"",
            facebook:"",
            updateProf:false,
            bio:"",
            fullName:""
            
         };

         this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
         this.updateProfile=this.updateProfile.bind(this);
         this.writeUserData=this.writeUserData.bind(this);
         this.back=this.back.bind(this);
    }  

    componentDidMount(){
        //Check if user is logged in
        AppEventEmitter.addListener('', firebase.auth().onAuthStateChanged(this.setUpCurrentUser));
        
    }

    checkUserState(){
        this.setState({
            waitingForStatus:false
        });
    }

    
    
      setUpCurrentUser(user){
        if (user != null) {
         // User is signed in.
         var userId = firebase.auth().currentUser.uid;
        var _this=this;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            _this.setState({
                description:snapshot.val().description,
                instagram:snapshot.val().instagram,
                facebook:snapshot.val().facebook,
                bio:snapshot.val().bio,
                userEmail:snapshot.val().email,
                avatar:user.photoURL != null?user.photoURL:"",
                waitingForStatus:false,
                isLoggedIn:true,
                name : snapshot.val().username,
                fullName: snapshot.val().fullName
            })
        })

        } else {
            
            // User is not signed in
            this.setState({
                waitingForStatus:false,
                isLoggedIn:false,
            })
        }
    }

     updateProfile(){
        var user = firebase.auth().currentUser;
        this.writeUserData(user.uid,this.state.name, this.state.userEmail,this.state.description,this.state.facebook,this.state.instagram,this.state.bio,this.state.avatar,this.state.fullName);
        this.setState({
            updateProf:true
        })
        var _this=this;
        user.updateProfile({
          displayName: this.state.name
        }).then(function()  {
          // Update successful.
          AppEventEmitter.emit('profileUpdate');
          AppEventEmitter.emit('profileUpdateDefInfo');
          alert("Your informations are updated")
        _this.setState({
            updateProf:false
        })
        }).catch(function(error) {
          // An error happened.
         alert(error)
        });
        
     }

    

    logOutPress(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        
           }, function(error) {
            // An error happened.
          });
          this.setState({
                
            waitingForStatus:false,
            isLoggedIn:false
        })
    }

    _pickImage = async () => {
     
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality:1,
        });
        
        if (!result.cancelled) {
         await this.uploadAsFile(result.uri, (progress) => {})
        }
      }

      uploadAsFile = async (uri, progressCallback) => {
        const response = await fetch(uri);
        this.setState({
            animating:true
        })
        const blob = await response.blob();
        var metadata = {
          contentType: 'image/png',
        };
       
        let name = new Date().getTime() + "-media.png"
        const ref = firebase
          .storage()
          .ref()
          .child('usersphotos/' + name)
       

        const task = ref.put(blob, metadata);
      
        return new Promise((resolve, reject) => {
          task.on(
            'state_changed',
            (snapshot) => {
              progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
      
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               console.log(progress);
            },
            (error) => {reject(error)
                alert(error)
            }, /* this is where you would put an error callback! */
            () => {
               
              var downloadURL = task.snapshot.downloadURL;
              var user = firebase.auth().currentUser;

                
                user.updateProfile({
                    photoURL: downloadURL
                }).then(function() {
                
                    // Update successful.
                AppEventEmitter.emit('profileUpdateDefInfo');
                alert("Your picture is updated")
                }).catch(function(error) {
                // An error happened.
                    alert(error)
                });
                this.setState({
                    animating:false,
                    avatar:downloadURL
                })
            }
          );
        });
      }

      writeUserData(userId, name, email,description,facebook,instagram,bio,avatar,fullName) {
          
        firebase.database().ref('users/' + userId).set({
          username: name,
          email: email,
          description:description,
          facebook:facebook,
          instagram:instagram,
          bio:bio,
          avatar:avatar,
          fullName:fullName
        });
    }

    back()
    {
        this.props.navigation.pop();
    }

    showActivityIndicator(animating){
        if(animating)
        {
            return(
            <View style={css.layout.activitiIndicatorContainer2}>
                <ActivityIndicator
                      animating={animating}
                      style={css.layout.activityIndicator}
                      color={css.dynamic.general.buttonColor}
                      size="small"
                      hidesWhenStopped={true}/>
            </View>
            )
             
        }
    }


    render(){
        if(this.state.isLoggedIn){
            //Show Profile
            return( 
                <ImageBackground
                    source={require('@images/login_bg.jpg')}
                    style={css.layout.imageBackground}
                >
                    <ScrollView>
                        <View style={{marginLeft:15}}>
                            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30}}>
                                <TouchableOpacity 
                                    onPress={this.back}>
                                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeX"} size={31} color='white'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[css.layout.signUpContainer,{marginTop:css.isIphoneX()?70:20, height:1070}]}>
                            <View style={css.layout.profileImageParent}>
                                <TouchableOpacity
                                    onPress={this._pickImage}>
                                    <Image 
                                        style={css.layout.profileImageEdit}
                                        source={this.state.avatar.length>3?{uri: this.state.avatar}:require('@images/blank-image.jpg')}
                                    />
                            </TouchableOpacity>
                                    {this.showActivityIndicator(this.state.animating)}
                                </View>
                                
                                <Text style={css.layout.emailAndPasswordText}>{T.firstAndLastname.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.fullName}
                                    onChangeText={fullName => this.setState({fullName})}
                                    placeholder = {T.enterFullname}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                 <Text style={css.layout.emailAndPasswordText}>{T.username.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.name}
                                    onChangeText={name => this.setState({name})}
                                    placeholder = {T.enterUsername}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.email.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.userEmail}
                                    onChangeText={userEmail => this.setState({userEmail})}
                                    placeholder = {T.enterMail}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.bio.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.bio}
                                    onChangeText={bio => this.setState({bio})}
                                    placeholder = {T.enterBio}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text  style={css.layout.emailAndPasswordText}>{T.description.toUpperCase()}</Text>
                                <TextInput
                                    multiline={true} 
                                    numberOfLines={4}
                                    value = {this.state.description}
                                    onChangeText={description => this.setState({description})}
                                    placeholder = {T.enterDesc}
                                    autoCapitalize = 'none'
                                    style={css.layout.descriptionTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.facebook.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.facebook}
                                    onChangeText={facebook => this.setState({facebook})}
                                    placeholder = {T.enterfb}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <Text style={css.layout.emailAndPasswordText}>{T.instagram.toUpperCase()}</Text>
                                <TextInput
                                    value = {this.state.instagram}
                                    onChangeText={instagram => this.setState({instagram})}
                                    placeholder = {T.enterInsta}
                                    autoCapitalize = 'none'
                                    style={css.layout.emailAndPasswordTextInput}
                                />
                                <View style={{marginTop: 20,alignItems:'center'}}>
                                {this.showActivityIndicator(this.state.updateProf)}
                                    <ButtonUNI 
                                        onPress={this.updateProfile}
                                        color1='rgb(233, 69, 120)'
                                        color2='rgb(233, 69, 120)'
                                        style={[css.layout.signUpButtonContainer,{marginTop:25}]}
                                        title={T.profileUpdate}
                                        textStyle={[css.layout.signUpButtonText,{margin:12}]}
                                    />
                                    
                                    <View style={css.layout.line}/>
                                        <View style={{alignItems:'center'}}>
                                            <TouchableOpacity
                                                onPress={this.logOutPress.bind(this)}>
                                                    <Text style={css.layout.alreadyHaveAccountTxt}>{T.logout}</Text>
                                            </TouchableOpacity>
                                        </View>
                                </View>
                            </View>
                    </ScrollView> 
                </ImageBackground>
                );
        }else if(this.state.waitingForStatus){
            //Show empty window
            return( <View/>);
        }else if(!this.state.isLoggedIn){
            //Show login
           return(<Login navigation={this.props.navigation} isReqUserVarification={this.props.isReqUserVarification} allowedUsers={this.props.allowedUsers}/>)
        }
    }
}