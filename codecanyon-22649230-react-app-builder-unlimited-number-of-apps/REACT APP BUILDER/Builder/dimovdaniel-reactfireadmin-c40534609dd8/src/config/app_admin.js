import firebaseConfig from './firebase_config'

//FireBase - //Since version 6.0.0 , config is fetched from firebase_config.js - for easier setup
exports.firebaseConfig = firebaseConfig.config;

//App setup
exports.adminConfig={
  "appName": "FireAdmin",
  "slogan":"made with love for a better firebase.",
  "design":{
    "sidebarBg":"sidebar-1.jpg", //sidebar-1, sidebar-2, sidebar-3
    "dataActiveColor":"rose", //"purple | blue | green | orange | red | rose"
    "dataBackgroundColor":"black", // "white | black"
  },
  "showItemIDs":false,
  "allowedUsers":null, //If null, allow all users, else it should be array of allowd users
  "allowGoogleAuth":true, //Allowed users must contain list of allowed users in order to use google auth
  "fieldBoxName": "Fields",
  "maxNumberOfTableHeaders":5,
  "prefixForJoin":["-event"],
  "showSearchInTables":true,
  "methodOfInsertingNewObjects":"push", //timestamp (key+time) | push - use firebase keys
  "goDirectlyInTheInsertedNode":true,
  "urlSeparator":"+",
  "urlSeparatorFirestoreSubArray":"~",
  "googleMapsAPIKey":"YOUR_KEY",
  "fieldsTypes":{
    "photo":["photo","image"],
    "dateTime":["end","start"],
    "map":["map","latlng","location"],
    "textarea":["description"],
    "html":["content"],
    "radio":["radio","radiotf","featured"],
    "checkbox":["checkbox"],
    "dropdowns":["status","dropdowns"],
    "file":["video"],
    "rgbaColor":['rgba'],
    "hexColor":['color'],
    "relation":['type','creator'],
    "iconmd":['icon'],
    "iconfa":['iconfa'],
    "iconti":['iconti'],
    "iconio":['iconio'],
  },
  "optionsForDateTime":[
    {"key":"end", "dateFormat":"YYYY-MM-DD" ,"timeFormat":true, "saveAs":"x","locale":"es"},
    {"key":"start", "dateFormat":"X" ,"timeFormat":"HH:mm", "saveAs":"x"},
  ],
  "optionsForSelect":[
      {"key":"dropdowns","options":["new","processing","rejected","completed"]},
      {"key":"checkbox","options":["Skopje","Belgrade","New York"]},
      {"key":"status","options":["just_created","confirmed","canceled"]},
      {"key":"radio","options":["no","maybe","yes"]},
      {"key":"radiotf","options":["true","false"]},
      {"key":"featured","options":["true","false"]}
  ],
  "optionsForRelation":[
      {
        //Firestore - Native
        "display": "name",
        "isValuePath": true,
        "key": "creator",
        "path": "/users",
        "produceRelationKey": false,
        "relationJoiner": "-",
        "relationKey": "type_eventid",
        "value": "name"
      },
      {
        //Firebase - Mimic function
        "display":"name",
        "key":"eventtype",
        "path":"",
        "isValuePath":false,
        "value":"name",
        "produceRelationKey":true,
        "relationJoiner":"-",
        "relationKey":"type_eventid"
      }
  ],
  "paging":{
    "pageSize": 20,
    "finite": true,
    "retainLastPage": false
  },
  "hiddenKeys":["keyToHide","anotherKeyToHide","email"],
  "previewOnlyKeys":["previewOnlyKey","anotherPreviewOnlyKye"]
}

//Navigation
exports.navigation=[
    {
      "link": "/",
      "name": "Dashboard",
      "schema":null,
      "icon":"home",
      "path": "",
       isIndex:true,
    },
    {
      "link": "fireadmin",
      "path": "events",
      "name": "Events",
      "icon":"event",
      "tableFields":["name","description"],
      "subMenus":[
        {
          "link": "fireadmin",
          "path": "events/skopje/items",
          "name": "Skopje",
          "icon":"event",
          "tableFields":["name","description"]
        },{
          "link": "fireadmin",
          "path": "events/sofia/items",
          "name": "Sofia",
          "icon":"event",
          "tableFields":["name","description"],
        },{
          "link": "fireadmin",
          "path": "events/belgrade/items",
          "name": "Belgrade",
          "icon":"event",
          "tableFields":["name","description"],
        }
      ]
    },
    {
      "link": "fireadmin",
      "path": "clubs",
      "name": "Clubs",
      "icon":"room",
      "tableFields":["name","description"],
      "subMenus":[
        {
          "link": "fireadmin",
          "path": "clubs/skopje/items",
          "name": "Skopje",
          "icon":"event",
          "tableFields":["name","description"]
        },{
          "link": "fireadmin",
          "path": "clubs/sofia/items",
          "name": "Sofia",
          "icon":"event",
          "tableFields":["name","description"],
        },{
          "link": "fireadmin",
          "path": "clubs/belgrade/items",
          "name": "Belgrade",
          "icon":"event",
          "tableFields":["name","description"],
        }
      ]
    },
    {
      "link": "fireadmin",
      "path": "userdata/{useruuid}",
      "name": "My Profile",
      "icon": "perm_identity",
      "tableFields":[],
    },
    {
      "link": "fireadmin",
      "path": "bookings",
      "name": "Bookings",
      "icon":"done",
      "tableFields":[],
    },{
      "link": "fireadmin",
      "path": "static",
      "name": "Cities & Genres",
      "icon":"location_city",
      "tableFields":["name","description"],
    },{
      "link": "fireadmin",
      "path": "design",
      "name": "Design",
      "icon":"location_city",
      "tableFields":["name","description"],
    },{
      "link": "firestoreadmin",
      "path": "events",
      "name": "FireStore Events",
      "icon":"event",
      "tableFields":["name"],
    },{
      "link": "link",
      "path": "http://mobidonia.com",
      "name": "Mobidonia.com",
      "icon": "web",
      "tableFields":["name"],
    },{
      "link": "push",
      "path": "",
      "name": "Push notification",
      "icon":"speaker_notes",
      "tableFields":[],
    }
  ];

  //From v 5.1.0 we suggest remoteSetup due to security
  //
exports.pushSettings={
  "remoteSetup":false,
  "remotePath":"pushSettings",
  "pushType":"expo", //firebase -  onesignal - expo
  "Firebase_AuthorizationPushKey":"AIzaSyCFUf7fspu61J9YsWE-2A-vI9of1ihtSiE", //Firebase push authorization ket
  "pushTopic":"news", //Only for firebase push
  "oneSignal_REST_API_KEY":"",
  "oneSignal_APP_KEY":"",
  "included_segments":"Active Users", //Only for onesignal push
  "firebasePathToTokens":"/expoPushTokens", //we save expo push tokens in firebase db
  "saveNotificationInFireStore":true, //Should we store the notification in firestore
}

exports.userDetails={

}

exports.remoteSetup=false;
exports.remotePath="admins/mobidonia";
exports.allowSubDomainControl=false;
exports.subDomainControlHolder="admins/";
exports.isAppCreator=true;
exports.appEditPath=undefined;