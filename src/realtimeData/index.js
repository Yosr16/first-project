import React, { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import { MDBContainer, MDBBtn, MDBBtnGroup, MDBRow, MDBCol, MDBPagination, MDBPaginationLink, MDBPaginationItem } from 'mdb-react-ui-kit';
import DataTable from 'react-data-table-component';

const db = StartFirebase();
const sortOptions = ["Name", "Email", "Number"];

const RealtimeData = () => {
    const [tableData, setTableData] = useState([]);
    const [value, setValue] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const sliceTableData = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return tableData.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(tableData.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const dbRef = ref(db, "userData");
        const orderedQuery = query(dbRef, orderByChild("Name"));
        const searchValue = value.toLowerCase();

        onValue(orderedQuery, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
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
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data, });
            });
            setTableData(records);
        });
        setValue('');
    };

    const handleFilterStatus = () => {
        const dbRef = ref(db, "userData");

        if (statusFilter === '') {
            onValue(dbRef, (snapshot) => {
                let records = [];
                snapshot.forEach(childSnapshot => {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({ "Key ": keyName, "data": data });
                });

                setTableData(records);
            });
        } else {
            // Filter by status
            const statusQuery = query(dbRef, orderByChild("Status"), equalTo(statusFilter));

            onValue(statusQuery, (snapshot) => {
                let records = [];
                snapshot.forEach(childSnapshot => {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({ "Key ": keyName, "data": data });
                });

                setTableData(records);
            });
        }
    };

    const handleSort = (field) => {
        const dbRef = ref(db, "userData");
        const sortedQuery = query(dbRef, orderByChild(field));

        onValue(sortedQuery, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data });
            });

            setTableData(records);
        });

        setSortValue(field);
    };

    useEffect(() => {
        const dbRef = ref(db, "userData");
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "Key ": keyName, "data": data });
            });

            setTableData(records);
        });
    }, []);

    const columns = [
        { name: 'id', selector: (row,index) => index + 1, sortable: false },
        { name: 'Name', selector: (row) => row.data.Name },
        { name: 'Email', selector: (row) => row.data.Email },
        { name: 'Number', selector: (row) => row.data.Number },
        { name: 'cin', selector: (row) => row.data.cin },
        { name: 'Status', selector: (row) => row.data.Status },
    ];

    return (
        <MDBContainer>
            <form
                style={{
                    margin: "auto",
                    padding: "15px",
                    maxwidth: "400px",
                    alignContent: "center"
                }}
                className="d-flex input-group w-auto"
                onSubmit={handleSearch}>

                <input type="text" className="form-control" placeholder="Search Name" value={value}
                    onChange={(e) => setValue(e.target.value)} />
                <MDBBtnGroup>

                    <MDBBtn type="submit" color="dark">Search</MDBBtn>

                    <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
                        Reset
                    </MDBBtn>

                </MDBBtnGroup>

            </form>

            <DataTable
                columns={columns}
                data={sliceTableData()}
                
            />

            <MDBRow>
                <MDBCol size="8">
                    <h5>Sort By: </h5>
                    <select
                        style={{ width: "50%", borderRadius: "2px", height: "35px" }}
                        onChange={(e) => handleSort(e.target.value)}
                        value={sortValue}>
                        <option>Please Select Value</option>
                        {sortOptions.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                        ))}
                    </select>
                </MDBCol>
                <MDBCol size="4">
                    <h5>Filter By Status: </h5>
                    <MDBBtnGroup>
                        <MDBBtn color="success" onClick={() => handleFilterStatus("active")}>
                            active
                        </MDBBtn>
                        <MDBBtn color="danger" style={{ marginLeft: "2px" }} onClick={() => handleFilterStatus("inactive")}>inactive</MDBBtn>
                    </MDBBtnGroup>
                </MDBCol>
            </MDBRow>

            <MDBPagination className="mb-5">
                <MDBPaginationItem disabled={currentPage === 1}>
                    <MDBPaginationLink onClick={handlePrevPage}>Previous</MDBPaginationLink>
                </MDBPaginationItem>
                {Array.from({ length: Math.ceil(tableData.length / itemsPerPage) }, (_, i) => (
                    <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                        <MDBPaginationLink onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                ))}
                <MDBPaginationItem disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)}>
                    <MDBPaginationLink onClick={handleNextPage}>Next</MDBPaginationLink>
                </MDBPaginationItem>
            </MDBPagination>
        </MDBContainer>
    );
};

export default RealtimeData;