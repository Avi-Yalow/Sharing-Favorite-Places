import React from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
  return (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {props.show && (
        <div classNames="modal">
          {/* in={props.show}
        mountOnEnter unmountOnExit timeout={200}
        classNames="modal" > */}
          <ModalOverlay {...props} />
        </div>
      )}
    </React.Fragment>
  );
};

export default Modal;
