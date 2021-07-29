import React, { Component, PropTypes } from "react";
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, TextInput,Image,ScrollView,Alert} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import Config from '../../../config'
import T from '@functions/translation';
import css from '@styles/global';
import AppEventEmitter from "@functions/emitter"
import StackNavigator from 'react-navigation';
import Login from '@containers/Users/LoginScreen'
import { ImagePicker } from 'expo';
import SmartIcon from '@smarticon';
import ButtonUNI from '../../Components/Buttons/AccentButton';
import StateButton from '../../Components/Buttons/StateButton';
import Navbar from '@components/Navbar';


const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class ProfileOption1 extends Component {

    static navigationOptions = {
        title: '',
        header: null,
      };

      
    constructor(props) {
        var isDataInProps = props.navigation.state.params == null; 
        super(props);
        
        var theProps = isDataInProps ? "" : props.navigation.state.params;
        this.state = {
            userEmail:"",
            isLoggedIn:false,
            waitingForStatus:true,
            progress: 1,
            name:"",
            avatar: "",
            isReady: false,
            description:"",
            bio:"",
            uuid: theProps.data,
            showFollow: theProps.showFollow,
            showBackButton: theProps.showBackButton,
            numberOfFollowers:0,
            numberOfFollowing:0,
            listOf:theProps.listOf,
            exist:false,
            fullname:""

            
         };

         this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
         this.editProfile=this.editProfile.bind(this);
         this.navigationButtons=this.navigationButtons.bind(this);
         this.getUserOtherdata=this.getUserOtherdata.bind(this);
         this.setUpUserDataFromFB=this.setUpUserDataFromFB.bind(this);
         this.back=this.back.bind(this);
         this.openListFollowersOfUsers=this.openListFollowersOfUsers.bind(this);
         this.openListFollowingOfUsers=this.openListFollowingOfUsers.bind(this);
         this.showEditProfileButton=this.showEditProfileButton.bind(this);
         this.showFollowButton=this.showFollowButton.bind(this);
         this.follow=this.follow.bind(this);
         this.unfollow=this.unfollow.bind(this);
         this.followOrUnfollowButton=this.followOrUnfollowButton.bind(this);
         this.currentUserFollowing=this.currentUserFollowing.bind(this);
         this.followedUserFollowers=this.followedUserFollowers.bind(this);
         this.deleteFromCurrentUser= this.deleteFromCurrentUser.bind(this);
         this.deleteFromFollowedUser=this.deleteFromFollowedUser.bind(this);
         this.getLenghtofFollowers=this.getLenghtofFollowers.bind(this)
         this.getLenghtofFollowing=this.getLenghtofFollowing.bind(this)
         this.openChat=this.openChat.bind(this)
    }  

    

    componentDidMount(){
        
        AppEventEmitter.addListener('profileUpdate',  this.getUserOtherdata.bind(this));
        AppEventEmitter.addListener('profileUpdateDefInfo', this.setUpUserDataFromFB.bind(this));
        
        this.setUpUserDataFromFB()
        
    }
     

    setUpUserDataFromFB(){
        firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
    }

      setUpCurrentUser(user){
          
        if (user != null) {
            // User is signed in.
            this.setState({
                userEmail:user.email,
                avatar:user.photoURL != null?user.photoURL:"",
                waitingForStatus:false,
                isLoggedIn:true,
                name : user.displayName
            })
            this.getUserOtherdata()
            this.getLenghtofFollowers()
            this.getLenghtofFollowing()
            if(this.state.showFollow){
                this.followOrUnfollowButton()
            }

        } else {
            
            // User is not signed in
            this.setState({
                waitingForStatus:false,
                isLoggedIn:false,
            })
        }
    }
    editProfile(){
        this.props.navigation.navigate('ProfileSettings')
    }

    back()
    {
        this.props.navigation.pop();
    }
    getLenghtofFollowers(){
        var _this=this;
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        var data=[];
        firebase.database().ref('/users/'+userId+"/followers/").once('value', function(snapshot) {
            
            snapshot.forEach(childSnap=>{
                var user=childSnap.val();
                user.uid=childSnap.key;
                data.push(user)
            })
            _this.setState({
                numberOfFollowers: data.length
              })
          });
      }
      getLenghtofFollowing(){
        var _this=this;
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        var data=[];
        firebase.database().ref('/users/'+userId+"/following/").once('value', function(snapshot) {
            
            snapshot.forEach(childSnap=>{
                var user=childSnap.val();
                user.uid=childSnap.key;
                data.push(user)
            })
            _this.setState({
                numberOfFollowing: data.length
              })
          });
      }

    showBackButton(){
        if(this.state.showBackButton){
            return (<View style={{marginLeft:15,marginTop:10}}>
            <View style={{marginTop:css.isIphoneX()?60:30,width:30,height:30}}>
                <TouchableOpacity 
                    onPress={this.back}>
                    
                </TouchableOpacity>
            </View>
        </View>)
        }else{
            return <View></View>
        }
    }

   
    showFollowButton(){
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        if(userId != firebase.auth().currentUser.uid){
            return(
            
                <Button
                    onPress={this.state.exist  == true?this.unfollow:this.follow}
                    backgroundColor='#ff00ff'
                    style={[css.layout.signUpButtonContainer2,{marginTop:25}]}
                    title={this.state.exist  == true?'Unfollow':'Follow'}
                    rounded
            />
            
            )
          
     }else{
            
            return <View></View>
        }
    }
    followOrUnfollowButton(){
        var userId = this.state.uuid
        var _this=this;
        //chek if user exist in Follow list 
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/').child(userId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            _this.setState({
                exist:exists
            })
        });

    }

 

    follow(){
        this.setState({
            exist:true
        })
        
        //Write in current user in  following 
        this.currentUserFollowing()
        //Write in clicked user in followers
        this.followedUserFollowers()


    }

    currentUserFollowing(){
        var userId = this.state.uuid
        
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/'+userId).set({
            username: this.state.name,
            avatar: this.state.avatar == null?"":this.state.avatar
            
          });
    }

    followedUserFollowers(){
        var userId = this.state.uuid
        
        firebase.database().ref('/users/'+userId+'/followers/'+firebase.auth().currentUser.uid).set({
            username: firebase.auth().currentUser.displayName,
            avatar: firebase.auth().currentUser.photoURL == null?"":firebase.auth().currentUser.photoURL
            
          });
    }


    unfollow(){
        this.setState({
            exist:false
        })
       //Delete from current user
       this.deleteFromCurrentUser()
       //Delete from followed user
       this.deleteFromFollowedUser()


    }
    deleteFromCurrentUser(){
        var userId = this.state.uuid
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/following/'+userId).remove()
    }
    deleteFromFollowedUser(){
        var userId = this.state.uuid
        firebase.database().ref('/users/'+userId+'/followers/'+firebase.auth().currentUser.uid).remove()
    }
    
    openChat(){
        this.props.navigation.navigate('Chat', {selectedUser:this.state.uuid});
        
    }


    showEditProfileButton(){
        if(this.state.uuid != null)
        {
            return (
                <View style={{marginTop:css.isIphoneX()?40:30,width:30,height:30}}>
                    <TouchableOpacity 
                        onPress={this.openChat}>
                        <SmartIcon defaultIcons={"MaterialIcons"} name={"FeMessageCircle"}  size={25} color='white'/>
                    </TouchableOpacity>
                </View>
            )
            
        } else
        {
            return (
            <View style={{marginTop:css.isIphoneX()?40:30,width:30,height:30}}>
                <TouchableOpacity 
                    onPress={this.editProfile}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeMoreVertical"}  size={25} color='white'/>
                </TouchableOpacity>
            </View>
            )
        }
    }

   


    navigationButtons(){
      return( 
           <View style={css.layout.navigationBtnParent}>
                {this.showBackButton()}
                <View style={{marginRight:15,marginTop:16}}>
                   {this.showEditProfileButton()}
                </View>
            </View>
               );
    }

    getUserOtherdata(){
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
      
        var _this=this;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            
            
            _this.setState({
                description:snapshot.val().description,
                bio:snapshot.val().bio,
                userEmail:snapshot.val().email,
                avatar:snapshot.val().avatar,
                name : snapshot.val().username,
                fullname: snapshot.val().fullName,

            })
        })
        
    }

    openListFollowersOfUsers(){
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        var screenToGoTo=Config.profileScreensInSubMenu?'ListOfUsersSub':'ListOfUsers';
        this.props.navigation.navigate(screenToGoTo,{listOf:'followers',userId:userId})
    }

    openListFollowingOfUsers(){
        var userId = this.state.uuid!=null ? this.state.uuid:firebase.auth().currentUser.uid;
        var screenToGoTo=Config.profileScreensInSubMenu?'ListOfUsersSub':'ListOfUsers';
        this.props.navigation.navigate(screenToGoTo,{listOf:'following',userId:userId})
    }

    render(){
        if(this.state.isLoggedIn){
            //Show Profile
            return( 
               
                <ImageBackground
                    source={require('@images/login_bg.jpg')}
                    style={css.layout.imageBackground}
                >
                 <Navbar
                    navigation={this.props.navigation}
                    isRoot={false}
                    detailsView={true}
                    
                />
                    <ScrollView>
                        {this.navigationButtons()}
                        <ConditionalDisplay condition={this.state.avatar} >
                            <ImageBackground
                                style={css.layout.profileImage}
                                source={{uri: this.state.avatar}}
                            >
                            {this.navigationButtons()}
                            </ImageBackground>
                        </ConditionalDisplay>
                        
                        <View style={{marginTop:280}}>
                            
                            {/* INFO BOXES - HIDDEN FOR NOW*/}
                            <ConditionalDisplay condition={false} >
                                <View style={css.layout.stateButtonParent}>
                                    <StateButton
                                        onPress={this.openListFollowersOfUsers}
                                        title={T.followers}
                                        number={this.state.numberOfFollowers}
                                        style={css.layout.stateBtnNumber}
                                        disabled={this.state.numberOfFollowers != 0?false:true}
                                    />
                                    <StateButton
                                        onPress={this.openListFollowingOfUsers}
                                        title={T.following}
                                        number={this.state.numberOfFollowing}
                                        style={css.layout.stateBtnNumber}
                                        disabled={this.state.numberOfFollowing != 0?false:true}
                                    />
                                    <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
                                        <TouchableOpacity onPress={this.openInstagram}>
                                            <View style={{alignItems: 'center'}}>
                                                <SmartIcon defaultIcons={"MaterialIcons"} name={"FeMessageCircle"} size={22} color='white'/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ConditionalDisplay>

                             
                            <View style={css.layout.profileInfoContainer}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text numberOfLines={2} style={css.layout.nameProf1}>{this.state.fullname}</Text>
                                   {this.showFollowButton()}
                                    
                                </View>
                                <Text style={css.layout.bio}>{this.state.bio!=null?this.state.bio:"User havent't entered biography about themself"}</Text>
                                <Text numberOfLines={3} style={css.layout.descrption2}>{this.state.description!=null?this.state.description:"User havent't entered info about themself"}</Text>
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
           return(<Login navigation={this.props.navigation}  />)
        }
    }
}