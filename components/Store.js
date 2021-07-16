//import createUseContext from "constate";
import constate from "constate";
import { useState, useEffect } from "react";
import moment from "moment/moment";

import Router from "next/router";
import { Magic } from "magic-sdk";
import { useUser } from "libs/hooks";

function useStore() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [active, setActive] = useState("0");
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

  const user = useUser();

  //const { data: user, error, mutate } = useSWR("/api/user", fetcher);
  //const loading = user === undefined;

  useEffect(() => {
    //const { user, loading } = useAuth();
    getDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doLoggin = async (email) => {
    if (user) {
      setActive("0");
      user.logout();
      Router.push("/");
      return;
    }
    const body = {
      email: email,
    }
    try {
      const didToken = await new Magic(
        process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
      ).auth.loginWithMagicLink({ email });
      const authRequest = await fetch("/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        body: JSON.stringify(body),
      });
      console.log('authRequest', authRequest);
      if (authRequest.ok) {
        console.log("we have logged in!");
        console.log("authRequest", authRequest);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("doLoggin failed", error);
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
  const updateDate = async (data) => {
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
      console.log("updateDate error", error);
      return error;
    }
  };
  const updateLocation = async (data) => {
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
      console.log("updateLocation error", error);
      return error;
    }
  };
  const updateClub = async (data) => {
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
      console.log("updateClub error", error);
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
    currentDate,
    setCurrentDate,
    active,
    setActive,
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
    updateMember,
    updateSquad,
    getMemberData,
    getClubsLocations,
    clubsLocations,
    updateDate,
    updateLocation,
    updateClub,
    getHighScores,
    highScores,
  };
}

const [StoreProvider, useStoreContext] = constate(useStore);

export { useStoreContext, StoreProvider };
