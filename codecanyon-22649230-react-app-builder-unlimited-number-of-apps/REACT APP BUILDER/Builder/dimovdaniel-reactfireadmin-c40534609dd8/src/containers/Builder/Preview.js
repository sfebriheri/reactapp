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

class Preview extends Component {
  constructor(props){
    super(props);

    this.state = {
    };

  }


  componentDidMount(){


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
        <h3 className="title text-center">App Preview</h3>
        <br />
        <div className="nav-center">
        
        </div>
        <div className="tab-content tab-space tab-subcategories">
          <div className="tab-pane active" id="link10">
            <div className="card text-center">
              <div className="card-header">
                <h4 className="card-title">Preivew your app</h4>
                <p className="card-category">
                  Scan the app with this <a href="http://bit.ly/uniexporeact" target="_blank">preview app</a>
                </p>
               </div>
              <div className="card-body">
              <div className="card-avatar" ><br />
                <img className="img" style={{width:"250px",height:"250px"}} src={"https://api.qrserver.com/v1/create-qr-code/?size=350x350&data="+encodeURIComponent(Config.firebaseConfig.apiKey+";"+Config.firebaseConfig.projectId+";"+Config.appEditPath)} /> 
                <br /><br />
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
export default Preview;
