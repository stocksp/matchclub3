import { useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";
import Router from "next/router";
import { useStoreContext } from "./Store";
import { useUser } from "libs/hooks";
const AdminHeader = () => {
  const { active } = useStoreContext();
  const user = useUser();

  useEffect(() => {
    if(!user || user.role !== 'admin'){
      Router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Navbar expand="sm" collapseOnSelect bg="primary" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav activeKey={active}>
          <Link href="/admin/clubs" passHref>
            <Nav.Link eventKey="admin.clubs">CLUBS</Nav.Link>
          </Link>
          <Link href="/admin/locations" passHref>
            <Nav.Link  eventKey="admin.locations">LOCATIONS</Nav.Link>
          </Link>
          <Link href="/admin/dates" passHref>
            <Nav.Link eventKey="admin.dates">DATES</Nav.Link>
          </Link>
          <Link href="/admin/members" passHref>
            <Nav.Link eventKey="admin.members">MEMBERS</Nav.Link>
          </Link>
          <Link href="/admin/squads" passHref>
            <Nav.Link eventKey="admin.squads">SQUADS</Nav.Link>
          </Link>
          <Link href="/admin/games" passHref>
            <Nav.Link eventKey="admin.games">GAMES</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminHeader;
