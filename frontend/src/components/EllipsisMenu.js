import { useState, useEffect, useRef } from 'react';
import { useUser } from '../customHooks/useUser';

const EllipsisMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useUser();
  const creator = props.creator;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  //Alla olevat kaksi (ja useRef) mahdollistavat menun sulkemisen klikkaamalla sen ulkopuolelta!
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    console.log('Edit recipe selected...');
    setIsOpen(false);
    props.onEdit();
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    if(window.confirm("Are you certain you want to delete this recipe? Deletion cannot be undone.")){
      props.onDelete();
    }
  };
  
  return (
    <div className="ellipsis-menu">
      <div className="ellipsis" onClick={toggleMenu}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      {isOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <ul>
            { user.username == creator ? <li onClick={handleEditClick}>Edit recipe</li>:null}
            { user.username == creator ? <li onClick={handleDeleteClick} style={{color:'red'}}>Delete recipe</li>:null}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;