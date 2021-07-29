import React, { Component } from 'react';
import { render } from 'react-dom'

import Master from './containers/Master'
import App from './containers/App'
import Fireadmin from './containers/Fireadmin'
import Firestoreadmin from './containers/Firestoreadmin'
import Push from './containers/Push'
import Config from   './config/app';

//Builder
import Sections from './containers/Builder/Sections'
import Producer from './containers/Builder/Producer'
import Apps from './containers/Builder/Apps'
import Create from './containers/Builder/Create'
import Preview from './containers/Builder/Preview'




import { Router, Route,hashHistory,IndexRoute } from 'react-router'

class Admin extends Component {

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminRoutes(item){
    if(item.link=="fireadmin"){
      return (<Route path={"/fireadmin/"+item.path} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the dynamic routes that we need for menu of type fireadmin
  getFireAdminSubRoutes(item){
    if(item.link=="fireadmin"){
      return (<Route path={"/fireadmin/"+item.path+"/:sub"} component={Fireadmin}/>)
    }else{

    }
  }

  //Prints the Routes
  /*
  {Config.adminConfig.menu.map(this.getFireAdminRoutes)}
  {Config.adminConfig.menu.map(this.getFireAdminSubRoutes)}
  */
  render() {


    return (
      <Router history={hashHistory}>
          <Route path={Config.isAppCreator?"/":"/applist"} component={Apps}></Route>
          <Route path="/create" component={Create}></Route>
          <Route component={Master} >
            {/* make them children of `Master` */}
            <Route path={Config.isAppCreator?"/dashboard":"/"} component={App}></Route>
            <Route path="/sections/:sub" key="section" component={Sections}/>
            <Route path="/produce/:sub" key="produce" component={Producer}/>
            <Route path="/preview/:sub" key="preview" component={Preview}/>
            <Route path="/app" component={App}/>
            <Route path="/push" component={Push}/>

            <Route path="/fireadmin" component={Fireadmin}/>
            <Route path="/fireadmin/:sub" component={Fireadmin}/>

            <Route path="/firestoreadmin" component={Firestoreadmin}/>
            <Route path="/firestoreadmin/:sub" component={Firestoreadmin}/>


          </Route>
        </Router>
    );

   }

    
  }


export default Admin;
