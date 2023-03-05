import Header from "components/header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EditMember from "components/editMember.tsx";

import { Container } from "react-bootstrap";

import { useStoreContext } from "components/Store";


export default function Member() {
  const [member, setMember] = useState(null);
  const { setActive, getMemberData, updateMember, user } = useStoreContext();
  useEffect(() => {
    setActive("member");
    if (user) {
      const fetchData = async () => {
        const member = await getMemberData(parseInt(id));
        // fix reminders
        if (!member.reminders || typeof member.reminders === "string") {
          if (!member.reminders) member.reminders = [];
          else
            member.reminders = member.reminders
              .split(",")
              .map((r) => parseInt(r));
        }

        setMember(member);
      };
      fetchData();
    }
  }, [user]);

  

  const router = useRouter();
  const { id } = router.query;
  console.log("member id", id);
 
  return (
    <>
      <Header />
      <Container>
        {member ?
          <>
            <h2 className="text-center">Stuff for you {member.alias}</h2>
            <EditMember member={member} setMember={setMember} />
          </> : (
            <div>Loading</div>
          )}
      </Container>
    </>
  );
}
