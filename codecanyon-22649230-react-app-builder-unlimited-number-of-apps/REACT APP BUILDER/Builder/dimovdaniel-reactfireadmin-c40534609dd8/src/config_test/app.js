//FireBase
exports.firebaseConfig = {
    apiKey: "AIzaSyBobusNexOnEjvHWAt1CnTM8R1i6gsnD1k",
    authDomain: "tengolotuyo-dev.firebaseapp.com",
    databaseURL: "https://tengolotuyo-dev.firebaseio.com",
    projectId: "tengolotuyo-dev",
    storageBucket: "tengolotuyo-dev.appspot.com",
    messagingSenderId: "785916580000"
};



//App setup
exports.adminConfig={
  "appName": "TengoLoTuyo Admin",
  "slogan":"de Antorcha Digital",
  "design":{
    "sidebarBg":"sidebar.jpg", //sidebar-1, sidebar-2, sidebar-3
    "dataActiveColor":"green", //"purple | blue | green | orange | red | rose"
    "dataBackgroundColor":"white", // "white | black"
  },
  "showItemIDs":false,
  "allowedUsers":["toledo.adrian@hotmail.com"], //If null, allow all users, else it should be array of allowd users
  "allowGoogleAuth":true, //Allowed users must contain list of allowed users in order to use google auth
  "fieldBoxName": "Fields",
  "maxNumberOfTableHeaders":5,
  "prefixForJoin":[],
  "showSearchInTables":true,
  "methodOfInsertingNewObjects":"push", //timestamp (key+time) | push - use firebase keys
  "goDirectlyInTheInsertedNode":false,
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
  "previewOnlyKeys":["previewOnlyKey","anotherPreviewOnlyKye","name"]
}

//Navigation
exports.navigation=[
    {
      "link": "/",
      "name": "Bienvenido",
      "schema":null,
      "icon":"home",
      "path": "",
       isIndex:true,
    },
    {
      "link": "fireadmin",
      "path": "entidades/categorias",
      "name": "Categorias",	
      "icon":"category",
      "tableFields":["nombre"]
  	},
    {
      "link": "fireadmin",
      "path": "blablabla",
      "name": "Marketing",
      "icon": "work",
      "tableFields":[],
    },{
      "link": "push",
      "path": "",
      "name": "Notificaciones",
      "icon":"speaker_notes",
      "tableFields":[],
    },{
      "link": "link",
      "path": "http://tengolotuyo.com",
      "name": "TengoLoTuyo.com",
      "icon": "web",
      "tableFields":["name"],
    }
  ];

  //From v 5.1.0 we suggest remoteSetup due to security
  //
exports.pushSettings={
  "remoteSetup":false,
  "remotePath":"pushSettings",
  "pushType":"expo", //firebase -  onesignal - expo
  "Firebase_AuthorizationPushKey":"AAAAtvxHUKA:APA91bHuCvrxSC5JuM5_9ehPxasmaxjPhppIfuoYB6DHx39GXYc_9Z0Q9RvQtWfGneMZWqXObnnCT7JZ_6KAmjrqShG_lSd_blY3I4yzLpyxkQwzv15adEYZbY3u7MyT6L-aVeaL3t24", //Firebase push authorization ket
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