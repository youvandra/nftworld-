import { Modal } from "antd";
import styled from "styled-components";


export const ModalStyled = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
  }
  .ant-modal-header {
    border-radius: 16px 16px 0 0;
  }
  .ant-modal-content,
  .ant-modal-header,
  .ant-popover-inner,
  .ant-popover-inner-content {
    background: #27235e;
    color: #fff;
  }
  .ant-modal-title {
    color: #f1f1f5;
  }
  .ant-modal-close-x {
    color: #f1f1f2;
  }
`;
export const Network = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.4s;
  padding: 2rem 0;
  :hover {
    opacity: .6;
  }
  p {
    font-weight: 600;
    margin-top: 10px;
  }
`;