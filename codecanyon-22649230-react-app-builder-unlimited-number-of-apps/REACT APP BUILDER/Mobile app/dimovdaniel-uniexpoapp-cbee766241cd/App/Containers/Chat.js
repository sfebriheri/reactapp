/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component,PropTypes} from "react";
import {View,Text,TouchableOpacity,Image,Modal,ActivityIndicator} from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global';
import * as firebase from 'firebase';
import { GiftedChat,MessageImage,Send,Bubble,InputToolbar,Time } from 'react-native-gifted-chat'
import SmartIcon from '@smarticon';
import { ImagePicker,Permissions } from 'expo';
import {RkButton, RkStyleSheet,RkText} from 'react-native-ui-kitten';
import moment from 'moment';


export default class Chat extends Component {

  static navigationOptions = {
    title: '',
    header: null,
  };

  //The constructor
  constructor(props) {
    super(props);
    this.state = {
      avatar:"",
      selectedUserAvatar:"",
      selectedUserFullname:"",
      name:"",
      userID:firebase.auth().currentUser.uid,
      messages: [],
      imageUrl:"",
      animating:false,
      showImageViewer:false,
      currentMessage: [],
      currentMessageText:[],
      typingText:"Enter your message",
      selectedUser:this.props.navigation.state.params.selectedUser,
      chatID: firebase.auth().currentUser.uid > this.props.navigation.state.params.selectedUser?firebase.auth().currentUser.uid + this.props.navigation.state.params.selectedUser:this.props.navigation.state.params.selectedUser + firebase.auth().currentUser.uid
    }
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
    this.renderAddImage=this.renderAddImage.bind(this);
    this.getDataForSelectedUser=this.getDataForSelectedUser.bind(this);
    this.addToChatsInDataBase=this.addToChatsInDataBase.bind(this);
    this.writeChatsInDB=this.writeChatsInDB.bind(this)
    
  }



  componentDidMount(){
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser);
    this.getMessages();
    this.getDataForSelectedUser();
  }

  /**
   * SET THE USER
   * @param object user 
   */
  setUpCurrentUser(user){   
    if (user != null) {
        // User is signed in.
        this.setState({
            avatar:user.photoURL != null?user.photoURL:"",
            name : user.displayName
        })
    } else {
        // User is not signed in  
    }
  }

 /**
  * Get the message from database
  */ 
  getMessages(){
    var _this=this;
    
    
    firebase.database().ref('messages/' + this.state.chatID).on('value', function(snapshot) {
        var theMessages=[]
        snapshot.forEach(function(childSnapshot) {
            var messageToAdd=childSnapshot.val()
            messageToAdd.id=childSnapshot.key;
            theMessages.push(messageToAdd);
        });
        _this.setState({
            messages:theMessages.reverse()
        })
      });

  }

  /**
   * Image Picker
   */
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


  /**
   * Upload the file picked from image picker
   */
  uploadAsFile = async (uri, progressCallback) => {
    const response = await fetch(uri);
    var _this=this;
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
      .child('chatPhotos/' + name)
   

    const task = ref.put(blob, metadata);
  
    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
  
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)
           
        },
        (error) => {reject(error)
            alert(error)
        }, /* this is where you would put an error callback! */
        () => {
           
          

          task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            var fullMessage = {
              _id: Math.random(),
              text: '',
              createdAt: (new Date()).getTime(),
              image:downloadURL,
              user: {
                _id: _this.state.userID,
                name: _this.state.name,
                avatar: _this.state.avatar,
              },
            }

            firebase.database().ref('messages/' + _this.state.chatID).push().set(fullMessage)

          _this.setState({
            imageUrl:downloadURL,
            animating:false
          })


          });

         
          
          
        }
      );
    });
  }

  /**
   * Render add image icon 
   */
    renderAddImage(){
      return (
        <View style={{marginBottom:5,opacity:0.7,padding:5}}>
          <TouchableOpacity 
            onPress={this._pickImage}>
            <SmartIcon defaultIcons={"MaterialIcons"} name={"MdPhoto"} size={25} color='white'/>
          </TouchableOpacity>
        </View>
        
      )
    }


  /**
   * Render message bubble
   */
    renderBubble = (props) => {
      let wrapperStyle = {
          left: {
              padding: 10,
              backgroundColor: '#2E3359',
          },
          right: {
              padding: 10,
              backgroundColor: '#2E3359',
          }
      };
      let textStyle = {
          left: {
              color: '#ffffff',
              fontSize: 16
          },
          right: {
              color: '#ffffff',
              fontSize: 16,
          }
      };

      let wrapperStyleQuestionBubble = {
        backgroundColor: '#ffffff',
        borderColor: '#40216F',
        borderWidth: 3,
        borderRadius: 10,
      }

      let wrapperStyleQuestionBubbleTextColor = '#40216F';

      let TouchableOpacityBubbleStyle = {
          borderColor: '#FF33AA',
          borderWidth: 3,
          backgroundColor: '#33AAFF',
      }

      if (props.currentMessage.richCard) {

          wrapperStyle.left = wrapperStyleQuestionBubble;
          textStyle.left.color = wrapperStyleQuestionBubbleTextColor;

          return (
              <TouchableOpacity>
                  <Bubble
                      {...props}
                      onPress={() => props.sendRichCard(props.currentMessage)}
                      wrapperStyle={wrapperStyle}
                      textStyle={textStyle}/>
              </TouchableOpacity>
          );
      }

      return (
          <Bubble
              {...props}
              wrapperStyle={wrapperStyle}
              textStyle={textStyle}/>
      );
  }

  /**
   * Render the input toolbar 
   * @param {*} props 
   */
  renderInputToolbar(props) {
    return <InputToolbar {...props} containerStyle={{backgroundColor:"#101743"}}  />;
  }

  /**
   * Render Time when the message was send
   */
  renderTime(props) {
    const timeStyle = {
    color: 'blue'
    };
    return <Time {...props} textStyle={{left: timeStyle, right: timeStyle}}/>
    }
  
  /**
   * Render footer
   * @param {} props 
   */
  renderFooter(props) {
    return (
        <ActivityIndicator
            animating={this.state.animating}
            style={{flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            marginRight:20}}
            color={"white"}
            size="small"
            hidesWhenStopped={true}/>
      )
    
   
  }

  

 /**
  * Render the message when the message has image
  * @param {*} props 
  */ 
  _renderMessageImage(props){
    return(
      <Image
      style={{
        borderRadius: 3,
        marginLeft: 0,
        marginRight: 0,
        width:100,
        height:100,
      }}
      source={{uri: props.currentMessage.image}}
    />
    );
  }

  /**
   * Get data for the selected user
   */
  getDataForSelectedUser(){
    var _this=this;
    firebase.database().ref('/users/' + this.state.selectedUser).once('value').then(function(snapshot) {
        _this.setState({
            selectedUserAvatar:snapshot.val().avatar,
            selectedUserFullname: snapshot.val().fullName,
          })
    })
    
  }

  /**
   * Write in CHATS
   * @param {string} user1 
   * @param {string} user2 
   */
  writeChatsInDB(user1,user2){
    firebase.database().ref('chats/' + user1 + "/" + user2 ).update({
      avatar:user1==firebase.auth().currentUser.uid?this.state.selectedUserAvatar:this.state.avatar,
      name:user1==firebase.auth().currentUser.uid?this.state.selectedUserFullname:this.state.name,
      lastChat:Date.now(),
      id:user1==firebase.auth().currentUser.uid?user2:firebase.auth().currentUser.uid,
      lastMessage:this.state.currentMessageText
    });
  }

  /**
   * Write the users data in the database /chats/  
   * */
  addToChatsInDataBase(){
    this.writeChatsInDB(firebase.auth().currentUser.uid,this.state.selectedUser)
    this.writeChatsInDB(this.state.selectedUser,firebase.auth().currentUser.uid)
  }

  
  render() {
      
    return (
        <View style={[css.layout.containerBackground,{flex:1,backgroundColor:"#101743"}]}>
          <Navbar navigation={this.props.navigation} isRoot={this.props.isRoot} showRightButton={false}  />
          <GiftedChat
                  bottomOffset={css.isIphoneX()?85:0}
                  messages={this.state.messages}
                  showAvatarForEveryMessage={false}
                  locale='zh-cn'
                  timeFormat='LT'
                  dateFormat='LL'
                  onSend={message =>{
                   message[0].createdAt = (new Date()).getTime()
                    this.setState({
                      currentMessageText:message[0]
                    })
                   
                    var _this=this;
                    firebase.database().ref('messages/' + this.state.chatID).push().set(message[0]);
                    setTimeout(function(){ _this.addToChatsInDataBase(); }, 2000);
                  }}
                  renderBubble={this.renderBubble}
                  renderInputToolbar={this.renderInputToolbar}
                  renderFooter={this.renderFooter.bind(this)}
                  renderActions={this.renderAddImage}
                  placeholderTextColor="white"
                  textInputStyle={{color:"white"}}
                  renderTime={this.renderTime}
                  renderSend={
                    (props) =>{
                    return (
                        <Send
                            {...props}
                        >
                        <View style={{marginBottom:5,opacity:0.7,padding:5}}>
                            <SmartIcon style={{marginBottom:10}} defaultIcons={"MaterialIcons"} name={"MdSend"} size={25} color='white'/>
                        </View>
                           
                        </Send>
                    );
                }}
                dateFormat={'dddd DD. MMMM'}
                  user={{
                    _id: this.state.userID,
                    name: this.state.name,
                    avatar: this.state.avatar,
                  }}>
            <Modal
              visible={this.state.showImageViewer}
              transparent={true}>
              <Image
                source={{ uri: this.state.imageUrl }}
                style = {css.imageChat}
              />
            </Modal>
          </GiftedChat>
        </View>
    )
  }
}

