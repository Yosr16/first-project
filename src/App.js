import React, { useState } from 'react';
import Form from './comp/form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RealtimeData } from './realtimeData/index';

const App=() =>{
  const [showTable, setShowTable] = useState(false);

    const toggleTable = () => {
        setShowTable(!showTable);
    };

    return (
        <div>
            <Form toggleTable={toggleTable} />
            {showTable && <RealtimeData />}
        </div>
    );
};
export default App;
