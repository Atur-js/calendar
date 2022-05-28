let gapi = window.gapi;
// api key and client id from google api
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// const CLIENT_ID = "795915910255-sg16q194gecqqmciuq08f0htkjlgi7fc.apps.googleusercontent.com";
const CLIENT_ID = "795915910255-raoqcshoanrmgnqceikhpb7g7i5fpilj.apps.googleusercontent.com";
const API_KEY = "AIzaSyDElL7LEMO2Lu-KDx6QAe27QeZIJXVTN4Y"; 
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

// init our calendar

export function initClient(callback) {
    gapi.load('client:auth2',()=>{
        try {
            gapi.client
              .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
                plugin_name: "calendar",
              })
              .then(
                function () {
                  if (typeof callback === "function") {
                    callback(true);
                  }
                },
                function (error) {
                  console.log(error);
                }
              );
        } catch (error) {
            console.log(error);
        }
    });
};



export const checkSignInStatus = async () => {
  try {
    let status = await gapi.auth2.getAuthInstance().isSignedIn.get();
    return status;
  } catch (error) {
    console.log(error);
  }
};

  // signin

  export const signInToGoogle = async () => {
    try {
      let googleuser = await gapi.auth2
        .getAuthInstance()
        .signIn({ prompt: "consent" });
      if (googleuser) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //sign out
export const signOutFromGoogle = () => {
  try {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      auth2.disconnect();
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

// get user email

export const getSignedInUserEmail = async () => {
  try {
    let status = await checkSignInStatus();
    if (status) {
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      return profile.getEmail();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

//when submit events

export const publishTheCalenderEvent = (event) => {
  try {
    gapi.client.load("calendar", "v3", () => {
      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute(function (event) {
        console.log("Event created: " + event.htmlLink);
         window.open(event.htmlLink);
      });
    });
  } catch (error) {
    console.log(error);
  }
};