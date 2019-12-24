import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity linear 0.15s;
  z-index: 2000;
  width: ${props => {
    switch (props.modalSize) {
      case "lg":
        return "800";
      default:
        return "480";
    }
  }}px;
  margin: 40px auto;
  &.fade-in {
    opacity: 1;
    transition: opacity linear 0.15s;
  }
  &.fade-out {
    opacity: 0;
    transition: opacity linear 0.15s;
  }
  .background {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 1040;
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: 0;
  }
  .card-validate{
    background-color: #17a2b8;
  }
  .card-success{
    background-color: #218838;
    color: white;
  }
  .box-dialog {
    z-index: 1050;
    width: 50%;
    background-color: #fefefe;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    .box-content {
      padding: 24px;
      width: 100%;
    }
    .box-header {
      height: 48px;
      padding: 8px 24px;
      background-color: #003469;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #c7c7c7;
      .box-title {
        font-size: 24px;
        font-weight: 400;
        margin: 0 0 0 0;
      }
      .x-close {
        font-size: 35px;
        line-height: 35px;
        font-weight: 400;
        text-shadow: none;
        color: black;
        cursor: pointer;
        &:hover {
          opacity: 0.5;
        }
      }
    }
    .box-body {
      font-size: 14px;
      padding: 0px;
      width: auto;
      height: auto;
    }
    .box-footer {
      height: 60px;
      padding: 0px 24px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid #c7c7c7;
    }
    .close{
      color: white;
    }
  }
`;

export default Modal;
