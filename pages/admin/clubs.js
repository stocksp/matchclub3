import React, { useState, useEffect } from "react"
import Header from "components/header"
import AdminHeader from "components/adminHeader"
import { Container, Button, Table, Spinner } from "react-bootstrap"
import EditClub from "components/editClub.tsx"
import { useStoreContext } from "components/Store"
import { MdEdit } from "react-icons/md"
function Clubs() {
  const [edit, setDoEdit] = useState(false)
  const [clubToEdit, setClubToEdit] = useState(null)
  const { setActive, getClubsLocations, clubsLocations } =
    useStoreContext()
  useEffect(() => {
    setActive("admin.clubs")
    getClubsLocations()
  }, [])
  const handleClose = () => {
    setDoEdit(false)
    setClubToEdit(null)
    getClubsLocations(true)
  }

  const doEdit = (club, index) => {
    console.log("Setting do Edit true for", club.Name)
    setClubToEdit(club)
    setDoEdit(true)
  }

  const doNew = () => {
    setClubToEdit({
      name: "",
      address: "",
      city: "",
      phone: "",
      houseName: "Select House",
    })
    setDoEdit(true)
  }
  if (!clubsLocations)
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
            marginLeft: "5%",
            marginRight: "5%",
          }}
        >
          <AdminHeader /> <Spinner animation="border" variant="dark" />
          <Spinner animation="grow" variant="dark" />{" "}
        </Container>
      </>
    )
 // console.log('clubs', JSON.stringify(clubsLocations.clubs))
  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "-5px",
        }}
      >
        <AdminHeader />
        {!clubToEdit ? (
          <>
            <h2 className="text-center">
              Clubs
              <span>
                <Button variant="primary" onClick={doNew}>
                  Create New
                </Button>
              </span>
            </h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>House Name</th>

                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {clubsLocations.clubs.map((l, i) => {
                  return (
                    <tr key={i}>
                      <td align="left">{l.name}</td>
                      <td align="left">{l.address}</td>
                      <td align="left">{l.city}</td>
                      <td align="left">{l.houseName}</td>

                      <td align="left">{l.phone}</td>

                      <td align="left" style={{ cursor: "pointer" }}>
                        <MdEdit onClick={() => doEdit(l, i)} size={"1.5em"} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <EditClub
            doClose={handleClose}
            club={clubToEdit}
            allClubs={clubsLocations.clubs}
            locations={clubsLocations.locations}
          ></EditClub>
        )}
      </Container>
    </>
  )
}

export default Clubs
