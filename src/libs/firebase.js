import * as firebase from 'firebase'

var app = firebase.initializeApp({
    apiKey: "AIzaSyDpC_ZdocIaZAPRXThkhsKsME3pvHTE6f8",
    authDomain: "oilprice-1860c.firebaseapp.com",
    databaseURL: "https://oilprice-1860c.firebaseio.com",
    projectId: "oilprice-1860c",
    storageBucket: "oilprice-1860c.appspot.com",
    messagingSenderId: "965825246892"
});

export default app