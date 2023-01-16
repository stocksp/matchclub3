import { useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import Link from "next/link";
import Router from "next/router";
import { useStoreContext } from "./Store";

const AdminHeader = () => {
  const { active, user } = useStoreContext();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      console.log("admin header booting you out!")
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
            <Nav.Link as="a" href="/admin/clubs" eventKey="admin.clubs">CLUBS</Nav.Link>
          </Link>
          <Link href="/admin/locations" passHref>
            <Nav.Link as="a" href="/admin/locations" eventKey="admin.locations">LOCATIONS</Nav.Link>
          </Link>
          <Link href="/admin/dates" passHref>
            <Nav.Link as="a" href="/admin/dates" eventKey="admin.dates">DATES</Nav.Link>
          </Link>
          <Link href="/admin/members" passHref>
            <Nav.Link as="a" href="/admin/members" eventKey="admin.members">MEMBERS</Nav.Link>
          </Link>
          <Link href="/admin/squads" passHref>
            <Nav.Link as="a" href="/admin/squads" eventKey="admin.squads">SQUADS</Nav.Link>
          </Link>
          <Link href="/admin/games" passHref>
            <Nav.Link as="a" href="/admin/games" eventKey="admin.games">GAMES</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminHeader;
