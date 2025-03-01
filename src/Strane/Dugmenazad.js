import React from 'react';
import { useHistory } from 'react-router-dom';
import './Dugmenazad.css';

function BackButton() {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <button onClick={goBack} className="dugmenazad">
      <span className="arrow">&#8592;</span>
    </button>
  );
}

export default BackButton;
