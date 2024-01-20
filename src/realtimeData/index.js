import React, { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import { Table } from 'react-bootstrap';
import { MDBContainer, MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';


const db = StartFirebase();

const RealtimeData = () => {
    const [tableData, setTableData] = useState([]);
    const [value, setValue] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        const dbRef = ref(db, "userData");
        const orderedQuery = query(dbRef, orderByChild("Name")); // Remplacez "Name" par le champ sur lequel vous souhaitez effectuer la recherche
        const searchValue = value.toLowerCase();
        onValue(orderedQuery, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key ;
                let data = childSnapshot.val();

                
                if (data.Name.toLowerCase().includes(searchValue)) {
                    records.push({ "Key ": keyName, "data": data });
                }
            });

            setTableData(records);
        });
    };
    const handleReset = () => {
       
        const dbRef = ref(db, "userData");

   
    
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key ;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data,});
            });
            setTableData( records );
        });
        setValue('');
    };
    useEffect(() => {
        
        const dbRef = ref(db, "userData");
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key ;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data });
            });

            setTableData(records);
        });
    }, []);

   
    return (
    <MDBContainer>
     <form
     style={{ 
        margin:"auto",
        padding:"15px",
        maxwidth:"400px", 
       alignContent: "center"
    }}
    className="d-flex input-group w-auto" 
    onSubmit={handleSearch}>
   
    <input type= "text"className="form-control" placeholder= "Search Name" value={value}
    onChange={(e) => setValue (e.target . value) }/>
    <MDBBtnGroup>
    
    <MDBBtn type="submit" color="dark">Search</MDBBtn>

  
    <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
    Reset
    </MDBBtn>
    
    </MDBBtnGroup>
    </form>

            <Table className='container w-75'bordered striped variant='dark'>
                <thead>
                    <tr>
                        <th>id</th>
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
            </MDBContainer>
        );

 }

export default RealtimeData;