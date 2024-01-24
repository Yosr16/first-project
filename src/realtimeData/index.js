import React, { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import StartFirebase from '../firebaseConfig/index';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationLink, MDBPaginationItem, MDBSpinner } from 'mdb-react-ui-kit';
import DataTable from 'react-data-table-component';
import Profile from '../profile.js';
const db = StartFirebase();
const sortOptions = ["Name", "Email", "Number"];

const RealtimeData = ({ toggleTable }) => {
  const [tableData, setTableData] = useState([]);
  const [value, setValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSearch = (value) => {
    const dbRef = ref(db, "userData");
    const orderedQuery = query(dbRef, orderByChild("Name"));
    const searchValue = value.toLowerCase();

    onValue(orderedQuery, (snapshot) => {
      let records = [];
      snapshot.forEach(childSnapshot => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        const cin = data.cin + '';
        console.log(searchValue, cin);
        if (cin.toLowerCase().includes(searchValue) || data.Name.toLowerCase().includes(searchValue)) {
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
        records.push({ "Key ": keyName, "data": data });
      });
      setTableData(records);
    });
    setValue('');
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

  const handleFilterStatus = (statusFilter) => {
    const dbRef = ref(db, "userData");
    onValue(dbRef, (snapshot) => {
      let records = [];
      snapshot.forEach(childSnapshot => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();

        if (statusFilter === 'All' || data.Status === statusFilter) {
          records.push({ "Key ": keyName, "data": data });
        }
      });

      setTableData(records);
    });
  };

  useEffect(() => {
    setIsLoading(true);

    const dbRef = ref(db, "userData");
    onValue(dbRef, (snapshot) => {
      let records = [];
      snapshot.forEach(childSnapshot => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({ "Key ": keyName, "data": data });
      });
      setIsLoading(false);
      setTableData(records);
    });
  }, []);

  const columns = [
    { name: 'id', selector: (row, index) => index + 1, sortable: false },
    { name: 'Name', selector: (row) => row.data.Name },
    { name: 'Email', selector: (row) => row.data.Email },
    { name: 'Number', selector: (row) => row.data.Number },
    { name: 'cin', selector: (row) => row.data.cin },
    { name: 'Status', selector: (row) => row.data.Status },
  ];

  return (
    <MDBContainer fluid className="my-5"style={{width: "100%" , marginRight: 700,marginTop:10}}>
      <MDBRow className="mb-4">
        <MDBCol size="12">
          <div class="card" style={{padding:"5px"}} >
            <h4 class="card-header text-center font-weight-bold text-uppercase py-2">
            liste noire
            </h4>
            
            </div>
          
        </MDBCol>
        <MDBCol>
          <MDBRow>
            <MDBCol size="3">
              <form
                style={{
                  maxWidth: "400px",
                  zIndex: 1000,
                  margin: "auto"
                }}
              >
                <input type="text" className="form-control" placeholder="Search Name" onChange={(e) => handleSearch(e.target.value)} />
              </form>
            </MDBCol>
            <MDBCol size="3">
              <h11 className="me-2">Sort by </h11>
              <select
                style={{ width: "50%", borderRadius: "2px", height: "35px" }}
                onChange={(e) => handleSort(e.target.value)}
                value={sortValue}
              >
                <option>Please Select Value</option>
                {sortOptions.map((item, index) => (
                  <option value={item} key={index}>{item}</option>
                ))}
              </select>
            </MDBCol>
            <MDBCol size="3">
                <div className="d-flex align-items-center" >
        <h11 className="me-2">Filtrage: </h11>
        <select
            style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={(e) => {
                handleFilterStatus(e.target.value);
            setStatusFilter(e.target.value);}}
            value={statusFilter}>
            <option value="All">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
        {/* <MDBBtn className="mx-2" color="info" onClick={handleFilterStatus} >
            Filter
        </MDBBtn> */}
    </div>
    </MDBCol>
            <MDBCol size="3">
            <Profile toggleModal={toggleTable} />
            </MDBCol>

            
           
          </MDBRow>
        </MDBCol>
      </MDBRow>
      {isLoading ? (
        <MDBSpinner color="primary" className="mx-auto" />
      ) : (
        <DataTable
          columns={columns}
          data={sliceTableData()}
          striped
          responsive
          noHeader
          customStyles={{
            headRow: {
              style: {
                fontSize: '1.2em',
              },
            },
            rows: {
              style: {
                fontSize: '1em',
              },
            },
          }}
        />
      )}
       <MDBPagination className="mb-5 d-flex justify-content-end">
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
