/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
console.disableYellowBox = true; //Set to false in development

import React from 'react';
import Expo from "expo";
import { StyleSheet, Text, View, Image, ScrollView,Button,FlatList,TouchableOpacity,AsyncStorage,LayoutAnimation,Dimensions} from 'react-native';
import { MaterialIcons, Ionicons,Feather } from '@expo/vector-icons';
import firebase from '@datapoint/Firebase'
import * as firebase2 from 'firebase';
require("firebase/firestore");
import css from '@styles/global'
import AppListStyle from "./App/Components/Smartrow/style";
import Master from '@containers/Master'
import MapScreen from '@containers/MapScreen'
import Categories from '@containers/Categories'
import Details from '@containers/Details'
import Gallery from '@containers/Gallery'
import NotificationDisplay from '@containers/NotificationDisplay'
import NotificationScreen from '@containers/Notifications'
import Cart from '@containers/Cart'
import Orders from '@containers/Orders'
import OrderDetail from '@containers/OrderDetail'
import WebScreen from '@containers/WebScreen'
import NavigationIcon from '@navigationicon'
import Config from './config'
import fun from '@functions/common';
var to = require('to-case')
import appConfig from './app.json'
import SmartIcon from '@smarticon';
import {AdMobInterstitial,Permissions, Notifications,BarCodeScanner} from "expo";
import {version} from './package.json';
import AppEventEmitter from "@functions/emitter"
import { Font,AppLoading, Asset } from 'expo';
import Login from '@containers/Users/LoginScreen'
import ForgetPassword from '@containers/Users/ForgetPassword'
import SignUp from '@containers/Users/SignUpScreen'
import ProfileSettings from '@containers/Users/ProfileSettings'
import ProfileOption1 from '@containers/Users/ProfileOption1'
import ProfileOption2 from '@containers/Users/ProfileOption2'
import ListOfUsers from '@containers/Users/ListOfUsers'
import Chats from '@containers/Users/Chats'
import Scanner from '@containers/Scanner'
import Grid from './App/Containers/MenuLayouts/Grid'
import DetailsFromScanner from '@containers/DetailsFromScanner'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import Comments from '@containers/Comments'
import Chat from '@containers/Chat'
import AppIntroSlider from 'react-native-app-intro-slider';
import {  createBottomTabNavigator,createStackNavigator,createDrawerNavigator,DrawerNavigator,DrawerItems,StackNavigator,TabNavigator } from 'react-navigation';

/**
* MyMastSreen  - creates master screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMastSreen = ({ navigation, data, design,isRoot,config}) => (
  <Master data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}/>
);


/**
* MyMapSreen  - creates mao screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMapSreen = ({ navigation, data, design,isRoot,config }) => (
  <MapScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);


/**
* MyCategoriesSreen  - creates categoris screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCategoriesSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Categories data={data} navigation={navigation} isRoot={isRoot} subMenus={subMenus} config={config}/>
);

/**
* MyWebSreen  - creates web screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyWebSreen = ({ navigation, data, design,isRoot,config }) => (
  <WebScreen data={data} navigation={navigation} isRoot={isRoot} config={config} />
);


const MyScannerScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config }) => (
  <Scanner data={data} navigation={navigation} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} />
);

const MyGridScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config }) => (
    <Grid data={data} navigation={navigation} design={design} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} />
  );

  
const MyDetailsFromScanner = ({ navigation, data, design,isRoot,config }) => (
  <DetailsFromScanner data={data} navigation={navigation} isRoot={isRoot} config={config} />
);


/**
* MyDetailsSreen  - creates details screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
* @param {Object} config - configuration data
*/
const MyDetailsSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Details data={data} navigation={navigation} design={design} config={config} />
);

/**
* MyGallerySreen  - creates gallery screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyGallerySreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <Gallery data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);

/**
* MyCartSreen  - creates cart screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCartSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Cart data={data} navigation={navigation} design={design} config={config}  />
);


/**
* MyOrdersSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrdersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Orders data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);

/**
* MyOrdersDetailSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrderDetailSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <OrderDetail data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);


/**
* MyNotificationsSreen  - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyNotificationsSreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <NotificationScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);

/**
* MyNotificationDisplaySreen  - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyNotificationDisplaySreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <NotificationDisplay data={data} navigation={navigation} design={design} config={config} />
);

/**
* MyProfileSettingsSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileSettingsSreen = ({ navigation, data, design,isRoot,subMenus,isReqUserVarification,allowedUsers,config }) => (
  <ProfileSettings data={data} navigation={navigation} design={design} isRoot={isRoot} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config} />
);
/**
* MyProfileOption1Sreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileOption1Sreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <ProfileOption1 data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);
/**
* MyProfileOption2Sreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileOption2Sreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <ProfileOption2 data={data} navigation={navigation} design={design} config={config}  />
);
/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyListOfUsersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <ListOfUsers data={data} navigation={navigation} design={design} config={config}  />
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyChatsSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Chats data={data} navigation={navigation} design={design} config={config}  />
);

const MyLoginSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <Login   isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);

const MyCommentsSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Comments data={data} navigation={navigation} design={design}  />
);
const MyChatSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Chat data={data} navigation={navigation} design={design}/>
);

const MyForgetPassSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <ForgetPassword isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);
const MySignUpSreen = ({ isReqUserVarification, allowedUsers,config}) => (
  <SignUp isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);


const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
const paddingValue = 8;
const screenWidth = Dimensions.get('window').width;
    this.itemSize = {
      width: (screenWidth - (paddingValue * 6)) / 2,
      height: (screenWidth - (paddingValue * 6)) / 2,
    };
export default class App extends React.Component {
  //The drawler nav, initialy null, this is build while in runtime
  static navi=null;
  static loginNavi=null;
  
  //The construcor
  constructor(props){
    super(props);
    this.state = {
            isReady:false,
            metaLoaded:false,
            meta:{},
            allAppsData:[],
            notification: {},
            fontLoaded: false,
            userAuthenticated:false,
            avatar:require('@images/sidelogo.png'),
            userEmail:"",
            name:'',
            bio:"",
            openBCScanner:false,
            hasCameraPermission: null,
            lastScannedData:null,
            showSliders:false,
            showRealApp: false,
            slides: [],
            data:[],
            isGridView:false,
            routes:[ {
              id: 'Login1',
              title: 'Login V1',
            },
            {
              id: 'Login2',
              title: 'Login V2',
              
            },
            {
              id: 'SignUp',
              title: 'Sign Up',
              
            }]
        };

    //Bind functions to this
    this.retreiveMeta=this.retreiveMeta.bind(this);
    this.createNavigation=this.createNavigation.bind(this);
    this.chekIfHaveSliders=this.chekIfHaveSliders.bind(this);
    this.retreiveAppDemos=this.retreiveAppDemos.bind(this);
    this.renderAppRow=this.renderAppRow.bind(this);
    this.alterUserState=this.alterUserState.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
    this.setUpUserDataFromFB=this.setUpUserDataFromFB.bind(this);
    this.openScanner=this.openScanner.bind(this);
    this.back=this.back.bind(this);
  }

  alterUserState(isLoggedIn){
    this.setState({
      userAuthenticated:isLoggedIn
    })
  }
  setUpUserDataFromFB(){
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
}

  setUpCurrentUser(user){
    if (user != null) 
    {
      var _this=this;
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
          
          _this.setState({
            avatar:user.photoURL != null?{uri: user.photoURL}:require('@images/blank-image.jpg'),
              name:snapshot.val().username,
              bio:snapshot.val().bio
          })
      })
    } else {
        // No user is signed in.
      }
}
componentDidMount(){
  //Check if user is logged in
  AppEventEmitter.addListener('profileUpdateDefInfo', this.setUpUserDataFromFB.bind(this));
  this.setUpUserDataFromFB()
  
}



  //When component is mounted
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});

      AppEventEmitter.addListener('user.state.changes', this.alterUserState);

      //Check login status
      // Listen for authentication state to change.
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.setState({
            userAuthenticated:true
          });
        }else{
          this.state.userAuthenticated=false;
        }
      });

      if(!Config.isPreview){
        //Load the data automatically, this is normal app and refister for Push notification
        this.registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
        this.retreiveMeta();
      }else{
        //Load list of apps
        this.retreiveAppDemos();
      }

      await Expo.Font.loadAsync({
        "Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
        "Ionicons": require("@expo/vector-icons/fonts/Ionicons.ttf"),
        "Feather": require("@expo/vector-icons/fonts/Feather.ttf"),
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'lato-light': require('./assets/fonts/Lato-Light.ttf'),
        'lato-regular': require('./assets/fonts/Lato-Regular.ttf'),
        'lato-bold': require('./assets/fonts/Lato-Bold.ttf'),
        'lato-black': require('./assets/fonts/Lato-Black.ttf'),
        
      });
      this.setState({ isReady: true,fontLoaded: true });
}

  openScanner(){
    this.setState({
      openBCScanner:true
    });
  }
 
  _handleBarCodeRead = ({ data }) => {
    if (data !== this.state.lastScannedData) {
      LayoutAnimation.spring();
      this.setState({ lastScannedData: data });
      var decodedData = decodeURIComponent(data);
    
    var spl = decodedData.split(";")

    var url = ".firebaseapp.com"

    // Configure firebaseConfig from config.js
    Config.firebaseConfig = {
      apiKey : spl[0],
      authDomain : spl[1] + url ,
      databaseURL : "https://" + spl[1] + ".firebaseio.com",
      projectId : spl[1],
      storageBucket : spl[1] + ".appspot.com"
    }
  
    //firebase.initializeApp(Config.firebaseConfig);
    /*alert(JSON.stringify(firebase.apps.length))
    firebase.apps.forEach(element => {
      alert(element.name)
    });*/
    var _this=this;
     //Configure firebaseMetaPath  from app.json
     appConfig.expo.extra.firebaseMetaPath = spl[2];

    //Set the preview to false
    Config.isPreview = false

    firebase.app("[DEFAULT]").delete().then(function() {


      firebase.initializeApp(Config.firebaseConfig);
      
      /**
       *  Fix for latest version on Firestore
       */
      const firestore=firebase.firestore();
      const settings={
        timestampsInSnapshots:true
      }
      firestore.settings(settings);
      //END FIX 

      _this.retreiveMeta()
      
     
     
    });
    }
    
    
  }


  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };


// Function for register For PushNotifications
  async registerForPushNotificationsAsync() {

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;

    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

      const value = await AsyncStorage.getItem("token");

      var pathToTokens="/expoPushTokens";
      if(appConfig.expo.extra.firebaseMetaPath!="/meta"){
        pathToTokens+=appConfig.expo.extra.firebaseMetaPath;
      }


      // Get a key for a new Post.
       var newPostKey = firebase.database().ref(pathToTokens).push().key;


       if(value == null)
       {
         //Set the token in FireBase
         firebase.database().ref(pathToTokens+"/"+ newPostKey).set({
           token: token
         });
         // Save the value of the token in AsyncStorage

         try {
           await AsyncStorage.setItem("token", await Notifications.getExpoPushTokenAsync());
         } catch (error) {
           // Error saving data
         }
       }
       else {
       }
    }


  //STEP 1 - Retrive metadata from Firebase db
  retreiveMeta(){
    
    //Get the meta data
    var _this=this;

    if(firebase.apps.length){

      firebase.database().ref(appConfig.expo.extra.firebaseMetaPath).once('value').then(function(snapshot) {
        Config.showBannerAds=snapshot.val().config.showBannerAds||false;
        Config.showinterstitialAds=snapshot.val().config.showinterstitialAds||false;
        Config.bannerID=snapshot.val().config.bannerID||"";


        
        AdMobInterstitial.setAdUnitID(snapshot.val().config.interstitialID||"");
  
        if(Config.isTesting){
          AdMobInterstitial.setTestDeviceID("EMULATOR");
        }
        
  
        if(Config.showinterstitialAds == true)
        {
          AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }

       
  
      _this.chekIfHaveSliders(snapshot.val())
        
      });
    }

    

  }
  _renderNextButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdArrowForward"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderDoneButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdDone"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
          
        />
      </View>
    );
  }
  _onDone = async ()  => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.createNavigation(this.state.data)
    
    try {
      await AsyncStorage.setItem('hasSeenTheSliders', "yes");
    } catch (error) {
      // Error saving data
    }
    
  }

   async chekIfHaveSliders(data){
    const hasSeenTheSliders = await AsyncStorage.getItem("hasSeenTheSliders");

    if(data.config.showSlides && data.navigation.slides != null && (hasSeenTheSliders == null||Config.isPreview) ){
      for (let index = 0; index < data.navigation.slides.length; index++) {
        data.navigation.slides[index].image={uri:  data.navigation.slides[index].image};
        data.navigation.slides[index].imageStyle = { 
          width:  data.navigation.slides[index].width|320,
          height: data.navigation.slides[index].height|267 }
          data.navigation.slides[index].textStyle={color: '#838191'};
          data.navigation.slides[index].titleStyle={color: '#302c48',fontWeight: '500'};
      }
      this.setState({
        slides:data.navigation.slides,
        showSliders:true,
        data:data
      })
     
    }
    else{
      this.createNavigation(data)
    }
  }

  //STEP 2 - Create the drawer and all the tree navigation
  createNavigation(data){
    var config = data.config
    //Routes structure
    var routes={};
    var defaultRoute=data.navigation.menus[0].name;

    //Initialize the global design - user in other components on render
    var design=data.design;
    css.dynamic=data.design;
    AppEventEmitter.emit('colors.loaded');
    isReqUserVarification=data.config.userVarification
    allowedUsers=data.config.allowedUsers
    
    Config.config = data.config
    
    //Loop in the menus, for each item create StackNavigator with routes
    //Basicaly, for each item, create his appropriate screens inside StackNavigator
    //The master-detail type is the core one - contains Master, Categories , Master Sub and Details sceen
    //Other screens like cart and orders contains single windows
    data.navigation.menus.map((item,index)=>{

      //Each menu has stack nav with 3 routes, if type is master-detail or undefined
      if(item.type=="cart"||item.sectionType=="cart"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Cart: { screen: ({ navigation })=>(<MyCartSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
        },{
          initialRouteName:"Cart",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      } else if(item.sectionType=="web"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Web: { screen: ({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
        },{
          initialRouteName:"Web",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="orders"||item.sectionType=="orders"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Orders: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
        },{
          initialRouteName:"Orders",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="map"||item.sectionType=="map"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Map: { screen: ({ navigation })=>(<MyMapSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          DetailsFromMap: { screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
        },{
          initialRouteName:"Map",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="notifications"||item.sectionType=="notifications"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Notifications: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
          NotificationDisplay: { screen:({ navigation })=>(<MyNotificationDisplaySreen data={item} navigation={navigation} design={design} />) },
        },{
          initialRouteName:"Notifications",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="profile"||item.sectionType=="profile"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
          header: null,
        })
      },
          ProfileOption1: { screen: ({ navigation })=>(<MyProfileOption1Sreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          ProfileOption2: { screen: ({ navigation })=>(<MyProfileOption2Sreen data={item} navigation={navigation} design={design} isRoot={true} />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers}/>) },
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          ForgetPassword: {screen: ForgetPassword},
          SignUp: { screen: SignUp },
          
         },{
          initialRouteName:Config.profileScreen,
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }
      else if(item.type=="scanner"||item.sectionType=="scanner"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Scanner: { screen: ({ navigation })=>(<MyScannerScreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          DetailsFromScanner: { screen: ({ navigation })=>(<MyDetailsFromScanner data={item} navigation={navigation} design={design} />) },
         },{
          initialRouteName:"Scanner",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="chats"||item.sectionType=="chats"){
        //Create the required screens in StackNavigator
        var theScreen = StackNavigator({
          
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          ProfileOption1: { screen: ({ navigation })=>(<MyProfileOption1Sreen data={item} navigation={navigation} design={design}  />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          ProfileOption2: { screen: ({ navigation })=>(<MyProfileOption2Sreen data={item} navigation={navigation} design={design} />)},
          
        },{
          initialRouteName:'Chats',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }
      else if(item.type=="listOfUsers"||item.sectionType=="listOfUsers"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          ProfileOption1: { screen: ({ navigation })=>(<MyProfileOption1Sreen data={item} navigation={navigation} design={design}  />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          ProfileOption2: { screen: ({ navigation })=>(<MyProfileOption2Sreen data={item} navigation={navigation} design={design} />)},
          
        },{
          initialRouteName:'ListOfUsers',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type==""||item.type==null||item.type=="master-detail"||item.sectionType=="master-detail"||item.type=="wish-list"||item.sectionType=="wish-list"){
        
        //Default
        var initialRootName="Master";

        //In case categories are the one that should be shown first
        if(item.category_first){
          initialRootName="Categories"
        }else if(item.subMenus&&item.subMenus.length>0){
          //When we have sub menus
          initialRootName="MasterSUB"
        }else if(item.goDirectlyToDetails){
          //Goes directly to details
          initialRootName="Details"
        }
        
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Master: { screen: ({ navigation })=>(<MyMastSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Categories: { screen: ({ navigation })=>(<MyCategoriesSreen data={item} navigation={navigation} design={design} isRoot={item.category_first} subMenus={[]} />) },
          MasterSUB: { screen: ({ navigation })=>(<MyCategoriesSreen data={{'categorySetup':item}} navigation={navigation} design={design} isRoot={true} subMenus={item.subMenus} />) },
          Details: { screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
          ForgetPassword: {screen: ForgetPassword},
          SignUp: { screen: SignUp },
          NotificationsSub: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          NotificationDisplay: { screen:({ navigation })=>(<MyNotificationDisplaySreen data={item} navigation={navigation} design={design} />) },
          OrdersSub: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
          ProfileSettingsSub: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          SubProfileOption1: { screen: ({ navigation })=>(<MyProfileOption1Sreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          SubProfileOption2: { screen: ({ navigation })=>(<MyProfileOption2Sreen data={item} navigation={navigation} design={design} isRoot={false} />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} />) },
          ListOfUsersSub: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} />) },
          Comments: { screen:({ navigation })=>(<MyCommentsSreen data={item} navigation={navigation} design={design} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          
        },{
          //initialRouteName:item.category_first?"Categories":(item.subMenus&&(item.subMenus.length>0?"MasterSUB":"Details")),
          initialRouteName:initialRootName,
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }

      //Add navigation options to each StackNavigator
      //Create icon and name
      theScreen.navigationOptions = {
        drawerLabel: item.name,
        tabBarLabel: css.dynamic.general.hideTabIconName?" ":item.name,
        drawerIcon: ({ tintColor }) => (
          <NavigationIcon icon={item.icon} size={24} tintColor={tintColor}/>
        ),
        tabBarIcon: ({ focused,tintColor }) => (
          <NavigationIcon focused={focused} icon={item.icon} tintColor={tintColor} />
        )
      };

      //For each item, inside the routes, add the route with givven name
      routes[item.name]={
        path: '/'+item.name,
        screen: theScreen,
      }
    });
    //END of the loop of menus
    //At this point we have all the routes created.

    //=== LAYOUT CREATION =======
    //Advance or simple coloring
    var tintColor=design.general&&design.general.coloring&&design.general.coloring=="advanced"?design.sideMenu.activeTintColor:design.general.buttonColor;
    
    //Create the login
    this.loginNavi=createStackNavigator({
      Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },

      ForgetPassword: {screen: ForgetPassword},
      //ForgetPassword: { screen: ({})=>(<MyForgetPassSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers}/>)},
      SignUp: { screen: SignUp },
      //SignUp: { screen: ({})=>(<MySignUpSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />)},
      ProfileOption1: { screen: ProfileOption1 },
      
    },{ 
      headerMode: 'screen' 
    })
        
        
    if(design.general&&design.general.layout&&design.general.layout=="tabs"){

      //TABS
      this.navi = createBottomTabNavigator(
        routes,
        {
         
          initialRouteName: defaultRoute,
          tabBarPosition: 'bottom',
          swipeEnabled: false,
          lazyLoad: true,
          animationEnabled: false,

          tabBarOptions: {
            showIcon: true,
            showLabel: !design.general.hideTabIconName,
            activeTintColor: tintColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            indicatorStyle: {
            backgroundColor: tintColor
           },

          style: {
            backgroundColor: design.sideMenu.activeBackgroundColor
          },
          

          },
          contentOptions: {
            activeTintColor: tintColor,
            activeBackgroundColor: design.sideMenu.activeBackgroundColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            inactiveBackgroundColor:design.sideMenu.inactiveBackgroundColor
          },
        }
      );

    }else if(design.general&&design.general.layout&&design.general.layout=="grid"){
      console.log(JSON.stringify(routes))
       //GRID Navigation

      //Options for nav
      var navigationOptions = {
          header: null,
      };

       
       theGridScreen=createStackNavigator({
            GridView: { screen: ({ navigation })=>(<MyGridScreen data={data} navigation={navigation} design={design} isRoot={true} />) },
        },{
            initialRouteName:"GridView",
            headerMode:"none",
            navigationOptions: navigationOptions
        });

       routes['ourGridInitalView']={
        path: '/ourGridInitalView',
        screen: theGridScreen,
      }

       this.navi = createStackNavigator(
           routes,
           {
            initialRouteName: "ourGridInitalView",
            navigationOptions: navigationOptions
           }
       )       
    }else{
      //SIDE Navigation
      this.navi = createDrawerNavigator(
        routes,
        {
          initialRouteName: defaultRoute,
          contentComponent: props =>
            <ScrollView style={{backgroundColor:design.sideMenu.sideNavBgColor}}>
              <View style={css.static.imageLogoHolder}>
                <Image style={css.layout.profileImageEdit} source={this.state.avatar} ></Image>
              </View>
              <View style={css.layout.sideNavTxtParent}>
                  <Text style={css.layout.sideNavText}>{this.state.name}</Text>
                  <Text style={css.layout.sideNavText}>{this.state.bio}</Text>
              </View>
             
              <DrawerItems {...props}></DrawerItems>
            </ScrollView>,
          contentOptions: {
            activeTintColor: tintColor,
            activeBackgroundColor: design.sideMenu.activeBackgroundColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            inactiveBackgroundColor:design.sideMenu.inactiveBackgroundColor
          },
        }
        );
    }

    //=== END LAYOUT ============

    //Notify the state that we have the routes and drwer created, it should rerender the initial screen
    this.setState({
      metaLoaded:true,
      meta:data,
    })
  }
 
  

  back(){
    this.setState({
      openBCScanner:false
    })
  }
  //Show Ads function
  _openInterstitial = () => {
    AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  };

  //DEMO STEP 1 - Retreive list of demo apps
  retreiveAppDemos(){
    var _this=this;
    //Get list of apps, and put the data in the state
    firebase.database().ref("apps").once('value').then(function(snapshot) {
      var allAppsData=snapshot.val();
      var apps=[];
      Object.keys(allAppsData).map(function(key, index) {
         allAppsData[key]["key"]=key;
         apps.push(allAppsData[key])
      });
      _this.setState({allAppsData:apps})
    });
  }

   //DEMO STEP 2 - Crerea an app row, opens single app
   renderAppRow = ({item}) => (
    <TouchableOpacity onPress={()=>{appConfig.expo.extra.firebaseMetaPath=item.key;this.chekIfHaveSliders(item)}}>
      <View style={[AppListStyle.standardRow,{backgroundColor:"#f7f7f7"}]}>
        <View style={AppListStyle.standardRowImageIconArea} >
          <Image style={AppListStyle.standardRowImage} source={{uri:item.appImage}} />
        </View>
        <View style={AppListStyle.standardRowTitleArea} >
          <Text>{fun.callFunction(item.key,"capitalizeFirstLetter,append~ App") }</Text>
        </View>
        <View style={AppListStyle.standardRowArrowArea} >
          <MaterialIcons name={"navigate-next"} size={24} />
        </View>
      </View>
      <View style={[AppListStyle.standardRowSeparator,{backgroundColor:"#bbbbbb"}]}><View style={[AppListStyle.border]} ></View></View>
    </TouchableOpacity>
  );

  //STEP 3 - render
  render() {
    
    if(this.state.metaLoaded&&this.state.isReady){
      //Data is loaded , do we need a login
      if(this.state.meta.config.loginRequired&&!this.state.userAuthenticated){
        
        return (<this.loginNavi isLoggedIn={this.state.userAuthenticated} />);
      }else{
       
          return (
            <ActionSheetProvider>
              <this.navi isLoggedIn={this.state.userAuthenticated} isReqUserVarification={this.state.meta.config.userVarification}  />
            </ActionSheetProvider>
            );

        
          
        
        //Normaly, go inside the app
        
      }
      
    }else{
      if(!Config.isPreview){
        //Normal App, Data is not yet loaded, show the loading screen
        return (
          <View style={css.static.container}>
            <View style={css.static.imageHolder}>
              <Image style={css.static.image} source={require('@images/logo.png')} />
            </View>
            <View style={css.static.loading} >
              <Text style={css.static.text}>v {version} Loading ...</Text>
            </View>
          </View>
        )
      }else{
        //This is a preview app, show the list of Apps
        if(this.state.openBCScanner){
          const { hasCameraPermission } = this.state;

          if(hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
          } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
          } else {
            return (
              <View style={{ flex: 1 }}>
                  
                <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={StyleSheet.absoluteFill}
                >
                <TouchableOpacity
                  onPress={this.back}>
              
                  <View style={{marginTop:40,marginLeft:10}}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeArrowLeft"}  size={25} color='white'/>
                  </View>
              </TouchableOpacity>
              </BarCodeScanner>
             </View>
            );
          }

        }else{
          if(this.state.showSliders){
            if (!this.state.showRealApp) {
              

                return <AppIntroSlider slides={this.state.slides} onDone={this._onDone} renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}/>;
              
          
            }
            
          }else{
            return (
            <View style={{marginTop:50}}>
                <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
                   <Text style={[css.static.text,{fontSize:20}]}>    Choose an app to preview</Text>
                   <ConditionalDisplay condition={Config.showBCScanner}>
                        <TouchableOpacity 
                            onPress={this.openScanner}>
                            <SmartIcon defaultIcons={"MaterialIcons"} name={"MdCropFree"}  size={25} color='black'/>
                        </TouchableOpacity>
                   </ConditionalDisplay>
                   
                </View>
                
                <FlatList
                  style={{marginTop:20}}
                  data={this.state.allAppsData}
                  renderItem={this.renderAppRow}
                />
            </View>
          )
        }
      }
      }

    }
  }

}
