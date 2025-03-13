"use strict";

const macContacts = require("../lib");

macContacts((data) => {
    console.log(data);
    // {
    //  progress: { current: 1, total: 42, percent: 0.02 },
    //  contact: {
    //    name: 'Some Interesting Person',
    //    emails: ["some@interesting.email"],
    //    phones: [ '4242424242' ],
    //    birthday: '04/02/1942'
    //  }
    //}
})
