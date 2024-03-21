import React from 'react';
import PropTypes from 'prop-types';

const ButtonWithIcon = ({ onClick, iconSrc, text }) => {
    return (
        <button
            className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-md cursor-pointer"
            onClick={onClick}
        >
            <img src={iconSrc} alt="Icon" className="mr-2" />
            {text}
        </button>
    );
};

ButtonWithIcon.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};

export default ButtonWithIcon;
