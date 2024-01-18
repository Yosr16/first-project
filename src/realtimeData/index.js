import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import { Table } from 'react-bootstrap';


const db = StartFirebase();

const RealtimeData = () => {
    const [tableData, setTableData] = useState([]);

   
    useEffect(() => {
        const dbRef = ref(db, "userData");
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data });
            });
            setTableData( records );
        });
    },[]);

   
        return (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>cin</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowdata, index) => (
                        <tr key={index}> 
                            <td>{index}</td>
                           
                            <td>{rowdata.data.Name}</td>
                            <td>{rowdata.data.Email}</td>
                            <td>{rowdata.data.Number}</td>
                            <td>{rowdata.data.cin}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
 }

export default RealtimeData;