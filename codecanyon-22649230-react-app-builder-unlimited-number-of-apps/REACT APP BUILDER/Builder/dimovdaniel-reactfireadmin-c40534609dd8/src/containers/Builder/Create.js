import React, {Component,PropTypes} from 'react'
import {Link,Redirect,browserHistory} from 'react-router'
import NavBar from '../../components/NavBar'
import firebase from '../../config/database'
import Color from '../../components/fields/Color'

class Create extends Component {
  constructor(props){
    super(props);
    this.state = {
        apps:{},
        name:"",
        id:"",
        type:"shop",
        layout:"tabs",
        color:"#000000"
    }
    this.printApps=this.printApps.bind(this);
    this.cloneApp=this.cloneApp.bind(this);
  }


  componentDidMount(){
    window.additionalInit();
    var apps = firebase.app.database().ref('/apps');
    var _this=this;
    apps.on('value', function(snapshot) {
        _this.setState({apps:snapshot.val()})
        
        setTimeout(function() {
            console.log("Templates fetched");
            window.additionalInit();
        },100);
        
    });
  }

  
  endStep(){
      this.setState({
          type:this.appType.value!=""?this.appType.value:"shop",
          layout:this.appLayout.value!=""?this.appLayout.value:"tabs"
      })

      //Check if it already exists
      var slug=this.state.name.replace(/ /g,'').toLowerCase(); 
      var apps = firebase.app.database().ref('/myapps/'+slug);
        var _this=this;
        apps.once('value', function(snapshot) {
            if(JSON.stringify(snapshot.val()).length>10){
                window.getDemo().showNotification('bottom','right','danger',"The name <b>"+_this.state.name+"</b> is aready added. Pls change name.","");
            }else{
                //All ok
                _this.cloneApp(_this.appType.value!=""?_this.appType.value:"shop",_this.state.name,_this.state.id,_this.state.layout);
            }
            
        });


      
  }

  printApps(){
    var _this=this;
    return Object.keys(this.state.apps).map(function(key) {
        console.log(key)
        return (_this.renderAppTemplate(_this.state.apps[key],key));
    })
    
  }

  cloneApp(from,to,id,layout){
    var app = firebase.app.database().ref('/apps/'+from);
    var _this=this;
    app.once('value', function(snapshot) {
        var appToBeSaved=snapshot.val();

        var slug=to.replace(/ /g,'').toLowerCase(); 

        //Convert to json 
        var jsRepr=JSON.stringify(appToBeSaved);
        //console.log(jsRepr);
        var find = 'data_point\":\"';
        var re = new RegExp(find, 'g');
        jsRepr = jsRepr.replace(re, 'data_point\":\"'+slug+'_');
        appToBeSaved=JSON.parse(jsRepr);
       // console.log(jsRepr);

        appToBeSaved.name=to;
        appToBeSaved.id=id;
        appToBeSaved.design.general.layout=layout;
       
        firebase.app.database().ref('myapps/' + slug).set(appToBeSaved);

        browserHistory.goBack();
    });
  }

  renderAppTemplate(appData,key){
    return (
        <div className="col-sm-4">
            <div className="choice" data-toggle="wizard-radio" data-id={key} data-type="type">
                                                <input  className="checkbox" type="checkbox" name="template" value="Design" />
                                                <div className="icon">
                                                    <img  src={appData.appImage} className="picture-src" id="wizardPicturePreview" title="" />
                                                </div>
                                                <h6>{appData.name}</h6>
                                            </div>

        </div>
    )
  }


  


  render() {
    return (
        <div className="container-fluid">
        <div className="col-sm-8 col-sm-offset-2">
            
            <div className="wizard-container">
                <div className="card wizard-card" data-color="rose" id="wizardProfile">
                    <form action="" method="">
                        
                        <div className="wizard-header">
                            <h3 className="wizard-title">
                                Let's make an app
                            </h3>
                            <h5>You can always modify the data later</h5>
                            {/* <p>

                                Name: {this.state.name}<br />
                                ID: {this.state.id}<br />
                                Type: {this.state.type}<br />
                                Layout: {this.state.layout}<br />
                                Color: {this.state.color}<br />
                            </p> */ }
                            <input type="hidden" id="appType"  ref={(input) => this.appType = input}   />
                            <input type="hidden" id="appLayout"  ref={(input) => this.appLayout = input} />
                        </div>
                        <div className="wizard-navigation">
                            <ul>
                                <li>
                                    <a href="#basics" data-toggle="tab">Basics</a>
                                </li>
                                <li>
                                    <a href="#template" data-toggle="tab">Template</a>
                                </li>
                                
                                <li>
                                    <a href="#layout" data-toggle="tab">Layout</a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content">
                            <div className="tab-pane" id="basics">
                                <div className="row">
                                    <h4 className="info-text"> Let's start with the basic information</h4>
                                    <div className="col-sm-2">
                                        
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="material-icons">border_color</i>
                                            </span>
                                            <div className="form-group label-floating">
                                                <label className="control-label">App name
                                                    <small> ( required )</small>
                                                </label>
                                                <input name="name" onChange={(event)=>{this.setState({name:event.target.value})}} type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="material-icons">linear_scale</i>
                                            </span>
                                            <div className="form-group label-floating">
                                                <label className="control-label">App id
                                                    <small> ( required ex. com.mycompany.app )</small>
                                                </label>
                                                <input name="id" type="text"  onChange={(event)=>{this.setState({id:event.target.value})}} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="tab-pane" id="template">
                                <h4 className="info-text"> What kind of app you will make?</h4>
                                <div className="row">
                                    <div className="col-lg-10 col-lg-offset-1">

                                     {this.printApps()}
                                        
                                       
                                    </div>
                                </div>
                            </div>

                            <div className="tab-pane" id="layout">
                                <h4 className="info-text"> Select the layout?</h4>
                                <div className="row">
                                    <div className="col-lg-10 col-lg-offset-1">
                                        <div className="col-sm-6">
                                            <div className="choice" data-toggle="wizard-radio" data-id="tabs" data-type="layout">
                                                <input type="checkbox" name="tabs" value="tabs" />
                                                <div className="icon">
                                                    <i className="material-icons">tab</i>
                                                </div>
                                                <h6>Tabs</h6>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="choice" data-toggle="wizard-radio" data-id="side" data-type="layout">
                                                <input type="checkbox" name="side" value="side" />
                                                <div className="icon">
                                                    <i className="material-icons">subject</i>
                                                </div>
                                                <h6>Side navigation</h6>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                           

                            

                        </div>

                        <div className="wizard-footer">
                            <div className="pull-right">
                                <input type='button' className='btn btn-next btn-fill btn-rose btn-wd' name='next' value='Next' />
                                <input onClick={()=>{this.endStep()}} type='button' className='btn btn-finish btn-fill btn-rose btn-wd' name='finish' value='Finish' />
                            </div>
                            <div className="pull-left">
                                <input type='button' className='btn btn-previous btn-fill btn-default btn-wd' name='previous' value='Previous' />
                            </div>
                            
                            <div className="clearfix"></div>
                        </div>
                        <div style={{"text-align": "center"}}>
                            <br />
                            <br />
                            <a className="button" href="/">Cancel creating app</a>

                            <br />
                            <br />
                        </div>
                    </form>
                </div>
            </div>
           
        </div>
    </div>

        
    )
  }
}
export default Create;
