import * as XLSX from "xlsx";
import saveAs from "file-saver";
import React, { useEffect, useMemo, useState } from "react";
import { Column, useFilters, useSortBy, useTable } from 'react-table'
import { Badge, Button, Card, CardBody, CardHeader, Form } from 'react-bootstrap';
import DashBoardResultModel, { DashBoardCountsModel } from "../../types/DashBoardResultModel";
import { AssigneeDetailsResponse, ResponseAssignCaseModel, ResponseDashBoardDetailsModel } from "../../types/DashBoardDetailsRespnseModel";
import { AssignCases, GetAssignees, GetDashBoardDetails } from "../../services/DashBoardService";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store/store";
import RequestQuery from "../../types/RequestQuery";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";


const allColumns: Column<DashBoardResultModel>[] = [
    { Header: 'Assign To',accessor: 'AssignTo' },
    { Header: 'Follow-Up Time',accessor: 'FollowUpTime' },
    { Header: 'Location',accessor: 'Location' },
    { Header: 'Request ID',accessor: 'RequestId' },
    { Header: 'Name', accessor: 'Name'},
    { Header: 'DOB', accessor: 'DOB'},
    { Header: 'Member ID',accessor: 'MemberId'},
    { Header: 'Service Type', accessor: 'ServiceType'},
    { Header: 'Created Time',accessor: 'CreatedTime'},
    { Header: 'IsRestrictedMember', accessor: 'IsRestrictedMember' }
];

const DashboardCC: React.FC = () => {

    
    const userName: any = useSelector((state: RootState) => state.auth?.user?.email);
    
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [selectAll, setSelectAll] = useState(false);
    const [selectedAssignToIds, setSelectedAssignToIds] = useState("");
    const [ dropdownList, setDropdownList] = useState<{label:string; value:string}[]>([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    
    const authState: any = useSelector((state: RootState) => state.auth);
    const hasLEA:boolean = authState?.user?.hasLEA;
    const navigate = useNavigate();
    
     //Filter data
     const [isFilterVisible, setFilterVisible] = useState(true);
     const [appliedFilters, setAppliedFilters] = useState<any>([]);
     const [appliedFiltersAPI, setAppliedFiltersAPI] = useState<any>({});
     const [filteredData, setFilteredData] = useState<DashBoardResultModel[]>([]);
    const [filterDataToSort, setFilterDataToSort] = useState<DashBoardResultModel[]>([]);
     const [userRole, setUserRole] = useState<boolean>(false);
     const [data] = useState<DashBoardResultModel[]>([]);
     const [countData, setCountData]= useState<DashBoardCountsModel>();
     const [searchTerm, setSearchTerm] = useState("");
     const [pageIndex, setPageIndex] = useState(1);
     const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
     


    interface SelectionColumn {
        Header: () => React.JSX.Element;
        id: string;
        disableSortBy: boolean;
        Cell: ({ row }: { row: any }) => React.JSX.Element
    }
    /* istanbul ignore next */
    const handleViewRequest = (id: string) => {
        const requestQuery = new RequestQuery(id);
        navigate("/viewrequest", { state: requestQuery });
      };
      

    const isAnyRowSelected = Object.values(selectedRows).some((selected) => selected);
    /* istanbul ignore next */
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const updatedSelection = newSelectAll ? Object.fromEntries(data.map((row) => [row.RequestId, true])) : {};
        setSelectedRows(updatedSelection);
    }
    /* istanbul ignore next */
    const checkboxColumn: SelectionColumn = {
        Header: () => (
            <input type="checkbox" checked={selectAll} onChange={() => handleSelectAll()} />
        ),
        id: "selection",
        disableSortBy: true,
        Cell: ({ row }: {row :any}) => {
            return(
            <input type="checkbox" checked={!!selectedRows[row.original.RequestId]} onChange={() => handleRowSelection(row.original.RequestId)} />
            )
        }
    }


    const getColumnsByRole = (role: boolean): Array<Column<DashBoardResultModel> | SelectionColumn> => {
        /* istanbul ignore next */
        let filteredColumns: Array<Column<DashBoardResultModel> | SelectionColumn> = allColumns.filter((col) => 
            role === true ? ["AssignTo", "FollowUpTime", "Name","Location","RequestId","MemberId","Name","DOB","CreatedTime"].includes(col.accessor as string) 
        : ["FollowUpTime", "Location","RequestId","Name","MemberId","DOB","ServiceType"].includes(col.accessor as string));

        if (role === true) {
            filteredColumns = [checkboxColumn,
                ...filteredColumns];
        }
        return filteredColumns
    }

    const handleRowSelection = (rowId: string) => {
        setSelectedRows((prev) => ({
            ...prev, [rowId]: !prev[rowId]
        }))
    }
    /* istanbul ignore next */

    const handleAssign = async () => {
        try{
        const selectedRequestIds = 
        Object.keys(selectedRows).filter((rowId) => selectedRows[rowId]);

        const assignResponse : ResponseAssignCaseModel = await AssignCases(selectedRequestIds,selectedAssignToIds);
        if(assignResponse.isSuccess){

            setAlert({ show: true, message: `Request is assigned to ${selectedAssignToIds}`, variant: 'success' });
            const response : ResponseDashBoardDetailsModel =   await GetDashBoardDetails(userName,pageSize,pageIndex,appliedFiltersAPI);
            if(response.apiResult){
            setFilteredData(response.apiResult);
            setFilterDataToSort(response.apiResult);
            setTotalRecords(response?.totalRecords)
            }
         

         
        }       
        else {

            setAlert({ show: true, message: `Request Can not be assigned to ${selectedAssignToIds}`, variant: 'danger' });

        }}
        catch(error:any){
            setAlert({ show: true, message: error.message, variant: 'danger' });

        }
       
    }

    const memoizedColumns = useMemo(() => getColumnsByRole(userRole), [userRole, selectedRows]);

    const filterOptions  = {
        "Status": [
            { apiKeyName : "CaseStatus", label: "Open", value: "Open", count: countData?.CaseOpen },
            { apiKeyName : "CaseStatus", label: "Closed", value: "Closed", count: countData?.Closed },
        ],
        "Reason": [
            { apiKeyName : "Reason", label: "Member Escalation", value: "Member Escalation", count: countData?.MemberEscalation },
            { apiKeyName : "Reason", label: "Other", value: "Other", count: countData?.OtherReason },
            { apiKeyName : "Reason", label: "Missed/Late Service", value: "Missed/Late Service", count: countData?.MissedServices },
            { apiKeyName : "Reason", label: "Help Finding A Servicing Provider", value: "Help finding a serving provider", count: countData?.FindServiceProvider},
            { apiKeyName : "Reason", label: "None", value: "None", count: countData?.NoneReason },
        ],
        ...((userRole === true) && {
        "Assignment Status": [
            { apiKeyName : "AssignedRequest", label: "Unassigned", value: "0", count: countData?.UnAssigned },
            { apiKeyName : "AssignedRequest", label: "Assigned", value: "1", count: countData?.Assigned },
        ],
    }),
        "Escalation Status": [
            { apiKeyName : "IsEscalated" , label: "Escalated", value: "1", count: countData?.IsEscalated },
            { apiKeyName : " IsEscalated ", label: "Not Escalated", value: "0", count: countData?.IsNotEscalated },
        ],
        "MSOC Status": [
            { apiKeyName : "MissedStartOfCare", label: "MSOC", value: "1", count: countData?.MissedStartOfCare }
        ],
        "Service Type": [
            { apiKeyName : "SubServiceType", label: "HomeHealth", value: "Home Health Standard", count: countData?.HomeHealth },
            { apiKeyName : "SubServiceType", label: "DME", value: "Standard", count: countData?.Dme },
            { apiKeyName : "SubServiceType", label: "Sleep Testing", value: "Sleep Testing", count: countData?.Sleep },
            { apiKeyName : "SubServiceType", label: "HomeInfusionTherapy", value: "Home Infusion Therap", count: countData?.HomeInfusionTherepy },
            { apiKeyName : "SubServiceType", label: "O&P", value: "O&P", count: countData?.Onp },
        ],
    };

  //Toggle filter visibility
  const toggleFilters = () => {
    setFilterVisible(!isFilterVisible);
  };

  /* istanbul ignore next */
  const showFilter = async (category, option) => {
    const filter: any = { category, value: option.label };  

    if (
      !appliedFilters.some(
        (f) => f.category === category && f.value === option.label
      )
    )
    {
      const newFiltersfordisplay = [...appliedFilters, filter];
      const newFiltersforapi = { ...appliedFiltersAPI, [option.apiKeyName]:option.value};
      setAppliedFilters(newFiltersfordisplay);
      setAppliedFiltersAPI(newFiltersforapi);

    const response : ResponseDashBoardDetailsModel =   await GetDashBoardDetails(userName,pageSize,pageIndex,newFiltersforapi);
    /* istanbul ignore next */
     if(response.apiResult){
    setFilteredData(response.apiResult);
    setFilterDataToSort(response.apiResult);
    setTotalRecords(response?.totalRecords)
    ResetPagination(10);
     }
      
    }
  };


  const removeFilter = async  (filterToRemove) => {
    const newFilters = appliedFilters.filter(
      (filter) =>
        !(
          filter.category === filterToRemove.category &&
          filter.value === filterToRemove.value
        )
       
    );
    /* istanbul ignore next */
    const newFiltersAPI = prev => {
        const existing = prev[filterToRemove.apiKeyName] || [];
        const updated = existing.filter(v => v !== filterToRemove.value);
        
        if (updated.length === 0) {
          const { [filterToRemove.apiKeyName]: _, ...rest } = prev;
          return rest;
        }
    }
    setAppliedFilters(newFilters);
    setAppliedFiltersAPI(newFiltersAPI);
    const response : ResponseDashBoardDetailsModel =   await GetDashBoardDetails(userName,pageSize,pageIndex,newFiltersAPI);
     /* istanbul ignore next */
    if(response.apiResult){
    setFilteredData(response.apiResult);
    setFilterDataToSort(response.apiResult);
    setTotalRecords(response?.totalRecords)
    ResetPagination(10);
     }

      
  
};

 
  useEffect(() => {
    const fetchData = async () => {
        try{
          const response: ResponseDashBoardDetailsModel = await GetDashBoardDetails(userName,pageSize,pageIndex, appliedFiltersAPI);

          if(response.apiResult){
           const result = response.apiResult;
           setFilteredData(result);
           setCountData(response.apiCountResult);
           setUserRole(response.apiresp)
           setTotalRecords(response?.totalRecords)
           setFilterDataToSort(result);             
          }else{
            setFilteredData([]);
            setFilterDataToSort([]);
          }

          const assigneeResponse: AssigneeDetailsResponse = await GetAssignees(userName);
               /* istanbul ignore next */
          if(assigneeResponse.isSuccess && assigneeResponse.assigneeName.length){
              const dropdownItems = assigneeResponse.assigneeName.map((name,index) =>({

                label: name,
                value: assigneeResponse.assigneeUser[index] || name,
              }
              ));
              setDropdownList(dropdownItems);
          }

        } catch (error) {
            if (error instanceof Error) {
                setAlert({ show: false, message: error.message, variant: 'danger' });
                
            } else {
                setAlert({ show: false, message: 'An unknown error occurred', variant: 'danger' });
            }
        } 


    };
    fetchData();
}, [pageSize,pageIndex]);

const handlePrevious = () => {
     /* istanbul ignore next */
    if(pageIndex >1 ){
        setPageIndex(pageIndex-1)
    }

  };
const handleNext = () => {
     /* istanbul ignore next */
    if(pageIndex < totalPages ){
        setPageIndex(pageIndex + 1)
    }
   
  };

  // table search logic
 
     /* istanbul ignore next */
  const handleSearchChange = (searchItem) => {
    
    setSearchTerm(searchItem);
    let result = filteredData;
    if (searchItem) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          (value &&   
          value.toString().toLowerCase().includes(searchItem.toLowerCase())
        )
    )
      );
    
    }
    
    setFilteredData(result);
   
  };

  
  //Sorting logic
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  /* istanbul ignore next */
  const sortedData = () => {
    if (!sortConfig.key) {
      return data;
    }
    /* istanbul ignore next */
    const sortedArray = [...filterDataToSort].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredData(sortedArray);
    return sortedArray;
  };

    const handleSort = (columnKey) => {
        let direction = 'asc';
        /* istanbul ignore next */
        if (columnKey === "selection"){
            return;
        }
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
       /* istanbul ignore next */
    setSortConfig({ key: columnKey, direction: direction });
    sortedData();
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
        
      { columns: memoizedColumns, data: filteredData },
      useFilters,
      useSortBy
      
    );


  const totalPages = Math.floor(totalRecords / pageSize);
  

  const handleRowsPerPageChange = (event) => {
    setPageSize(Number(event.target.value));
    setPageIndex(1);
  };

   function ResetPagination(num: number) {
    setPageSize(num);
    setPageIndex(1);
  }


    const exportToExcelFilteredData = () => {
        const dataToExport = filteredData.map(({ RequestId, Location }) => ({ RequestId, Location }))
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'filterd_data.xlsx');
    }
    /* istanbul ignore next */
    return (
        <Card className="mt-3">
            <CardHeader className="fs-6">
                 Dashboard               
                        <Button variant="dark" size="sm" onClick={exportToExcelFilteredData} style={{ float: 'right' }} >
                Request Data
                        </Button>
            </CardHeader>
            <CardBody>           
            <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
                    <Form.Control
                        type="text"
                        size="sm"
                        placeholder="type here to filter"
                        onChange={(e)=> handleSearchChange(e.target.value)}
                        value={searchTerm}
                    />
                </div>
            </div>
            <Card>
                <CardHeader  onClick={toggleFilters}> Filter Results<span>{isFilterVisible ? "🔽" : "🔼"}</span></CardHeader>
                <CardBody>
                    {isFilterVisible && (
                        <div style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                        >
                            {Object.entries(filterOptions).map(([category, options]) => (
                                <div key={category} style={{ marginRight: "30px" }}>
                                    <h6 style={{ textDecoration: "underline 2px rgb(156, 154, 154)", marginRight: "30px" }}>{category}</h6>
                                    {options.map((option) => (
                                        <span
                                            key={option.value}
                                            onClick={() => showFilter(category, option)}
                                            style={{
                                                display: "flex",
                                                textAlign: "left",
                                                gap: "5px",
                                                color: "blue",
                                                backgroundColor: "white",
                                                cursor: "pointer",
                                            }}
                                        >{option.label} <Badge pill bg="secondary">
                                                {option.count}
                                            </Badge></span>
                                    ))}

                                </div>
                            ))}
                        </div>
                    )}
                    {appliedFilters.length > 0 && (<>
                        <h6>Applied Filters:</h6>
                       
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {appliedFilters.map((filter, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            backgroundColor: "white",
                                            border: "1px solid rgb(2, 2, 2)",
                                            borderRadius: "20px",
                                            margin: "5px",
                                            padding: "5px 10px"
                                        }}
                                    >
                                        <span style={{ color: "black" }}>{filter.category}:{filter.value}</span>
                                        <span style={{ color: "black",cursor:"pointer"}} onClick={() => removeFilter(filter)}> &nbsp; &nbsp;  X </span>
                                    </div>
                                ))}
                            </div></>
                        ) }
                    <div>
                        {isAnyRowSelected && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                marginTop:"10px",
                                marginBottom:'10px',
                            }}>
                               
                                <Form.Select value={selectedAssignToIds} onChange={(e) => setSelectedAssignToIds(e.target.value)}>
                                    <option value="">Select User Name</option>
                                    {dropdownList.map((item, index) => (
                                        <option key ={index} value = {item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Button variant="dark" size="sm"  disabled={!selectedAssignToIds} onClick={handleAssign} style={{ float: 'right' }} >
                                Assign
                        </Button>
                            </div>
                        )
                        }
                    </div>
                    <CustomAlert
                                    show={alert.show}
                                    message={alert.message}
                                    variant={alert.variant as 'success' | 'danger'}
                                    onClose={() => setAlert({ ...alert, show: false })}
                                 />  
                    <table className="table" {...getTableProps()} border={1}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} style={{
                                             border: '1px solid #e0e0e0',
                                             whiteSpace:'nowrap',
                                             overflow:'hidden',
                                             textOverflow:'ellipsis',
                                             maxWidth:'300px' }}>
                                            {column.render('Header')}
                                            {column.id !== "selection" && (
                                                <>
                                                <span onClick={() => handleSort(column.id)}>🔼</span>
                                                <span onClick={() => handleSort(column.id)}>🔽</span>
                                                </>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()} key={row.original.RequestId}
                                     onClick={(e) => {
                                        if((e.target as HTMLInputElement).type === 'checkbox') return;
                                        if (row.original.IsRestrictedMember && !hasLEA ) return; // Block clicks for IsRestrictedMember rows with no access
                                        handleViewRequest(row.original.RequestId)
                                      }}
                                    >
                                        
                                        {row.cells.map(cell =>
                                  
                                            <td {...cell.getCellProps()} key={cell.column.id}  style={{
                                                border: '1px solid #e0e0e0',
                                                filter: row.original.IsRestrictedMember && !hasLEA   ? 'blur(5px)' : 'none',
                                                pointerEvents: row.original.IsRestrictedMember && !hasLEA  ? 'none' : 'auto', // Optional: disable hover effects
                                                //Styling for fixed or responsive width

                                                whiteSpace:'nowrap',
                                                overflow:'hidden',
                                                textOverflow:'ellipsis',
                                                maxWidth:'300px'
                                              }}
                                               title={ row.original.IsRestrictedMember && !hasLEA   ? 'Restricted Data' : ''}>
                                                {cell.render('Cell')}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <label htmlFor="rowsPerPage">Rows Per Page: </label>
                            <select id="pageSize" value={pageSize} onChange={handleRowsPerPageChange} style={{ padding: "5px", borderRadius: "5px", border: "1px solid#ccc" }}>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        <div>
                            <button type="button" className="btn btn-dark"
                                onClick={() => handlePrevious()}
                                disabled={pageIndex === 1}
                                style={{
                                    padding: "5px 10px",
                                    margin: "0 5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    cursor: pageIndex === 1 ? "not-allowed" : "pointer"
                                }}
                            >
                                Previous
                            </button>
                            <span>Page {pageIndex} of {totalPages}</span>
                            <button type="button" className="btn btn-dark"
                                onClick={() => handleNext()}
                                disabled={pageIndex === totalPages}
                                style={{
                                    padding: "5px 10px",
                                    margin: "0 5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    cursor: pageIndex === totalPages ? "not-allowed" : "pointer"
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
            </CardBody>
        </Card>
    );
};

const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  button: {
    backgroundColor: "grey",
    padding: "10px",
    borderRadius: "12px",
  },
};

export default DashboardCC;

