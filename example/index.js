"use strict";

const macContacts = require("../lib");

(async () => {
    await macContacts((data) => {
        console.log(data)
    })
})();
