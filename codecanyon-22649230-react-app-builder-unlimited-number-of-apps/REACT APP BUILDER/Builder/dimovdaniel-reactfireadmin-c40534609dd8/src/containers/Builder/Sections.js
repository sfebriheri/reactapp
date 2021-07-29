import React, {Component,PropTypes,View} from 'react'
import {Link,Redirect} from 'react-router'
import NavBar from '../../components/NavBar'
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import firebase, { app } from '../../config/database'
import Config from   '../../config/app';
import SectionConfig from '../../config/builder/sections_config';
import {Image} from '../../components/fields'
import Notification from '../../components/Notification';


const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

class Sections extends Component {
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

   generateNotifications(item){
    return (
        <div className="col-md-12">
            <Notification type={item.type} >{item.content}</Notification>
        </div>
    )
}


   appendSection(sectionName,icon){
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

        var lastIndex=Config.appEditPath.lastIndexOf("/");
        lastIndex++;
        var slug=Config.appEditPath.substring(lastIndex);
        


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
        window.getDemo().showNotification('bottom','right','success',"The new component <b>"+sectionName+"</b> has been added. Check it in the sections panel.",icon);
      }else{
        window.getDemo().showNotification('bottom','right','warning',"We couldn't find the required component <b>"+sectionName+"</b>. Make sure you have updated the demo data in firebase.",icon);
      }
    }else{
      window.getDemo().showNotification('bottom','right','danger',"Components not fetched. Pls check install manual.",icon);
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
      this.appendSection(item.componentName,item.icon);
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



   refreshDataAndHideNotification(time=3000){
    //Hide notifications
    setTimeout(function(){this.setState({notifications:[]})}.bind(this), time);
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
        <h3 className="title text-center">App Setup</h3>
        <br />
        <div className="nav-center">
        <ul className="nav  nav-pills nav-pills-rose nav-pills-icons justify-content-center" role="tablist">
          <li className="nav-item active">
            <a className="nav-link active show" data-toggle="tab" href="#link7" role="tablist">
              <i className="material-icons">subject</i> Sections
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#link8" role="tablist">
              <i className="material-icons">playlist_add</i> Add section
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#link9" role="tablist">
              <i className="material-icons">work_outline</i> Basics
            </a>
          </li>
         
        </ul>
        </div>
        <div className="tab-content tab-space tab-subcategories">
          <div className="tab-pane active" id="link7">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">App sections</h4>
                <p className="card-category">
                  Drag n Drop them. Also you can nest them.
                </p>
              </div>
              <div className="card-body">
              <div style={{ height: 400 }}>
      
              <SortableTree
                  maxDepth={2}
                  treeData={this.state.treeData}
                  onChange={treeData => this.processDataForSaving(treeData)}
                  getNodeKey={({ node }) => node.tree_path}
                  generateNodeProps={({ node, path }) => ({
                    buttons: [
                      <Link to={"/fireadmin/navigation+menus+"+this.formIt(path)}>
                      <button className="btn-primary">
                       <i className="fa fa-cog"></i>
                      </button></Link>,
                      <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
                       <div>
                        &nbsp;&nbsp;
                        <Link to={"/firestoreadmin/"+(node.listingSetup&&node.listingSetup.data_point?node.listingSetup.data_point:"")}>
                          <button className="btn-primary">
                            <i className="fa fa-database"></i>
                          </button>
                        </Link>
                       </div>
                      </ConditionalDisplay>,
                      <ConditionalDisplay condition={node.categorySetup&&node.detailsSetup&&node.listingSetup} >
                      <div>
                        &nbsp;&nbsp;
                        <Link to={"/firestoreadmin/"+(node.categorySetup&&node.categorySetup.data_point?node.categorySetup.data_point:"")}>
                         <button className="btn-primary">
                           <i className="fa fa-folder"></i>
                         </button>
                       </Link>
                      </div>
                     </ConditionalDisplay>,
                      
                    ],
                  })}

                  
                />
                </div>
                
              </div>
            </div>
          </div>
          <div className="tab-pane" id="link8">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">Just add the section you like</h4>
                <p className="card-category">
                  Use Master / Detail or some specific one
                </p>
              </div>
              <div className="card-body">
                <div>
                    
                    {/* <button onClick={()=>{this.setState({showAddButton:!this.state.showAddButton})}} className="btn btn-rose"><i className={!this.state.showAddButton?"fa fa-window-restore":"fa fa-minus"}></i> {!this.state.showAddButton?"Add Master detail":"Cancel adding Master detail"}</button> */ }
                    <ConditionalDisplay condition={true} >
                    <div>
                        
                        <hr />
                        MASTER DETAILS VIEWS
                        <br />
                        {this.state.md.map((item)=>{
                          return this.createButton(item,"btn-rose");
                        })}
                        <hr />
                        
                      </div>
                    </ConditionalDisplay>
                    <div>
                        
                        <hr />
                        SPECIFIC VIEWS
                        <br />

                          {this.state.sv.map((item)=>{
                          return this.createButton(item,"btn-primary");
                        })}
                    <hr />
                        <br />
                      </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id="link9">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">App info</h4>
                <p className="card-category">
                  Name, Package id and Icon
                </p>
              </div>
              <div className="card-body" key={this.state.app.appImage}>
                    <br />
                <Image 
                                              parentKey="image" 
                                              options={{}} 
                                              updateAction={(key,value)=>{
                                                this.saveAppInfo("appImage",value);
                                                //alert("update to"+value)
                                              }} 
                                              class="" 
                                              theKey="image"  
                                              value={this.state.app.appImage} />
                                        </div>

                  <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="material-icons">border_color</i>
                                            </span>
                                            <div className="form-group label-floating">
                                                <label className="control-label">App name
                                                    
                                                </label>
                                                <input value={this.state.name} name="name" onChange={(event)=>{
                                                    this.saveAppInfo("name",event.target.value);
                                                  }} type="text" className="form-control" />
                                            </div>
                                        </div>
                    
                    <br />
                    <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="material-icons">linear_scale</i>
                                            </span>
                                            <div className="form-group label-floating">
                                                <label className="control-label">App id
                                                    <small> (ex com.mycompany.app )</small>
                                                </label>
                                                <input  value={this.state.id}  name="id" type="text"  onChange={(event)=>{ this.saveAppInfo("id",event.target.value); }} className="form-control" />
                                            </div>

                                            



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
export default Sections;
