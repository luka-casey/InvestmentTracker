import React from 'react';
import '../styles/home.css';
import { format } from "date-fns";

const HomeHeadings = ({currentTime}) => {

    const formattedDateTime = format(currentTime, "EEEE, do, yyyy, h:mm:ss a");

    return (
        <div className='mainContainer'>
            <h1 className='heading'>Investment Tracker</h1>
            <h2 className='heading'>{formattedDateTime}</h2>
        </div>
    );
};

export default HomeHeadings;
