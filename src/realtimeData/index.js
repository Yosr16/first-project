import React from 'react';
import { ref, onValue } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import { Table } from 'react-bootstrap';

const db = StartFirebase();

export class RealtimeData extends React.Component { // Corrected here
    constructor() {
        super();
        this.state = {
            tableData: []
        }
    }

    componentDidMount() {
        const dbRef = ref(db, "userData");
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data });
            })
            this.setState({ tableData: records });
        });
    }

    render() {
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
                    {this.state.tableData.map((rowdata, index) => (
                        <tr key={index}> {/* Added key attribute */}
                            <td>{index}</td>
                           
                            <td>{rowdata.data.Name}</td>
                            <td>{rowdata.data.Email}</td>
                            <td>{rowdata.data.Number}</td>
                            <td>{rowdata.data.cin}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}