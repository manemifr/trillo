// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'ionic-trillo-ce464',
    appId: '1:946399230784:web:e8169ceea98d03911e58a5',
    storageBucket: 'ionic-trillo-ce464.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyDMYrxIDvX4r3ANCblwLGMVby-m3MabPU8',
    authDomain: 'ionic-trillo-ce464.firebaseapp.com',
    messagingSenderId: '946399230784',
  },
  production: false,
  firebaseConfig:{
    apiKey: 'AIzaSyDMYrxIDvX4r3ANCblwLGMVby-m3MabPU8',
    authDomain: 'ionic-trillo-ce464.firebaseapp.com',
    projectId: 'ionic-trillo-ce464',
    storageBucket: 'ionic-trillo-ce464.appspot.com',
    messagingSenderId: '946399230784',
    appId: '1:946399230784:web:e8169ceea98d03911e58a5'
  },
  algolia:{
    app:'YIHGNDA15U',
    key:'70873bed41af726051939a3efe3c0b38'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
