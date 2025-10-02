/* istanbul ignore file */
import React from 'react';
import { useLocation } from 'react-router-dom';

const InvalidSession: React.FC = () => {

    const location = useLocation();
    let message = location.state?.message;
    message = message ?? "Invalid Session";

    if (message) {
        return (
            <div>
                <h1>{message}</h1>
            </div>
        );
    }
    return <><h1>Invalid Session</h1></>
};

export default InvalidSession;
