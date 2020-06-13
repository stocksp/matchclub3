//import createUseContext from "constate";
import constate from "constate";
import { useState, useEffect } from "react";
import moment from "moment/moment";
import { firebase } from "../libs/firebase";
import Router from "next/router";

function useStore() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [active, setActive] = useState("0");
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [dates, setDates] = useState([]);
  const [hasDates, setHasDates] = useState(false);
  const [teamStats, setTeamStats] = useState([]);
  const [matchStats, setMatchStats] = useState(null);
  const [scores, setScores] = useState(null);
  const [hasScores, setHasScores] = useState(false);
  const [squad, setSquad] = useState({});
  const [hasSquad, setHasSquad] = useState(false);
  const [hasSquads, setHasSquads] = useState(false);
  const [squads, setSquads] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [hasAllMembers, setHasAllMembers] = useState(false);
  const [clubsLocations, setClubsLocations] = useState(null);
  const [highScores, setHighScores] = useState(null);
  //const [storeLoaded, setStoreLoaded] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(doAuthChange);
    getDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const doAuthChange = async (user) => {
    console.log("user is", user ? `${user.email}` : "null");
    if (user) {
      const memberId = localStorage.getItem("memberId");
      const alias = localStorage.getItem("alias");
      const role = localStorage.getItem("role");
      if (memberId && alias && role) {
        user.memberId = parseInt(memberId);
        user.alias = alias;
        user.role = role;

        setCurrentUser(user);
        setStoreLoaded(true);
        // testing here
        // const token = await user.getIdToken();
        // const myHeaders = new Headers({
        //   "Content-Type": "application/json",
        //   Authorization: token
        // });
        // console.log(token);

        // const rep = await getData(`http://localhost:8080/test`, myHeaders);

        // console.log("resp", rep);
      } else {
        const response = await fetch("/api/getMemberId?email=" + user.email);

        const myJson = await response.json();
        user.memberId = myJson.id;
        user.alias = myJson.alias;
        user.role = myJson.role;
        localStorage.setItem("memberId", myJson.id);
        localStorage.setItem("alias", myJson.alias);
        localStorage.setItem("role", myJson.role);
        setCurrentUser(user);
        setStoreLoaded(true);
      }
    } else {
      localStorage.removeItem("memberId");
      localStorage.removeItem("alias");
      localStorage.removeItem("role");
      setCurrentUser(user);
      setStoreLoaded(true);
      Router.push("/");
    }
  };
  const doLoggin = async (email, pw) => {
    if (currentUser) {
      setActive("0");
      firebase.auth().signOut();
      return;
    }
    try {
      const resp = await firebase.auth().signInWithEmailAndPassword(email, pw);
      return resp;
    } catch (error) {
      return error;
    }
  };
  const getDates = async (force = false) => {
    if (!hasDates || force) {
      try {
        console.log("store getDates called");
        const response = await fetch("/api/getData?name=getDates");
        const myJson = await response.json();
        console.log("getDates called", myJson);
        // convert the Json date
        myJson.forEach((d) => {
          d.date = moment(d.date).toDate();
        });
        setDates(myJson);
        setHasDates(true);
        console.log("we have dates!");
      } catch (e) {
        console.log("Can't get dates", e);
      }
    }
  };
  const getTeamStats = async () => {
    try {
      const response = await fetch("/api/getData?name=getTeamStats");
      const myJson = await response.json();
      setTeamStats(myJson);
      //setHasTeamStats(true);
    } catch (e) {
      alert(`Sorry ${e}`);
    }
  };
  const getMatchStats = async () => {
    try {
      const response = await fetch("/api/getData?name=getMatchStats");
      const myJson = await response.json();
      setMatchStats(myJson);
      //setHasTeamStats(true);
    } catch (e) {
      alert(`Sorry ${e}`);
    }
  };
  const getScores = async (force = false) => {
    if (!hasScores || force) {
      const response = await fetch("/api/getScores");
      const myJson = await response.json();

      setScores(myJson);
      setHasScores(true);
    }
  };
  const updateScores = async (dateId, match, season, scores, won, lost) => {
    console.log("going to call fetch with /api/updateScores");
    console.log("scores", scores);
    const theData = JSON.stringify({
      dateId,
      match,
      scores,
      season,
      won,
      lost,
    });

    try {
      const resp = await fetch("/api/updateScores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: theData,
      });
      console.log("updateScores returned", resp);
      // TODO maybe just update the local data with what we have ??
      // for now just get all the scores from the server
      await getScores(true);
      return resp;
    } catch (error) {
      console.log("error in call to updateScores", error);
      return error;
    }
  };
  // get the squad for this dateId
  const getSquad = async (id) => {
    try {
      const response = await fetch(`/api/getData?dateId=${id}&name=getSquad`);
      const myJson = await response.json();
      setSquad(myJson.squad);
      setHasSquad(true);
    } catch (e) {
      alert(`Sorry ${e}`);
    }
  };
  const getSquads = async (force = false) => {
    if (!hasSquads || force) {
      try {
        const response = await fetch(`/api/getData?name=getSquads`);
        let myJson = await response.json();
        myJson = myJson.map((s) => (s.squad ? s : { ...s, squad: [] }));
        setSquads(myJson);
        setHasSquads(true);
      } catch (e) {
        alert(`Sorry ${e}`);
      }
    }
  };
  const doSquadAction = async (action, dateId, bowlerId, name) => {
    try {
      if (action === "Remove Me") {
        const resp = await fetch("/api/removeBowlerFromSquad", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateId,
            bowlerId,
          }),
        });
        return resp;
      } else {
        const resp = await fetch("/api/addBowlerToSquad", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateId,
            bowlerId,
            name,
          }),
        });
        return resp;
      }
    } catch (error) {
      return error;
    }
  };
  // TODO no return value??
  const getAllMembers = async (force = false) => {
    if (!hasAllMembers || force) {
      try {
        const response = await fetch("/api/getData?name=getAllMembers");
        const myJson = await response.json();
        setAllMembers(myJson);
        setHasAllMembers(true);
      } catch (e) {
        alert(`Sorry ${e}`);
      }
    }
  };
  const pwChange = async (email, pw) => {
    try {
      const resp = await fetch("/api/changePW", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pw,
        }),
      });
      const mesg = await resp.json();
      console.log(mesg);
      return mesg;
    } catch (error) {
      return error;
    }
  };
  const updateMember = async (data) => {
    try {
      console.log("calling updateMember", data);
      const resp = await fetch("/api/updateData?name=updateMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const message = await resp.json();

      if (message.message === "aok") {
        const theIndex = allMembers.findIndex(
          (m) => m.memberId === data.memberId
        );
        if (theIndex > -1) {
          console.log("replacing", allMembers[theIndex], "with", data);
          allMembers[theIndex] = data;
          setAllMembers([...allMembers]);
        } else {
          // add a newOne
          allMembers.push(data);
          setAllMembers([...allMembers]);
        }
      }
      return message;
    } catch (error) {
      return error;
    }
  };
  const updateSquad = async (data) => {
    try {
      console.log("calling updateSquad", data);
      const resp = await fetch("/api/updateSquad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const message = await resp.json();

      if (message.message === "aok") {
        await getSquads(true);
      }
      return message;
    } catch (error) {
      return error;
    }
  };
  const getMemberData = async (id) => {
    try {
      const response = await fetch(`/api/getData?name=getMemberData&id=${id}`);
      const doc = await response.json();
      return doc;
    } catch (e) {
      return e;
    }
  };
  const getClubsLocations = async (force = false) => {
    if (!clubsLocations || force) {
      const response = await fetch("/api/getData?name=getClubsLocations");
      const { clubs, locations } = await response.json();
      setClubsLocations({ clubs, locations });
      console.log("got clubs and locations");
    }
  };
  const updateDate = async data => {
    try {
      console.log("calling updateData", data);
      const resp = await fetch("/api/updateData?name=updateDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //TODO why does this fail with current updateData?
      //const message = await resp.json();

      if (resp.ok) {
        await getDates(true);
      }
      return resp;
    } catch (error) {
      console.log("updateDate error", error)
      return error;
    }
  };
  const updateLocation = async data => {
    try {
      console.log("calling updateData", data);
      const resp = await fetch("/api/updateData?name=updateLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //TODO why does this fail with current updateData?
      //const message = await resp.json();

      if (resp.ok) {
        await await getClubsLocations(true);
      }
      return resp;
    } catch (error) {
      console.log("updateLocation error", error)
      return error;
    }
  };
  const updateClub = async data => {
    try {
      console.log("calling updateData", data);
      const resp = await fetch("/api/updateData?name=updateClub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //TODO why does this fail with current updateData?
      //const message = await resp.json();

      if (resp.ok) {
        await await getClubsLocations(true);
      }
      return resp;
    } catch (error) {
      console.log("updateClub error", error)
      return error;
    }
  };
  // get the members stats for everyone
  const getHighScores = async () => {
    try {
      const response = await fetch("/api/getData?name=getHighScores");
      const myJson = await response.json();
      setHighScores(myJson);
    } catch (e) {
      alert(`Sorry ${e}`);
    }
  };


  return {
    getDates,
    hasDates,
    dates,
    currentUser,
    currentDate,
    setCurrentDate,
    active,
    setActive,
    storeLoaded,
    doLoggin,
    getTeamStats,
    teamStats,
    getMatchStats,
    matchStats,
    getScores,
    scores,
    updateScores,
    getSquad,
    setHasSquad,
    hasSquad,
    squad,
    hasSquads,
    squads,
    getSquads,
    setSquads,
    doSquadAction,
    getAllMembers,
    hasAllMembers,
    allMembers,
    pwChange,
    updateMember,
    updateSquad,
    getMemberData,
    getClubsLocations,
    clubsLocations,
    updateDate,
    updateLocation,
    updateClub,
    getHighScores,
    highScores
    
  };
}

const [StoreProvider, useStoreContext] = constate(useStore);

export { useStoreContext, StoreProvider };
