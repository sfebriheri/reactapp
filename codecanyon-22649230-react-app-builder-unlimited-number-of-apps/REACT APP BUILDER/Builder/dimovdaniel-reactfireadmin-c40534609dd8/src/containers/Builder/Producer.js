import React, {Component,PropTypes,View} from 'react'
import {Link,Redirect} from 'react-router'
import NavBar from '../../components/NavBar'
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import firebase, { app } from '../../config/database'
import Config from   '../../config/app';
import SectionConfig from '../../config/builder/sections_config';
import {Image} from '../../components/fields'
var fileDownload = require('js-file-download');


const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

const appJSONTemplate={
  "expo": {
    "name": "UniApp",
    "description": "App Platform - All in one React Native Universal Mobile App. \nThis is all in one Multi-Purpose Expo React Native Mobile app.\nIt works for iPhone and Android. In fact, this is a bundle of multiple apps, that follow same design and coding pattern. Buy this app for for $49$ on https://codecanyon.net/item/universal-app-platform-full-multipurpose-all-in-one-react-native-mobile-app/21247686",
    "slug": "uniexpoapp",
    "privacy": "private",
    "sdkVersion": "26.0.0",
    "version": "1.0.0",
    "orientation": "portrait",
    "primaryColor": "#cccccc",
    "extra":{
      "firebaseMetaPath":"/meta",
      "firebaseConfig" : {}
    },
    "icon": "./assets/icons/app.png",
    "loading": {
      "icon": "./assets/icons/loading.png",
      "hideExponentText": false
    },
    "packagerOpts": {
      "assetExts": ["ttf", "mp4"]
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.mobidonia.uniexpoapp"
    }
  }
};

class Producer extends Component {
  constructor(props){
    super(props);

    this.state = {
      treeData: [],
      showAddButton:false,
      components:null,
      name:"",
      id:"",
      appImage:"",
      app:{
        appImage:""
      },
      md:SectionConfig.md,
      sv:SectionConfig.sv
    };

    this.processDataForShowing=this.processDataForShowing.bind(this);
    this.processDataForSaving=this.processDataForSaving.bind(this);
    this.appendSection=this.appendSection.bind(this);
    this.saveAppInfo=this.saveAppInfo.bind(this);
    this.startDownload=this.startDownload.bind(this);
    this.startDownloadImage=this.startDownloadImage.bind(this);
    this.appKey="";

  }


  componentDidMount(){

    /*if(this.props.params&&this.props.params.sub){
      this.appKey=this.props.params.sub;
    }*/

    //console.log("<---------->"+Config.appEditPath+"<------------>");
    var menus = firebase.app.database().ref(Config.appEditPath+'/navigation/menus');
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    var components=firebase.app.database().ref('/components/navigation/menus');

    var _this=this;
    menus.on('value', function(snapshot) {
        console.log(snapshot.val());
        _this.processDataForShowing(snapshot.val()) 
    });

    wholeApp.once('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({
        app:snapshot.val(),
        name:snapshot.val().name,
        id:snapshot.val().id,
        appImage:snapshot.val().appImage
      })
    });

    components.on('value', function(snapshot) {
      console.log(snapshot.val());
      _this.setState({components:snapshot.val()}) 
  });

   }

   startDownloadImage(){
    fetch(this.state.app.appImage)
    //                         vvvv
    .then(response => response.blob())
    .then(images => {
      fileDownload(images, 'app.png');
    })

   
   }

   startDownload(){
    appJSONTemplate.expo.name=this.state.app.name;
    appJSONTemplate.expo.description="Made with react app builder";
    appJSONTemplate.expo.slug=this.getSlug();
    appJSONTemplate.expo.extra.firebaseMetaPath=Config.appEditPath;
    appJSONTemplate.expo.extra.firebaseConfig=Config.firebaseConfig;
    appJSONTemplate.expo.android.package=this.state.id;

     fileDownload(JSON.stringify(appJSONTemplate, null, 2), 'app.json');
   }

   getSlug(){
    var lastIndex=Config.appEditPath.lastIndexOf("/");
    lastIndex++;
    var slug=Config.appEditPath.substring(lastIndex);
    return slug;
   }

   appendSection(sectionName){
    if(this.state.components!=null){
      var selectedSection=null;
      for (let index = 0; index < this.state.components.length; index++) {
        const element = this.state.components[index];
        if(element.name.toLowerCase()==sectionName.toLowerCase()){
          selectedSection=element;
        }
      }

      if(selectedSection!=null){
        //alert(selectedSection);
        var treeData=this.state.treeData;
        var slug=this.getSlug();
        


          //Convert to json 
          var jsRepr=JSON.stringify(selectedSection);
          //console.log(jsRepr);
          var find = 'data_point\":\"';
          var re = new RegExp(find, 'g');
          jsRepr = jsRepr.replace(re, 'data_point\":\"'+slug+'_');
          selectedSection=JSON.parse(jsRepr);
         // console.log(jsRepr);


        treeData.push(selectedSection);
        //console.log(treeData);
        this.saveNewMenuStructure(treeData);
        alert ("The new component has been added. Check it in the section panel.")
      }else{
        alert ("We couldn't find the required component. Make sure you have updated the demo data in firebase.")
      }
    }else{
      alert("Components not fetched. Pls check install manual.");
    }
   }

   saveNewMenuStructure(menus){
    firebase.app.database().ref(Config.appEditPath+'/navigation/menus').set(menus);
   }

   saveAppInfo(key,value){
     var update={};
     update[key]=value;
    this.setState(update);
    firebase.app.database().ref(Config.appEditPath+'/'+key).set(value);
   }

   processDataForShowing(data){
    //console.log(JSON.stringify(data));
    for (let index = 0; index < data.length; index++) {
      data[index].title= data[index].name;
      data[index].expanded=true;
      data[index].tree_path=index;
      if(data[index].subMenus){
        data[index].children= data[index].subMenus;

        for (let j = 0; j < data[index].children.length; j++) {
          data[index].children[j].title= data[index].children[j].name;
          data[index].children[j].tree_path= index+Config.adminConfig.urlSeparator+"subMenus"+Config.adminConfig.urlSeparator+j;
        }


      }
    }

    this.setState({ treeData:data })
    //console.log(JSON.stringify(data));
   }

   processDataForSaving(treeData){
    var data=JSON.parse(JSON.stringify(treeData));
    this.setState({ treeData })

    for (let index = 0; index < data.length; index++) {
      delete data[index].title;
      delete data[index].expanded;
      delete data[index].tree_path;

      if(data[index].children){
        data[index].subMenus= data[index].children;

        delete data[index].children;
        for (let j = 0; j < data[index].subMenus.length; j++) {
          delete data[index].subMenus[j].title;
          delete data[index].subMenus[j].expanded;
          delete data[index].subMenus[j].tree_path;
        }


      }
    }
    this.saveNewMenuStructure(data);
    
   }

   createButton(item,theClass){
    return <button onClick={()=>{
      this.appendSection(item.componentName);
    }} className={"btn "+theClass}><i className={item.icon}></i> {item.name}</button>
   } 

   generateIndex(index){
     var expandedCount=0;
     this.state.treeData.forEach(element => {
       if(element.expanded&&element.subMenus&&element.subMenus.length>0){
        expandedCount++;
       }
     });
    return expandedCount; parseInt(index)+1;
   }

   formIt(path){
    if((path+"").indexOf(',') == -1){
      return path;
    }else{
      return (path+"").substring((path+"").indexOf(',')+1);
    }
   }


  render() {

    var Iframe = React.createClass({     
        render: function() {
          return(         
            <div>          
              <iframe frameBorder={"0"} src={this.props.src} height={this.props.height} width={this.props.width}/>         
            </div>
          )
        }
      });

    return (
      <div className="main-panel">
        <NavBar></NavBar>




        <div className="row">
    <div className="center col-md-8 ml-auto mr-auto">
      <div className="page-categories">
        <h3 className="title text-center">Produce your app</h3>
        <br />
        <div className="nav-center">
        <ul className="nav  nav-pills nav-pills-rose nav-pills-icons justify-content-center" role="tablist">
          <li className="nav-item active">
            <a className="nav-link active show" data-toggle="tab" href="#link7" role="tablist">
              <i className="material-icons">cloud_download</i> 1. Download
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#link8" role="tablist">
              <i className="material-icons">playlist_add</i> 2. Place it
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#link9" role="tablist">
              <i className="material-icons">photo</i> 3. Set icon
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#link10" role="tablist">
              <i className="material-icons">check_circle_outline</i> Produce app
            </a>
          </li>
        </ul>
        </div>
        <div className="tab-content tab-space tab-subcategories">
          <div className="tab-pane active" id="link7">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">Step 1. Download app config file</h4>
                <p className="card-category">
                  Get the app.json config file with click on the download button.
                </p>
              </div>
              <div className="card-body">
              <div>
                <br /><br />
              <button onClick={()=>{this.startDownload()}} className="btn btn-rose btn-lg"><i className="material-icons">cloud_download</i>   Download</button>
              <br /><br /><br /><br />
              </div>
                
              </div>
            </div>
          </div>
          <div className="tab-pane" id="link8">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">Step 2. Place the app.json file</h4>
                <p className="card-category">
                  Move the file to the correct location
                </p>
              </div>
              <div className="card-body">
                <p>Move the downloaded app.json file in your source code</p>
              </div>
            </div>
          </div>
          <div className="tab-pane" id="link9">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">Step 3. Download and place the icon</h4>
                <p className="card-category">
                  Place the incon in ./assets/icons/app.png
                </p>
              </div>
              <div className="card-body" key={this.state.app.appImage}>
                    <br />
                    <div>
                      <br />
                      <a href={this.state.app.appImage} target="_blank"> 
                        <button className="btn btn-rose "><i className="material-icons">photo</i>   Download Icon</button>
                      </a>
                      <br /><br /><br /><br />
                    </div>
                
               </div>

                  

                                            


   
    
            </div>
          </div>
          <div className="tab-pane" id="link10">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">2. Produce the app</h4>
                <p className="card-category">
                  Follow this <a href="https://docs.expo.io/versions/v29.0.0/distribution/" target="_blank">guide</a> to Distribute your app on Google Play and app store.
                </p>
               </div>
              <div className="card-body">
             <p>That is all, In most cases your next app updates will not require app recoding. All you need to do is push from the Expo App.</p>

             
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>
    )
  }
}
export default Producer;
