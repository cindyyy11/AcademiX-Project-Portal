import React, { useEffect } from 'react';
import styles from "../../../styles/Student_Timeline.module.css";
import modalStyles from '../../../styles/Supervisor_Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import Supervisor_Timeline_3Proposal from './timeline/3Proposal';

export default function SupervisorPreviewProposal() {
  useEffect(() => {
    // Ensure the element is present before calling showModal
    const modal = document.getElementById("my_modal_4");
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      console.error('Modal or showModal method not available');
    }
  }, []);

  return (
    <>
      <dialog id="my_modal_4" className="dui-modal">
        <div className="dui-modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-2xl h-full flex flex-col justify-center items-center mb-5"><FontAwesomeIcon icon={faEye} className='w-6 h-6' /></h3>
          <div style={{maxHeight:"100%",overflowY: 'auto' }}>
            <Supervisor_Timeline_3Proposal/>
          </div>
          <div className="dui-modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="dui-btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

