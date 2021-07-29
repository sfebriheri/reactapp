/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component,PropTypes} from "react";
import {WebView,View,Text} from "react-native";
import Navbar from '@components/Navbar'
import { GiftedChat } from 'react-native-gifted-chat'
import css from '@styles/global'
import * as firebase from 'firebase';
export default class Comments extends Component {
   //The constructor
  constructor(props) {
    super(props);

    //Set the state
    this.state = {
        messages: [],
        id: this.props.navigation.state.params.id,
        data_point: this.props.navigation.state.params.data,
        currentMessage: [],
        avatar:"",
        name:"",
        userID:firebase.auth().currentUser.uid,
        
      }
      this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
    }
      componentDidMount() {

        firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
        this.getCommentsFromFS()  
        
      }
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

      getCommentsFromFS(){
        var _this=this;
        var theComments=[]
        var db=firebase.firestore();
        
        var docRef = db.collection(this.state.data_point).doc(this.state.id).collection("comments").orderBy("createdAt", "desc");
        
        docRef.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var objToAdd=doc.data()
                //Add the id, on each object, easier for referencing
                objToAdd.id=doc.id;
                theComments.push(objToAdd);
            });

            _this.setState({
                messages:theComments
            })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
      }

      addCommentToFS(){
         
        comment=this.state.currentMessage[0]
        //Get reference to FireStore
        var db=firebase.firestore();
        db.collection(this.state.data_point).doc(this.state.id).collection("comments").add(
            comment
        )
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        
      }
    
      onSend(messages = []) {
          //alert(JSON.stringify(GiftedChat))
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
          currentMessage:messages

        }))

        var _this=this;
        setTimeout(function(){ _this.addCommentToFS(); }, 2000);
      }
    
      render() {
        return (
        <View style={[css.layout.containerBackground,{flex:1}]}>
            <Navbar navigation={this.props.navigation} isRoot={this.props.isRoot} showRightButton={false}  />
            <GiftedChat
                    messages={this.state.messages}
                    showUserAvatar={true}
                    showAvatarForEveryMessage={false}
                    onSend={messages => this.onSend(messages)}
                    user={{
                      _id: this.state.userID,
                      name: this.state.name,
                      avatar: this.state.avatar,
                    }}
            />
        </View>
        )
      }
    }