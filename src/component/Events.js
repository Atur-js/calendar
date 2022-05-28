import React, { useState, useEffect } from "react";
import moment from "moment";
import "./Events.css";
import {
  signInToGoogle,
  initClient,
  getSignedInUserEmail,
  signOutFromGoogle,
  publishTheCalenderEvent,
} from "./Services";


export default function Events() {
  
  let gapi = window.gapi;
  const [signedin, setSignedIn] = useState(false);
  const [googleAuthedEmail, setgoogleAuthedEmail] = useState(null);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calenders, setCalenders] = useState([]);

  // sign in and sign out and get user email
  const getGoogleAuthorizedEmail = async () => {
    let email = await getSignedInUserEmail();
    if (email) {
      setSignedIn(true);
      setgoogleAuthedEmail(email);
    }
  };
  const getAuthToGoogle = async () => {
    let successfull = await signInToGoogle();
    if (successfull) {
      getGoogleAuthorizedEmail();
    }
  };
  const _signOutFromGoogle = () => {
    let status = signOutFromGoogle();
    if (status) {
      setSignedIn(false);
      setgoogleAuthedEmail(null);
    }
  };

  // submit events
  const submit = (e) => {
    e.preventDefault();
    var event = {
      summary,
      description,
      start: {
        dateTime: moment(startTime),
      },
      end: {
        dateTime: moment(endTime),
      },
    };
    publishTheCalenderEvent(event)
    setSummary('');
    setDescription('');
    setStartTime('');
    setEndTime('');
  };

  // get events 

  const handleClickGetEvent = ( e) => {
    e.preventDefault();
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 20,
        orderBy: "startTime",
      })
      .then((response) => {
        return response.result.items;
      })
      .then((data) => {
        setCalenders(data);
      });
  };

  useEffect(() => {
    initClient((success) => {
      if (success) {
        getGoogleAuthorizedEmail();
      }
    });
  }, []);

  return (
    <>
      <div className="App">
        <div className="calenderEvent-wrapper">
          <div className="header">
            <h1>Calendar</h1>
          </div>
          {!signedin ? (
            <div className="google-login">
              <h2>Login with Google 🚀📅</h2>
              <button
                className="btn btn--gradient"
                onClick={() => getAuthToGoogle()}
              >
                <span className="btn__text">Login</span>
              </button>
            </div>
          ) : (
            <div className="bodyForm">
              <div className="signout">
                <p>Email: {googleAuthedEmail}</p>
                <button
                  className="signOutButton"
                  onClick={() => _signOutFromGoogle()}
                >
                  Sign Out
                </button>
              </div>
              <form>
                <div className="eventItem">
                  <label>Title</label>
                  <input
                    placeholder="Title..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  ></input>
                </div>
                <div className="eventItem">
                  <label>Description</label>
                  <input
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>
                </div>

                <div className="eventItem">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    name="timezone"
                    onChange={(e) => setStartTime(e.target.value)}
                  ></input>
                </div>

                <div className="eventItem">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    name="timezone"
                    onChange={(e) => setEndTime(e.target.value)}
                  ></input>
                </div>

                <div className="groupButton">
                  <button
                    className="submitButton submitButton--gradient"
                    type="submit"
                    onClick={(e) => submit(e)}
                  >
                    Submit
                  </button>
                  <button
                    className="eventsButton eventsButton--gradient"
                    type="submit"
                    onClick={(e) => handleClickGetEvent(e)}
                  >
                    Get events
                  </button>
                </div>
              </form>
              <div className="container">
                {calenders.map((calender) => (
                  <div className="eventsDetails" key={calender}>
                    <h4>{calender.summary}</h4>
                    <p>{calender.description}</p>
                    <p>{calender.start.dateTime}</p>
                    <p>{calender.end.dateTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
