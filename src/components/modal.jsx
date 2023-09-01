import PropTypes from 'prop-types';
import iconClose from '../assets/icons/close.png'

export default function Modal({closeModal}) {
  
  return (
    <div className="download-wrapper">
      <div className="icon icon-action" onClick={closeModal}>
          <img src={iconClose} alt="Close"/>
      </div>
      {/*TODO: Add content {children}*/}
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  closeModal: PropTypes.func};
