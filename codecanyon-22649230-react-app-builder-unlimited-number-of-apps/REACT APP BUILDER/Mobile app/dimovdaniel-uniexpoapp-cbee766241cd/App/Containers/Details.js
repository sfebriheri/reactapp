/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import {Platform,Text,View,TouchableOpacity,StyleSheet,ScrollView,AsyncStorage,Share,Linking, UIManager, LayoutAnimation,ImageBackground} from "react-native";
import Navbar from '@components/Navbar';
import firebase from '@datapoint/Firebase';
import css from '@styles/global';
import HeaderImage from '@detailcomponents/HeaderImage';
import Photos from '@detailcomponents/Photos';
import Player from '@detailcomponents/Player';
import CheckBoxes from '@detailcomponents/CheckBoxes';
import Description from '@detailcomponents/Description';
import Button from '../Components/Buttons/Button';
import Counter from '@components/Counter';
import Picker from '../Components/Buttons/Picker';
import fun from '@functions/common';
import Cart from '@functions/cart';
import T from '@functions/translation';
import InfoBox from '../Components/Details/InfoBox';
import TagView from '../Components/Details/TagView';
import Modal from 'react-native-modal';
import Checkout from './Cart';
import { LinearGradient } from 'expo';
import HTML from 'react-native-render-html';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import AppEventEmitter from "@functions/emitter"


const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
const soundObject = null;

@connectActionSheet
export default class Details extends Component {

  //The constructor
  constructor(props) {
    super(props);

    //Set the state
    this.state = {
      key:1,
      qty:1,
      variants:{},
      data:this.props.navigation.state.params?this.props.navigation.state.params.data:{isLoading:true},
      options:this.props.navigation.state.params?this.props.navigation.state.params.data.options:{},
      hasVariant:true,
      selectedVariant:null,
      productAdded:false,
      navButtonActonDone:false,
      rtl:css.dynamic.general.isRTL,
      showCartModal:false,
      stream:"",
      value: 0.5,
      initValue: 0.5,
      isPlaying:true,
      tags:['tag1','tag2']

    }


    //Bind functions to this
    this.qtyCallback=this.qtyCallback.bind(this);
    this.getCollectionDocs=this.getCollectionDocs.bind(this);
    this.createTheOptions=this.createTheOptions.bind(this);
    this.searchForVariant=this.searchForVariant.bind(this);
    this.addToCart=this.addToCart.bind(this);
    this.createTheCheckBoxes=this.createTheCheckBoxes.bind(this);
    this.createThePhotos=this.createThePhotos.bind(this);
    this.handelPhotoClick=this.handelPhotoClick.bind(this);
    this.headerPress=this.headerPress.bind(this);
    this.handlePressOnNavButton=this.handlePressOnNavButton.bind(this);
    this.addCurrentItemInFavorites=this.addCurrentItemInFavorites.bind(this);
    this.doWeHaveThisItemInFavorites=this.doWeHaveThisItemInFavorites.bind(this);
    this.createTheTagView=this.createTheTagView.bind(this);
    this.showHeaderImage=this.showHeaderImage.bind(this);
    this.createTheStreamDetail=this.createTheStreamDetail.bind(this);
    this.stop=this.stop.bind(this);
    this.playPause=this.playPause.bind(this);
    this.startPlay=this.startPlay.bind(this);
    this.setVolume=this.setVolume.bind(this);
    this.fetchTheFirstItemFromCollection=this.fetchTheFirstItemFromCollection.bind(this);
    
  }

  

  //Component Mount function
  componentDidMount(){
    
    //Since v7 we have the option to go directly in the detials,
    //This si why we need to fetch the frist item at sart
    if(this.props.data.goDirectlyToDetails&&!this.props.navigation.state.params){
      //Fetch first item
      this.fetchTheFirstItemFromCollection(this.props.data.listingSetup.data_point);
    }else{
      for (var i = 0; i < this.props.data.detailsSetup.collections.length; i++) {
        var currentCollection=this.props.data.detailsSetup.collections[i];
        this.getCollectionDocs(this.props.data.listingSetup.data_point,this.props.navigation.state.params.data.id,currentCollection);
      }
      setTimeout(() => {
        this.setState({stream:this.getExpectedValue('streamLink',true,this.props.data.detailsSetup.fields.streamLink)});
        setTimeout(() => {
          if(this.props.data.detailsSetup.isHavingStream){
            this.startPlay()
          }
        }, 1000);
      }, 1000);

    }
    


    //Set up the right nav button
    if(this.props.data.detailsSetup.showNavButton){
      //Do calculations
      if(this.props.data.detailsSetup.navButtonAction=="add-to-favorites"){
        this.doWeHaveThisItemInFavorites();
      }
    }

    

  }
  componentWillMount() {
    AppEventEmitter.addListener('toggleModal', this._toggleModal);
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUnmount(){
    //Stop radio - call function
    this.stop()
    
  }


  /**
   * Fetches and sets the first item from collection - used if goDirectlyToDetails is set to true
   * @param {String} collectionName 
   */
  fetchTheFirstItemFromCollection(collectionName){
    var db=firebase.firestore();
    var ref=db.collection(collectionName);
    var item=null;
    var _this=this;

    //Get the data now
    ref.get()
    .then(snapshot => {

      snapshot
        .docs
        .forEach(doc => {
          if(item==null){
            if(this.props.data.objectIdToShow){
              if(doc.id==this.props.data.objectIdToShow){
                item=JSON.parse(doc._document.data.toString());
                item.id=doc.id;
              }
            }else{
              item=JSON.parse(doc._document.data.toString());
              item.id=doc.id;
            }
            
           
          }
        });

        if(item!=null){
          //alert("We have the item, nice "+item.id);
          this.setState({ key: Math.random(),data:item, options:item.options });
          for (var i = 0; i < this.props.data.detailsSetup.collections.length; i++) {
            var currentCollection=this.props.data.detailsSetup.collections[i];
            this.getCollectionDocs(collectionName,item.id,currentCollection);
          }

          setTimeout(() => {
            this.setState({stream:this.getExpectedValue('streamLink',true,this.props.data.detailsSetup.fields.streamLink)});
            setTimeout(() => {
              if(this.props.data.detailsSetup.isHavingStream){
                this.startPlay()
              }
            }, 1000);
          }, 1000);
         
         

        }else{
          alert("We don't have initial item avialbe")
        }
    });

  }



  /**
 * @description Start Streaming of sound
 */
async startPlay(){
  try {
    soundObject=new Expo.Audio.Sound();
    soundObject.setVolumeAsync(0.5);
    await soundObject.loadAsync({ uri: this.state.stream });
    await soundObject.playAsync();

    this.setState({
      isPlaying:true
    })
    
  } catch (error) {
  }
}

/**
 * @name stop
 * @description This function will stop the stream
 */
async stop(){
  try {
    await soundObject.pauseAsync();
    this.setState({
      isPlaying:false
    })
  } catch (error) {
  }
}

/**
 * @description Play or Pause
 * @author Valerija Dimova
 */
playPause(){
  //if state / play pasue
  if(this.state.isPlaying){
    this.stop()
  }
  else{
    this.startPlay()
  }
}

setVolume(valueProp){
  soundObject.setVolumeAsync(valueProp);
}



  /**
  * getCollectionDocs - gets documents sub collection documents
  * @param {String} firstCollectionName - parrent collection
  * @param {String} documentID - the current document
  * @param {String} secondCollectionName - the collection to fetch data for
  */
  getCollectionDocs(firstCollectionName,documentID,secondCollectionName){
    //Get regerence to _this
    var _this=this;

    //Get reference to FireStore
    var db=firebase.firestore();
    var ref=db.collection(firstCollectionName).doc(documentID).collection(secondCollectionName);

    //Place to store the data
    var data = [];

    //Get the data now
    ref.get()
    .then(snapshot => {
      snapshot
        .docs
        .forEach(doc => {
          var objToAdd=JSON.parse(doc._document.data.toString());
          //Add the id, on each object, easier for referencing
          objToAdd.id=doc.id;
          data.push(objToAdd);
        });

        //Add the data with correct name in the state
        var objToBeInsertedInState={};
        objToBeInsertedInState[secondCollectionName]=data;
        _this.setState(objToBeInsertedInState);

        //If this is the variants of a product, make the fist one as selected variant
        if(secondCollectionName=="variants"){

          _this.setState({
            selectedVariant:data[Object.keys(data)[0]],
            selectedInitialVariant:data[Object.keys(data)[0]]
          })
        }
    });
  }


  /**
  * getExpectedKey - get key for givven field
  * @param {String} forField
  */
  getExpectedKey(forField){
    return this.props.data.detailsSetup.fields[forField];
  }

  /**
  * getExpectedKey - get key for givven field
  * @param {String} forField
  */
  getExpectedKey(forField,def){
    return this.props.data.detailsSetup.fields[forField]?this.props.data.detailsSetup.fields[forField]:def;
  }

  /**
  * applyFunctions - function caller
  * @param {String} theVal
  * @param {String} theFunction
  */
  applyFunctions(theVal,theFunction){
    //Reference to this
    var _this=this;

    //Check for magic fields - replaces magic fields like {qty} inside the theFunction
    Object.keys(this.state).map((key,index)=>{

      var find = '{'+key+"}";
      var replaceWith=_this.state[key];
      var re = new RegExp(find, 'g');
      theFunction = theFunction.replace(re, replaceWith);
    })

    //Check for magic fields - replaces magic fields like {for} inside the theFunction
    Object.keys(this.state.data).map((key,index)=>{

      var find = '{'+key+"}";
      var replaceWith=_this.state.data[key];
      var re = new RegExp(find, 'g');
      theFunction = theFunction.replace(re, replaceWith);
    })

    //After we have replaced any magic fields based on the state, apply the function
    return fun.callFunction(theVal,theFunction)
  }

  /**
  * getExpectedValue - get value for field in ui
  * @param {String} forField - for what UI field we need a value
  * @param {Boolean} withFunciton - should we apply funciton
  * @param {String} theFunction - funciton to be applied
  * @param {String} def - default value
  */
  getExpectedValue(forField,withFunciton=false,theFunction=null,def=""){
    //return def;
    console.log("Looking for value:"+this.getExpectedKey(forField,forField)+" when state is "+JSON.stringify(this.state.data[this.getExpectedKey(forField,forField)]))
    //return this.state.data[this.getExpectedKey(forField)];
    if(this.state.data[this.getExpectedKey(forField,forField)]){
      var theVal= this.state.data[this.getExpectedKey(forField,forField)];
     // console.log(this.state.data[this.getExpectedKey(forField)]+"<----")
      if(withFunciton&&theFunction){
        console.log("Field "+forField+"  function "+theFunction+"<--------")
        return this.applyFunctions(theVal,theFunction);
      }else{
        return theVal;
      }
    }else{
      //console.log("Returning default")
      return def;
    }
  }


  /**
  **
  **   UI GENERATORS
  **
  **/

  /**
  * createThePhotos - creates the photos in state, or returns empty view
  */
  handelPhotoClick(index){
    var photos=[];
    for (var i = 0; i < this.state.photos.length; i++) {
      photos[i]={ source: { uri: this.state.photos[i].photo } };
    }
    this.props.navigation.navigate('Gallery',{data:photos,index:index})
  }

  createThePhotos(){
    if(this.props.data.detailsSetup.showPhotos&&this.state.photos&&this.state.photos.length>0){

      return (<Photos onPress={this.handelPhotoClick} title={this.props.data.detailsSetup.photosTitle} isVertical={this.props.data.detailsSetup.photosVertical} photos={this.state.photos}/>)
    }else{

      return (<View></View>)
    }
  }


  createTheInfoBoxes(){
    if(!this.props.data.detailsSetup.isHavingStream){
      return(<View>
        <ConditionalDisplay condition={this.getExpectedValue('subtitle',true,this.props.data.detailsSetup.fields.subtitleFunctions)}>
      <InfoBox
          style={{alignItems:'flex-start'}}
          iconName={this.getExpectedKey('subtitleIcon',"ios-information-circle")}
          descText = {this.getExpectedValue('subtitle',true,this.props.data.detailsSetup.fields.subtitleFunctions)}
          color = 'grey'
        />
    </ConditionalDisplay>
    

    <ConditionalDisplay condition={this.getExpectedValue('subtitle2',true,this.props.data.detailsSetup.fields.subtitle2Functions)}>
      <InfoBox
          style={{alignItems:'flex-start'}}
          iconName={this.getExpectedKey('subtitle2Icon',"ios-information-circle")}
          descText = {this.getExpectedValue('subtitle2',true,this.props.data.detailsSetup.fields.subtitle2Functions)}
          color = 'grey'
        />
    </ConditionalDisplay>

    <ConditionalDisplay condition={this.getExpectedValue('subtitle3',true,this.props.data.detailsSetup.fields.subtitle3Functions)}>
      <InfoBox
          style={{alignItems:'flex-start'}}
          iconName={this.getExpectedKey('subtitle3Icon',"ios-information-circle")}
          descText = {this.getExpectedValue('subtitle3',true,this.props.data.detailsSetup.fields.subtitle3Functions)}
          color = 'grey'
        />
    </ConditionalDisplay>
 
 </View>)
    }else{
      return (<View></View>)
    }
  }

    /**
    * createTheStreamDisplay - creates the stream detail, or returns empty view
    */
  createTheStreamDetail(){
   
    if(this.props.data.detailsSetup.isHavingStream){
      return (
        <Player 
          key={this.state.data.name}
          openLink={this.openExternalAppVideo}
          playPause={this.playPause}
          setVolume={this.setVolume}
         
          song={this.getExpectedValue('song',true,this.props.data.detailsSetup.fields.song)}
          name={this.getExpectedValue('stationName',true,this.props.data.detailsSetup.fields.stationName)}
          subtitle={this.getExpectedValue('stitle',true,this.props.data.detailsSetup.fields.stitle)}
          img={this.getExpectedValue('img',true,this.props.data.detailsSetup.fields.img)}
          fb={this.getExpectedValue('fb',true,this.props.data.detailsSetup.fields.fb)}
          twitt={this.getExpectedValue('twitt',true,this.props.data.detailsSetup.fields.twitt)}
         
        />
      )

    }else{

      return (<View></View>)
    }
  }
  


  /**
  * createThePrice - creates the pricing options of currect product, or display that selected variant is not avilable
  */
  createThePrice(){
    if(this.props.data.detailsSetup.isShopping){
      if(this.state.selectedVariant&&this.state.hasVariant){
        return (<Description
          title={this.applyFunctions(this.state.selectedVariant.price,this.props.data.detailsSetup.fields.priceFunctions)}
          text={this.applyFunctions(this.state.selectedVariant.price,this.props.data.detailsSetup.fields.subPriceFunctions)}/>)
      }else{
        return (<View><Description title={T.price} text={T.no_variant_available} /></View>)
      }
    }else{
      return (<View></View>)
    }

  }


  createDescription(){
    if(!this.props.data.detailsSetup.isHavingStream){
      return (<Description data={this.state.data} title={this.props.data.detailsSetup.descriptionTitle} text={this.getExpectedValue('description',true,this.props.data.detailsSetup.fields.descriptionFunctions)}/>)
    }else{
      return (<View></View>)
    }
  }

  /**
  * createTheOptions - creates options pickers
  */
  createTheOptions(){
    //Referece to this
    var _this=this;
    if(this.state.selectedInitialVariant){
      //Retunr pickers
      return (<View>{
        Object.keys(_this.state.options).map(function(keyOfItem, index) {
          if(_this.state.selectedInitialVariant[keyOfItem]){
            return (
              <Picker
                key={keyOfItem}
                callback={_this.searchForVariant}
                theKey={keyOfItem}
                option={_this.state.options[keyOfItem]}
                selectedVariant={_this.state.selectedInitialVariant} 
               >
              </Picker>);
            }else{
              return <View key={keyOfItem}></View>
            }

        })
      }</View>)
    }else{
      //Return empty
      return (<View></View>)
    }
  }

  /**
  * Create Check Boxes
  */
  createTheCheckBoxes(){
    if(this.state.ingredients&&this.state.ingredients.length>0){
      return (<CheckBoxes title={T.ingredients} items={this.state.ingredients} />)
    }else{
      return (<View></View>)
    }
  }


  /**
  * Create tag view
  */
  createTheTagView(){

    if(this.state.tags.length>0){
      return(<TagView tags={this.state.tags} />)

    }else{
      return (<View></View>)
    }
  }


  /**
  **           CALL BACKS
  **  response from other components
  **/

  /**
  * qtyCallback - qty changed
  * @param {Number} count - to how much
  */
  qtyCallback(count){
    this.setState({
      qty:count
    })
  }

  /**
  * addToCart - prepare and add the selected variant in the cart
  */
  addToCart(){
    //Reference to this
    var _this=this;
    if(this.state.hasVariant){
      //If we have selected a variant
      var theItemToBeAdded=JSON.parse(JSON.stringify(this.state.selectedVariant));

      //Add extra thins we will need in the item to be added
      theItemToBeAdded.qty=this.state.qty;
      theItemToBeAdded.name=this.getExpectedValue('title');
      theItemToBeAdded.image=this.getExpectedValue('image');
      theItemToBeAdded.productOptions=this.state.options;

      if(this.props.data.detailsSetup.isDirectShopping){

        Cart.cleanCart(function(){
          Cart.addCartContent(theItemToBeAdded,function(d,e){
            _this.setState({
              showCartModal:true,
            });
          })
        })
        
        //Do it after some time
        _this.setState({
          showCartModal:true,
        });

        

      }else{
        //Now add it to cart - normal shoping
        Cart.addCartContent(theItemToBeAdded,function(d,e){
          
          _this.setState({
            productAdded:true,
            cart:d
          });
        })
      }
        
      
      
    }else{
      //No variant available
      alert(T.variant_not_available)
    }
  }

  /**
  * searchForVariant - called when user changes selected option
  * @param {String} - option
  * @param {String} - new selected option value
  */
  searchForVariant(option,value){
    //Get the current selection
    var currentSelection=JSON.parse(JSON.stringify(this.state.selectedVariant));

    //Find old option value
    currentSelection[option]=value;



    //Loop into the variants to find the exact options, or null if it doesn't exists
    var nextSellection=null;
    var found=false;
    for (var i = 0; i < this.state.variants.length&&!found; i++) {
      if(this.state.variants[i].option1==currentSelection.option1
        &&this.state.variants[i].option2==currentSelection.option2
        &&this.state.variants[i].option3==currentSelection.option3){
          found=true;
          nextSellection=this.state.variants[i];


        }
    }



    //Update the state with the selected option
    this.setState({
      selectedVariant:nextSellection!=null?nextSellection:currentSelection,
      hasVariant:nextSellection!=null?true:false,
    })
  }


  showShoping(){
    if(this.props.data.detailsSetup.isShopping){
      return (
        <View>
            <View style={css.layout.orderOption}>
              {this.createTheOptions()}
            </View>
            <View style={css.layout.orderCounter}>
              <View style={{flex:2}}>
                <Counter start={1} callback={this.qtyCallback} max={10} />
              </View>
              <View style={{flex: 6}}>
                <Button
                  opacity={this.state.hasVariant?1:0.5}
                  onPress={this.addToCart}
                  text={this.state.productAdded&&this.props.data.detailsSetup.actionButtonWhenActionDone?this.props.data.detailsSetup.actionButtonWhenActionDone:this.props.data.detailsSetup.actionButton} />
              </View>
            </View>
        </View>
        )
    }else{
      return (<View></View>)
    }
  }

  showShareLink(){
    
     if(this.props.data.detailsSetup.fields.shareLink&&this.getExpectedValue('shareLink')!=""){
      
     return (
        <View style={css.layout.orderCounter}>
              <View style={{flex: 1}}>
                <Button
                  onPress={()=>{
                    Share.share({
                      title:this.getExpectedValue('title',true,this.props.data.detailsSetup.fields.titleFunctions),
                      url:this.getExpectedValue('shareLink'),
                     })}}
                  text={this.props.data.detailsSetup.shareButton} />
              </View>
          </View>
        )
    }else{
      return (<View></View>)
    }
  }

  openExternalApp(lat,long) {
    var scheme = Platform.OS === 'ios' ? 'apple' : 'google'
    Linking.canOpenURL('http://maps.'+scheme+'.com/maps?daddr='+lat+','+long).then(supported => {
      if (supported) {
        Linking.openURL('http://maps.'+scheme+'.com/maps?daddr='+lat+','+long);
      } else {

      }
    });
   }

   
   
    directionButtonAction(latlng){
      this.openExternalApp(latlng._lat,latlng._long)
    }
    


  showDirectionLink(){
   
    if(this.props.data.detailsSetup.fields.direction&&this.getExpectedValue('direction')!=""){
    return (
       <View style={css.layout.orderCounter}>
             <View style={{flex: 1}}>
               <Button
                 onPress={()=>{
                    this.directionButtonAction(this.getExpectedValue('direction'))
                  }}
                 text={this.props.data.detailsSetup.directionButton} />
             </View>
         </View>
       )
   }else{
     return (<View></View>)
   }
 }

  showAddToCalendar(){
    if(this.props.data.detailsSetup.fields.shareLink&&this.getExpectedValue('shareLink')!=""){
    return (
       <View style={css.layout.orderCounter}>
             <View style={{flex: 1}}>
               <Button
                 onPress={()=>{
                   //TODO ADD TO CALENDAR
                   //https://docs.expo.io/versions/latest/sdk/calendar.html
                  }}
                 text={this.props.data.detailsSetup.shareButton} />
             </View>
         </View>
       )
   }else{
     return (<View></View>)
   }
 }

  openExternalAppVideo(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
      }
    });
  }

  headerPress(){
    this.openExternalAppVideo(this.getExpectedValue('video'));
  }

  addCurrentItemInFavorites(){
      //Now add it to cart
      var _this=this;
      Cart.addFavoritesContent(this.props.navigation.state.params.data,"favorites",function(d,e){
        _this.setState({
          navButtonActonDone:true,
        });
      })
  }

  removeCurrentItemInFavorites(){
      //Now add it to cart
      var _this=this;
      Cart.removeFavoritesContent(this.props.navigation.state.params.data.id,"favorites",function(doWeHaveIt){
        _this.setState({
          navButtonActonDone:doWeHaveIt,
        });
      })
  }

  doWeHaveThisItemInFavorites(){
     var _this=this;
     if(this.props.navigation.state.params&&this.props.navigation.state.params.data&&this.props.navigation.state.params.data.id){
      Cart.doWeHaveThisFavorite(this.props.navigation.state.params.data.id,"favorites",function(doWeHaveIt){
        _this.setState({
          navButtonActonDone:doWeHaveIt,
        });
      })
     }
      
  }

  /**
  * Receive the click on the navigation button
  */
  handlePressOnNavButton(){

    if(this.state.navButtonActonDone){

      if(this.props.data.detailsSetup.navButtonAction=="add-to-favorites"){
        this.removeCurrentItemInFavorites();
      }else{
        alert("Unknown action")
      }
    }else{

      if(this.props.data.detailsSetup.navButtonAction=="add-to-favorites"){
        this.addCurrentItemInFavorites();
      }else{
        alert("Unknown action")
      }

    }
  }

  showHeaderImage(){
    if(!this.props.data.detailsSetup.hideHeader){

      return (
        <HeaderImage
          hasVideo={this.props.data.detailsSetup.fields.video&&this.getExpectedValue('video')!=""}
          onPress={this.headerPress}
          image={this.getExpectedValue('image',false)}
          title={this.getExpectedValue('title',true,this.props.data.detailsSetup.fields.titleFunctions)}
        />)
    }else{

      return (<View></View>)
    }
  }
  phoneApp(){

    if(this.props.data.detailsSetup.fields.phone&&this.getExpectedValue('phone')!=""){
      return (
        <View style={css.layout.orderCounter}>
             <View style={{flex: 1}}>
               <Button
                 onPress={()=>{
                    this.callButtonAction(this.getExpectedValue('phone'))
                  }}
                 text={this.props.data.detailsSetup.callButton} />
             </View>
         </View>
       )
   }else{
     
     return (<View></View>)
   }
  }

  callButtonAction(number){
    var phoneNumbURL ="tel:"+ number
    this.openPhoneApp(phoneNumbURL)
  }

  openPhoneApp(phoneNumber){
     Linking.canOpenURL(phoneNumber).then(supported => {
      if (supported) {
        Linking.openURL(phoneNumber);
      } else {

      }
    });

  }

  showCommentButton(){
    if(this.props.data.detailsSetup.commentButton != null){
      return (
        <View style={css.layout.orderCounter}>
             <View style={{flex: 1}}>
               <Button
                 onPress={()=>{
                  this.props.navigation.navigate('Comments',{data:this.props.data.listingSetup.data_point,id:this.props.navigation.state.params.data.id})
                  }}
                 text={this.props.data.detailsSetup.commentButton} />
             </View>
         </View>
       )
   }else{
     
     return (<View></View>)
   }
  }

  _toggleModal = () =>
  this.setState({ showCartModal: !this.state.showCartModal });

  render() {
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };

    var showRightActionButton=!(this.props.data.detailsSetup.navButtonAction=="add-to-favorites"&&this.props.data.goDirectlyToDetails&&!this.props.navigation.state.params)

    var shouldWeShowImageBg=css.dynamic.general.detailsBackgroundImage;
    if(shouldWeShowImageBg){
      var bgGradient=['rgba(0,0,0,0)','rgba(0,0,0,0)'];
    }else{
      var bgGradient=[css.dynamic.general.detailsBackgroundColor||css.dynamic.general.backgroundColor,css.dynamic.general.detailsBackgroundColor||css.dynamic.general.backgroundColor];
      if(css.dynamic.general.detailsBackgroundGradient){
        bgGradient=[];
        css.dynamic.general.detailsBackgroundGradient.map((item,index)=>{
          bgGradient.push(item.color);
        })
      }
    }
  return (
    <View style={{flex:1}} param={this.state.data}>
      <ConditionalWrap
          isLoading={this.state.data}
          condition={shouldWeShowImageBg}
          wrap={children => <ImageBackground 
            source={require('@images/bg.jpg')}
            style={[css.layout.imageBackground,{flex:1}]}
            >{children}</ImageBackground>}
          >
        <LinearGradient colors={bgGradient} style={[{flex:1},css.layout.containerBackground]}>
          <Navbar
            navigation={this.props.navigation}
            isRoot={this.props.data.goDirectlyToDetails&&!this.props.navigation.state.params?true:false}
            detailsView={this.props.data.goDirectlyToDetails&&!this.props.navigation.state.params?false:true}
            //Hide right button if icon is favorites and is set to go directly in details
            showRightButton={this.props.data.detailsSetup.showNavButton&&showRightActionButton}
            rightButton={this.state.navButtonActonDone?this.props.data.detailsSetup.navButtonActionDoneIcon:this.props.data.detailsSetup.navButtonIconActiveIcon}
            rightAction={this.handlePressOnNavButton}
            />

          <ScrollView contentContainerStyle={css.detailsScroll}>
            <View style={{flex: 1}}>
              {this.showHeaderImage()}
              {this.createTheInfoBoxes()}
              {this.createTheStreamDetail()}
              {this.createThePhotos()}
              {this.createThePrice()}
              {this.createTheCheckBoxes()}
              {this.createDescription()}
              {this.showShoping()}
              {this.showShareLink()}
              {this.showDirectionLink()}
              {this.phoneApp()}
              {this.showCommentButton()}
              
            </View>

            <Modal
              isVisible={this.state.showCartModal}
              backdropColor={'rgba(0, 0, 0, 0.85)'}
              backdropOpacity={1}
              animationIn={'zoomInDown'}
              animationOut={'zoomOutUp'}
              animationInTiming={1000}
              animationOutTiming={1000}
              onBackdropPress={() => this.setState({ showCartModal: false })}
              backdropTransitionInTiming={1000}
              backdropTransitionOutTiming={1000}
          >
      
            <ScrollView style={css.detailsScroll}>
              <View style={css.layout.modalContent}>
              {/* <View style={{height:100,width:200,backgroundColor:"red"}}></View> */}
               <Checkout data={{
                  icons:this.props.data.detailsSetup.cartIcons,//['ios-calendar-outline','ios-person-outline','ios-card-outline','ios-list-box-outline'],
                  labels:this.props.data.detailsSetup.cartLabels,//[T.event,T.register,T.payment,T.summary],
                  hideTopImage:true,
                  CODAvailable:this.props.data.detailsSetup.cartCODAvailable,
                  PayPalAvailable:this.props.data.detailsSetup.cartPayPalAvailable,
                  CODText:this.props.data.detailsSetup.cartCODText,
                  saveItemsInStore:true,
                  currentPosition:1}} /> 
              </View>
            </ScrollView>

          </Modal>

          </ScrollView>
        </LinearGradient>
        </ConditionalWrap>
        </View>
      )
  }

}