import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function Alert(props) {
  
  const handleClose = () => {
    props.toggle(false);
  };

  return (
    <>
      <Modal show={props.open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Alert;
