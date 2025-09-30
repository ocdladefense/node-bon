/**
 * https://expressjs.com/en/starter/hello-world.html
 * OpenID: https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_using_openid.htm&type=5
 * So we can extract some user information.
 */


require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); // Import the path module
const fs = require('fs');
const app = express();
const port = process.env.PORT || 80;


function iterateDirectorySync(directoryPath) {

    let files = [];

    try {
        const filesAndFolders = fs.readdirSync(directoryPath);

        filesAndFolders.forEach(item => {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isFile()) {
                console.log(`File: ${itemPath}`);
                files.push(path.basename(itemPath));
            } else if (stats.isDirectory()) {
                console.log(`Directory: ${itemPath}`);
                // Recursively call for subdirectories
                files = files.concat(iterateDirectorySync(itemPath));
            }
        });
    } catch (err) {
        console.error(`Error iterating directory: ${err.message}`);
    }

    return files;
}

// Example usage:



const SF_ACCESS_TOKEN = process.env.SF_OAUTH_SESSION_ACCESS_TOKEN_OVERRIDE;



/*
from webpack.json

new webpack.DefinePlugin({
                USE_MOCK: JSON.stringify(env.USE_MOCK || false),// Can we even pass booleans from the CLI?
                MODULE_PATH: JSON.stringify(env.MODULE_PATH || ""),
                API_KEY: JSON.stringify(env.API_KEY),
                SF_ACCESS_TOKEN: JSON.stringify(env.SF_ACCESS_TOKEN),
                SF_INSTANCE_URL: JSON.stringify(env.SF_INSTANCE_URL),
                SF_ACCESS_TOKEN: JSON.stringify(env.SF_ACCESS_TOKEN),
                SF_USER_ID: JSON.stringify(env.SF_USER_ID)
            }),
*/


// Serve static files from the 'dist' directory
app.use(express.static('dist'));


app.use(cookieParser());



const metaData = {
    "2": "Chapter 2 Motions Against the Charging Instrument",
    "3": "Chapter 3 Release From Custody",
    "4": "Chapter 4 Notices",
    "5": "Chapter 5 Dismissal of Charges",
    "6": "Chapter 6 Psychiatric",
    "7": "Chapter 7 Pretrial Motions"
};


app.get("/toc", (req, res) => {

    let book = "clfb";
    let chapters = ["2", "3", "4", "5", "6", "7"];
    // res.sendFile(path.join(__dirname, 'data', 'toc.json'));

    let files = {};

    chapters.forEach(chapter => {
        let chapterName = metaData[chapter];
        let chapterPath = `./data/${book}/${chapter}`;
        let chapterFiles = iterateDirectorySync(chapterPath);
        files[chapterName] = chapterFiles;
    });

    res.json(files);
});


// Todo, turn this into a POST endpoint.
app.get("/introspect", async (req, res) => {

    const data = new URLSearchParams({
        token: SF_ACCESS_TOKEN,
        client_id: SF_OAUTH_SESSION_CLIENT_ID,
        client_secret: SF_OAUTH_SESSION_CLIENT_SECRET,
        token_type_hint: "access_token"
    });

    console.log(data);

    // Exchange authorization code for access token & id_token.
    const resp = await fetch(SF_OAUTH_SESSION_INSTANCE_URL + "/services/oauth2/introspect", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const access_token_data = await resp.json();
    console.log(access_token_data);
});







app.get("/login", (req, res) => {
    const state = "some_state";
    // const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const loginUrl = `${process.env.SF_OAUTH_SESSION_URL}?client_id=${process.env.SF_OAUTH_SESSION_CLIENT_ID}&redirect_uri=${process.env.SF_OAUTH_SESSION_CALLBACK_URL}&response_type=code&state=${state}`;//&scope=${scopes}`;
    res.redirect(loginUrl);
});



app.get("/logout", (req, res) => {

    res.cookie('instanceUrl', '', { expires: new Date(0) }); // Setting expiration to epoch
    res.cookie('accessToken', '', { expires: new Date(0) }); // Setting expiration to epoch
    res.redirect("/");
});




app.get("/oauth/api/request", async (req, res) => {

    console.log(req.query);

    const { code } = req.query;


    const data = new URLSearchParams({
        code,
        client_id: process.env.SF_OAUTH_SESSION_CLIENT_ID,
        client_secret: process.env.SF_OAUTH_SESSION_CLIENT_SECRET,
        redirect_uri: process.env.SF_OAUTH_SESSION_CALLBACK_URL,
        grant_type: "authorization_code"
    });

    console.log(data);

    // Exchange authorization code for access token & id_token.
    const response = await fetch(process.env.SF_OAUTH_SESSION_TOKEN_URL, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    console.log("Receiving response...");
    const access_token_data = await response.json();
    console.log(access_token_data);


    res.cookie('instanceUrl', access_token_data.instance_url, { maxAge: 86400000 }); // Cookie expires in 24 hours
    res.cookie('accessToken', access_token_data.access_token, { maxAge: 86400000 }); // Cookie expires in 24 hours
    // What is id_token?
    const { id_token } = access_token_data;

    res.redirect("/");
});






app.get("/connect", async (req, res) => {

    const data = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SF_OAUTH_APPLICATION_CLIENT_ID,
        client_secret: process.env.SF_OAUTH_APPLICATION_CLIENT_SECRET
    });

    console.log(data);

    // Exchange authorization code for access token & id_token.
    const response = await fetch(process.env.SF_OAUTH_APPLICATION_TOKEN_ENDPOINT, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    console.log("Receiving client credential response...");
    const token = await response.json();
    console.log(token);

    res.json(token);
});





// Define a route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});




// Define a route to serve index.html
app.all('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});




// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



// https://ocdla--ocdpartial.sandbox.my.site.com/services/oauth2/authorize

