import React, { useState } from 'react';
import Form from './comp/form';
import 'bootstrap/dist/css/bootstrap.min.css';

import RealtimeData from './realtimeData/index';
import CheckUserForm from './verification/verifier';

const App = () => {
    const [showTable, setShowTable] = useState(false);

    const toggleTable = () => {
        console.log("toggleTable called");
        setShowTable(!showTable);
    };
    

    return (
        <div>
          
            {!showTable && <RealtimeData toggleTable={toggleTable} />}
           
            {showTable && <RealtimeData toggleTable={toggleTable} />}
        </div>
    );
};

export default App;

