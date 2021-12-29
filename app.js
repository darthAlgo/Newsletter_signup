const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({encoded: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/89e91f862f";
    const options = {
        method: "POST",
        auth: "ashwani:7f4638c27f082246794b16f02d83fdde-us20"
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

    // -d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
    console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

//API-key:
// 7f4638c27f082246794b16f02d83fdde-us20

//List id:
// 89e91f862f