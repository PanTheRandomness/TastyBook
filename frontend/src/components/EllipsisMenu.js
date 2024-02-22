import { useState, useEffect, useRef } from 'react';
import { useUser } from '../customHooks/useUser';
import { useNavigate } from 'react-router-dom';

const EllipsisMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useUser();
  const creator = props.creator;
  const route = props.route;
  const navigate = useNavigate();
  
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
    console.log("Starting edit...");
    navigate("/editrecipe/" + route);
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    props.onDelete();
  };
  
  return (
    <div className="ellipsis-menu">
      {
        user && user.username === creator  ?
        <div className="ellipsis" onClick={toggleMenu} data-testid="ellipsis">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>: null
      }
      {isOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <ul>
            <li onClick={handleEditClick} data-testid={"editrecipe"}>Edit recipe</li>
            <li onClick={handleDeleteClick} style={{color:'red'}} data-testid={"deleterecipe"}>Delete recipe</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;