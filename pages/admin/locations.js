import React, { useContext, useState, useEffect } from "react"
import Header from "components/header"
import AdminHeader from "components/adminHeader"
import { Container, Button, Table, Spinner } from "react-bootstrap"
import EditLocation from "components/editLocation.tsx"
import { useStoreContext } from "components/Store"
import { MdEdit } from "react-icons/md"
function Locations() {
  const [edit, setDoEdit] = useState(false)
  const [locToEdit, setLocToEdit] = useState(null)
  const { setActive, getClubsLocations, clubsLocations, updateLocation } =
    useStoreContext()
  useEffect(() => {
    setActive("admin.locations")
    getClubsLocations()
  }, [])
  const handleClose = () => {
    setDoEdit(false)
    setLocToEdit(null)
    getClubsLocations(true)
  }

  const doEdit = (loc, index) => {
    console.log("Setting do Edit true for", loc.Name)
    setLocToEdit(loc)
    setDoEdit(true)
  }

  const doNew = () => {
    setLocToEdit({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
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

  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "-5px",
        }}
      >
        <AdminHeader />
        {!locToEdit ? (
          <>
            <h2 className="text-center">
              Locations
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
                  <th>State</th>
                  <th>Zip</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {clubsLocations.locations.map((l, i) => {
                  return (
                    <tr key={i}>
                      <td align="left">{l.name}</td>
                      <td align="left">{l.address}</td>
                      <td align="left">{l.city}</td>
                      <td align="left">{l.state}</td>
                      <td align="left">{l.zip}</td>
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
          <EditLocation
            doClose={handleClose}
            location={locToEdit}
            allLocations={clubsLocations.locations}
          ></EditLocation>
        )}
      </Container>
    </>
  )
}

export default Locations
