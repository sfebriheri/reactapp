import React, {Component,PropTypes} from 'react'
import {Link,Redirect} from 'react-router'
import NavBar from '../../components/NavBar'
import firebase from '../../config/database'
import componentsData from '../../config/builder/components.json'
import AppsData from '../../config/builder/apps.json'

class Apps extends Component {
  constructor(props){
    super(props);
    this.state = {
        apps:{},
        allapps:{},
        filter:"",
    }
    this.printApps=this.printApps.bind(this);
    this.searchChange=this.searchChange.bind(this);
  }
  componentDidMount(){
    var apps = firebase.app.database().ref('/myapps');
    var _this=this;
    apps.on('value', function(snapshot) {
        _this.setState({
            apps:snapshot.val(),
            allapps:snapshot.val()})
        //console.log(snapshot.val());
    });

    //Check if components exists
    var components=firebase.app.database().ref('/components');
    var _this=this;
    components.once('value', function(snapshot) {
     
        if(snapshot.val()==null){
            window.getDemo().showNotification('bottom','right','danger',"Components are not installed. Will try to install now");
            _this.installComponents();
        }else{
            if(JSON.stringify(snapshot.val())!=JSON.stringify(componentsData)){
                window.getDemo().showNotification('bottom','right','warning',"There is an update for components. Will try to install now");
                _this.installComponents();
            }
        }
    });

     //Check if apps exists
     var templates=firebase.app.database().ref('/apps');
     var _this=this;
     templates.once('value', function(snapshot) {
         if(snapshot.val()==null){
             window.getDemo().showNotification('bottom','right','danger',"Templates are not installed. Will try to install now");
             _this.installTemplates();
         }else{
            if(JSON.stringify(snapshot.val())!=JSON.stringify(AppsData)){
                window.getDemo().showNotification('bottom','right','warning',"There is an update for templates. Will try to install now");
                _this.installTemplates();
            }
        }
     });

  }

  installTemplates(){
    var templates=firebase.app.database().ref('/apps');
    templates.set(AppsData);
    templates.on('value', function(snapshot) {
        if(snapshot.val()==null){
        }else{
            setTimeout(function(){ 
                window.getDemo().showNotification('bottom','right','success',"Templates sucesfully installed / updated.");
             }, 2000);

           
        }
        
    });
  }

  installComponents(){
    var components=firebase.app.database().ref('/components');
    components.set(componentsData);
    components.on('value', function(snapshot) {
        if(snapshot.val()==null){
        }else{
            setTimeout(function(){ 
                window.getDemo().showNotification('bottom','right','success',"Components sucesfully installed / updated.");
             }, 2000);
            
        }
        
    });
  }

  printApps(){
    var _this=this;
    return Object.keys(this.state.apps||{}).map(function(key) {
        console.log(key)
        return (_this.renderApp(_this.state.apps[key],key));
    })
  }

  searchChange(event){
    this.setState({
        filter:event.target.value
    })

    if(event.target.value.length>0){

        var _this=this;
        var keys=Object.keys(this.state.allapps);
        var newListOfApps={};
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            if(this.state.allapps[key].name.toLowerCase().indexOf(event.target.value.toLowerCase())!=-1){
                newListOfApps[key]=this.state.allapps[key];
            }
        }

        this.setState({
            apps:newListOfApps,
        });
    }else{
        this.setState({
            apps:this.state.allapps,
        });
    }
  }

  

  renderApp(appData,key){
    return (
        <div className="col-lg-3 cards">
                    <div className="card card-pricing card">
                        <div className="card-body">
                        <h6>{appData.id}</h6>
                        <div className="card-avatar" >
                            <a href={"/#/sections/"+key}>
                                <img  className="img" src={appData.appImage} />
                            </a>
                        </div>
                        <h3 className="card-title">{appData.name}</h3>
                        <a href={"/#/sections/"+key} className="btn btn-round btn-white">Manage app</a>
                        </div>
                    </div>
                </div>
    )
  }

  render() {
    return (
        <div className="container-fluid">

            
  

            <div className="row">
                <div className="col-md-1"></div>
                <div className="col-md-4">
                    <h3>Your apps</h3>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-4">
                    <br  />
                    <input type="text" onChange={this.searchChange} className="form-control" value={this.state.filter} placeholder="Search apps"></input>
                </div>
                <div className="col-md-1"></div>
            </div>
            <div className="row">


                <div className="col-lg-3 cards">
                    <div className="card card-pricing card">
                        <div className="card-body">
                        <h6>Create app from template</h6>
                        <div className="icon icon-rose">
                            <i className="material-icons">add_circle_outline</i>
                        </div>
                        <h3 className="card-title">New app</h3>
                        <a href="/#/create" className="btn btn-round btn-rose">Create app</a>
                        </div>
                    </div>
                </div>

               
                {this.printApps()}

            </div>

        </div>

        
    )
  }
}
export default Apps;
