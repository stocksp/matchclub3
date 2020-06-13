import React, { useContext, useState, useEffect } from "react";
import Header from "components/header";
import AdminHeader from "components/adminHeader";
import { Container, Button, Table, Spinner } from "react-bootstrap";
import EditMember from "components/editMember";
import { useStoreContext } from "components/Store";
import { MdEdit } from "react-icons/md";

function Members() {
  const [edit, setDoEdit] = useState(false);
  const [memToEdit, setMemToEdit] = useState(null);
  const {
    getAllMembers,
    allMembers,
    updateMember,
    setActive,
  } = useStoreContext();
  useEffect(() => {
    setActive("admin.members");
    getAllMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = () => {
    setDoEdit(false);
    // setDateToEdit(null);
  };

  const doEdit = (mem, index) => {
    console.log("Setting do Edit true for", mem.alias);
    setMemToEdit(mem);
    setDoEdit(true);
  };
  const getNextFake = () => {
    let num = 1;
    allMembers.forEach((m) => {
      const match = m.email.match(/bowler(\d+)@cornerpins/);
      if (match) {
        const val = parseInt(match[1]);

        if (val > num) num = val;
      }
    });
    return `bowler${num + 1}@cornerpins.com`;
  };

  const doNew = () => {
    setMemToEdit({
      active: true,
      address: "",
      alias: "",
      cell: "",
      city: "",
      club: "",
      clubId: 15,
      email: getNextFake(),
      first: "",
      guest: false,
      last: "",
      meetingreminders: "",
      phone: "",
      reminders: [],
      state: "",
      zip: "",
    });
    setDoEdit(true);
  };
  // TODO fix db member alias and remove "Guest - " and remove it from here
  if (allMembers) {
    allMembers.sort((a, b) => {
      const a1 = a.alias.replace("Guest - ", "").split(" ").slice(-1)[0];
      const b1 = b.alias.replace("Guest - ", "").split(" ").slice(-1)[0];
      if (a1 < b1) return -1;
      if (a1 > b1) return 1;
      return 0;
    });
    allMembers.forEach((m) => (m.alias = m.alias.replace("Guest - ", "")));
  }
  if (!allMembers)
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5%",
            marginLeft: "5%",
            marginRight: "5%",
          }}
        >
          <AdminHeader /> <Spinner animation="border" variant="dark" />
          <Spinner animation="grow" variant="dark" />{" "}
        </Container>
      </>
    );

  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "-5%",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <AdminHeader />

        {!edit && allMembers ? (
          <>
            <h2 className="text-center">
              Members
              <span>
                <Button variant="primary" onClick={doNew}>
                  Create New Member
                </Button>
              </span>
            </h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Alias</th>
                  <th>Email</th>
                  <th>First</th>
                  <th>Last</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip</th>
                  <th>Phone</th>
                  <th>Cell</th>
                  <th>Active</th>
                  <th>Guest</th>
                </tr>
              </thead>
              <tbody>
                {allMembers.map((m, i) => {
                  return (
                    <tr key={i}>
                      <td align="left">{m.alias}</td>
                      <td align="left">{m.email ? m.email : ""}</td>
                      <td align="left">{m.first ? m.first : ""}</td>
                      <td align="left">{m.last ? m.last : ""}</td>
                      <td align="left">{m.address ? m.address : ""}</td>
                      <td align="left">{m.city ? m.city : ""}</td>
                      <td align="left">{m.state ? m.state : ""}</td>
                      <td align="left">{m.zip ? m.zip : ""}</td>
                      <td align="left">{m.phone ? m.phone : ""}</td>
                      <td align="left">{m.cell ? m.cell : ""}</td>
                      <td align="left">{m.active ? "yes" : "no"}</td>
                      <td align="left">{m.guest ? "guest" : ""}</td>
                      <td align="left">
                        <MdEdit onClick={() => doEdit(m, i)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <EditMember
            member={memToEdit}
            doClose={handleClose}
            fromAdmin={true}
            allMembers={allMembers}
          />
        )}
      </Container>
    </>
  );
}

export default Members;
