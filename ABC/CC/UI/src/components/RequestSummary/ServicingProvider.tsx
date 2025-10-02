import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Form, Col, CardHeader, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomAlert from '../CustomAlert';
import { Column, useFilters, useSortBy, useTable } from 'react-table';
import { CCSite } from '../../state/reducers/requestSlice';
import Site from '../../utils/LookupModels';
import { mapSiteToCCSite } from '../../utils/helper';
import { UpdateCCSite } from '../../services/RequestService';
import { RootState } from '../../state/store/store';
import { useSelector } from 'react-redux';
import { SiteLookup } from '../../services/LookupService';
import QuickCreateProviderForm from './QuickCreateProvider';
import TableComponent from '../TableComponent';
import { SiteSearchResponse } from '../../types/SiteSearchResponse';
import Loader from '../Loader';

const ServicingProvider: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<Site | null>(null);
    const [searchResults, setSearchResults] = useState<Site[]>([]);
    const [savedRecord, setSavedRecord] = useState<any | null>(null);
    const [showQuickCreate, setShowQuickCreate] = useState<boolean>(false);
    const [ReturnedSiteType, setReturnedSiteType] = useState<string>('');
    const [RequestId, setRequestId] = useState<string>('');
    const [RequestDetails, setRequestDetails] = useState<RootState | null>(null);
    const [saveSelectedRecord, setSaveSelectedRecord] = useState<SiteSearchResponse | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const [ShowOONButton, setShowOONButton] = useState<boolean>(false);
    const [OONBenefit, setOONBenefit] = useState<string>("");
    const authState: any = useSelector((state: RootState) => state?.auth);   
    const request: any = useSelector((state: RootState) => state?.request);
    const memberIPA: any = useSelector((state: RootState) => state?.request?.MemberInformation?.MemberIPA);

    useEffect(() => {
        /* istanbul ignore next */
        if (request) {
            setRequestId(request.RequestId);
            setRequestDetails(request);
            setOONBenefit(request.OONBenefit);
        }
        if (request.CCSite && request.CCSite?.SiteName) {
            setSavedRecord(request.CCSite);
        }
        if(request?.AssignToId === authState?.user?.email)
            {
               setIsOwnedRequest(true);
        }
        if(authState?.user?.roles.includes("CCCordSup","NCCCordSup") )
            {
                setIsSupervisor(true);
        }
    }, [request]);

    const SiteLookupformikvalidationSchema = Yup.object().shape({
        ProviderZip: Yup.string(),
        ProviderNPI: Yup.string(),
        ProviderTIN: Yup.string(),
        ProviderName: Yup.string(),
        ProviderCity: Yup.string(),
        ProviderOAOID: Yup.string(),

    });

    const SiteLookupformik = useFormik({
        initialValues: {
            ProviderZip: '',
            ProviderNPI: '',
            ProviderTIN: '',
            ProviderName: '',
            ProviderCity: '',
            ProviderOAOID: '',
        },
        validationSchema: SiteLookupformikvalidationSchema,
        onSubmit: (values, { setErrors, setSubmitting }) => {
            let errors: { [key: string]: string } = {};
            /* istanbul ignore next */
            if ((!values.ProviderZip || values.ProviderZip.length === 0) && (!values.ProviderNPI || values.ProviderNPI.length === 0) && (!values.ProviderTIN || values.ProviderTIN.length === 0) && (!values.ProviderName || values.ProviderName.length === 0) && (!values.ProviderCity || values.ProviderCity.length === 0) && (!values.ProviderOAOID || values.ProviderOAOID.length === 0)) {
                errors.ProviderZip = 'Please enter Provider details for searching';
                setErrors(errors);
                setSubmitting(false);
                return;
            }
            setSubmitting(false);

        },
    });
    
    /* istanbul ignore next */
    const handleSiteLookupSubmit = async (SiteType: string) => {

        try {
            setIsLoadingData(true);
            let errors: { [key: string]: string } = {};
            if ((!SiteLookupformik.values.ProviderZip || SiteLookupformik.values.ProviderZip.length === 0) && (!SiteLookupformik.values.ProviderNPI || SiteLookupformik.values.ProviderNPI.length === 0) && (!SiteLookupformik.values.ProviderTIN || SiteLookupformik.values.ProviderTIN.length === 0) && (!SiteLookupformik.values.ProviderName || SiteLookupformik.values.ProviderName.length === 0) && (!SiteLookupformik.values.ProviderCity || SiteLookupformik.values.ProviderCity.length === 0) && (!SiteLookupformik.values.ProviderOAOID || SiteLookupformik.values.ProviderOAOID.length === 0)) {
                errors.ProviderZip = 'Please enter any Provider details for searching';
                if (Object.keys(errors).length > 0) {
                    SiteLookupformik.setErrors(errors);
                    setIsLoadingData(false);
                }
                return;
            }
            const req: any = { ...SiteLookupformik.values, ProviderEligibilityType: SiteType,memberIPA, RequestId };
             
            const response = await SiteLookup(req);
            let resp : any;
            /* istanbul ignore next */
            if (response?.searchResults?.length > 0) {
                resp = {
                    data: response.searchResults.map(result => ({
                        SiteId: result.prvno,
                        SiteName: result.pname,
                        PhysicianName:result.physicianName,
                        Address:((a: string, b: string) => a && b ? `${a},${b}` : a || b)(result.padD1, result.padD2),
                        NPI: result.npi,
                        TIN: result.aprno,
                        PhoneNumber: result.pphon,
                        Distance: result.geoZip,
                        City: result.pcity,
                        Zip: result.pazip,
                        State: result.pstat,
                        Phone: result.pphon,
                        Fax: result.pfax,
                        NetworkType:result.siteType
                    })),

                };
            }

            if (resp?.data?.length > 0) {
                setReturnedSiteType(SiteType);
                setSearchResults(resp.data);
                setSaveSelectedRecord(response);
            }
            else {
                setShowOONButton(true);
                setAlert({ show: true, message: "No results found", variant: 'info' });
            }
        } catch (error) {
            if (error instanceof Error) {
                setAlert({ show: true, message: error.message, variant: 'danger' });
            } else {
                setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
            }
        }finally{
            setIsLoadingData(false);
        }
    };


    const handleRowClick = (row) => {
        setSelectedRecord(row);
    };

    useEffect(() => {
        if (selectedRecord && saveSelectedRecord != null) {
            handleSave();
        }
    }, [selectedRecord]);

    const handleSave = async () => {

        try {
            if (selectedRecord && saveSelectedRecord != null) {
                const fullItem = saveSelectedRecord.searchResults.find(item => item.prvno == selectedRecord.SiteId.toString());
                let ccSite: CCSite = mapSiteToCCSite(fullItem, request.RequestId);
                const response = await UpdateCCSite(ccSite);
                setSavedRecord(response);
            }

            handleCancel();
            setAlert({ show: true, message: 'Success!', variant: 'success' });
            /* istanbul ignore next */
            if(OONBenefit==="N" && savedRecord?.SiteType==="NON-PAR"){
            setAlert({ show: true, message: 'You have selected an non participating provider and member does not have out of network coverage', variant: 'success' });
            setTimeout(()=>{
                setAlert({show:false, message: '', variant: '' })},4000)
            }
            /* istanbul ignore next */
            if(OONBenefit==="N" && savedRecord?.SiteType==="PAR-OON"){
            setAlert({ show: true, message: 'You have selected an out of network provider and member does not have out of network coverage', variant: 'success' });
            setTimeout(()=>{
                setAlert({show:false, message: '', variant: '' })},4000)
            }

        }       
        catch (error) {
            if (error instanceof Error) {
                setAlert({ show: true, message: error.message, variant: 'danger' });
            } else {
                setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
            }
        } finally {
        }
    };
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleCancel = () => {
        setIsEditing(false);
        SiteLookupformik.resetForm();
        setShowQuickCreate(false);
        setSelectedRecord(null);
        setSearchResults([]);
        setReturnedSiteType('');
    };

    const handleQuickCreate = () => {
        setShowQuickCreate(true);
        setSearchResults([]);
    };


    /* istanbul ignore next */
    const columns: Column<Site>[] = [
        {
            Header: 'Site Name',
            accessor:(row: Site) => row.SiteName?.trim()? `${row.SiteName}`: `${row.PhysicianName}`,
            Cell: ({ value }) => <div style={{ whiteSpace: 'normal' }}>{value}</div>,
            width: 140
        },
        {
            Header: 'Address',
            accessor: 'Address',
            Cell: ({ value }) => <div style={{ whiteSpace: 'normal' }}>{value}</div>,
            width: 110
        },
        {
            Header: 'NPI or TIN',
            accessor: (row: Site) => `NPI: ${row.NPI} TIN: ${row.TIN}`,
            Cell: ({ value }) => <div style={{ whiteSpace: 'normal' }}>{value}</div>,
            width: 100,
        },{
            Header: 'Network Type',
            accessor:'NetworkType',
            Cell: ({ value }) => <div style={{ whiteSpace: 'normal' }}>{value}</div>,
            width: 140,
        },
        {
            Header: 'Phone No.',
            accessor: 'PhoneNumber',
            width: 80,
        },
        {
            Header: 'Distance',
            accessor: 'Distance',
            width: 20,
        },
        {
            Header: 'City',
            accessor: 'City',
        },
        {
            Header: 'Zip',
            accessor: 'Zip',
        },
        {
            Header: 'State',
            accessor: 'State',
        },
        {
            Header: 'Phone',
            accessor: 'Phone',
        },
        {
            Header: 'Fax',
            accessor: 'Fax',
        },
        {
            Header: 'Action',
            Cell: ({ row }) => (
                <Button
                    variant="dark"
                    size="sm"
                    onClick={() => handleRowClick(row.original)}
                >
                    Save Provider
                </Button>
            ),
            width: 40,
        },
    ];
    const memoizedColumns = useMemo(() => columns, []);
    const [filteredData, setFilteredData] = useState<Site[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const handleChangePage = (pageNumber: number) => setCurrentPage(pageNumber);


    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        ResetPagination(Number(event.target.value));
    };
    /* istanbul ignore next */
    function ResetPagination(num: number) {
        setRowsPerPage(num);
        setCurrentPage(1);
    }

    const hiddenColumns = useMemo(() => ['SiteId', 'City', 'Zip', 'State', 'Fax', 'Phone'], []);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: memoizedColumns, data: searchResults, initialState: { hiddenColumns } },
        useFilters,
        useSortBy
    );

    let buttontext=savedRecord ? 'Edit' : 'Add';
    
    let hideActionButton :boolean = (!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"
    /* istanbul ignore next */
    return ( 
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader>
                    Servicing Provider
                    { !hideActionButton &&
                        <Button
                        variant="dark"
                        size="sm"
                        style={{ float: 'right' }}
                        disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"}
                        onClick={isEditing ? handleCancel : handleEdit}
                    >
                        {isEditing ? 'Cancel' : buttontext}
                    </Button>}
                </CardHeader>
                <Card.Body className="p-2">
                    <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />

                    {isEditing ? (
                        <>
                            {!showQuickCreate && (<>
                                <Form onSubmit={SiteLookupformik.handleSubmit}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderZip">
                                                <Form.Label>Provider Zip</Form.Label>
                                                <Form.Control
                                                    name="ProviderZip"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderZip}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderNPI">
                                                <Form.Label>Provider NPI</Form.Label>
                                                <Form.Control
                                                    name="ProviderNPI"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderNPI}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}                                            
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderTIN">
                                                <Form.Label>Provider TIN</Form.Label>
                                                <Form.Control
                                                    name="ProviderTIN"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderTIN}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderName">
                                                <Form.Label>Provider Name</Form.Label>
                                                <Form.Control
                                                    name="ProviderName"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderName}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderOAOID">
                                                <Form.Label>Provider OAOID</Form.Label>
                                                <Form.Control
                                                    name="ProviderOAOID"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderOAOID}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="ProviderCity"  >
                                                <Form.Label>Provider City</Form.Label>
                                                <Form.Control
                                                    name="ProviderCity"
                                                    type="text"
                                                    size="sm"
                                                    value={SiteLookupformik.values.ProviderCity}
                                                    onChange={SiteLookupformik.handleChange}
                                                    onBlur={SiteLookupformik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {SiteLookupformik.errors.ProviderZip && (
                                        <Row>
                                            <Col>
                                                <div style={{
                                                    width: '100%',
                                                    marginTop: '.25rem',
                                                    fontSize: '.875em',
                                                    color: '#dc3545'
                                                }}>
                                                    {SiteLookupformik.errors.ProviderZip}
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                    <Row>
                                        <Col md={9}>
                                            <Button variant="dark" type="button" onClick={() => handleSiteLookupSubmit('INN')} className="mt-3" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Search'} </Button>                                           

                                        </Col>
                                        <Col md={3}>
                                            <Button variant="dark" onClick={handleQuickCreate} className="mt-3">Quick Create Provider</Button>
                                        </Col>
                                    </Row>
                                {ShowOONButton && (
                                  <Button variant="dark" type="button" onClick={() => handleSiteLookupSubmit('OON')} className="mt-3" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Do you want to search for OON provider?'} </Button>                                           

                                    )}


                                </Form>
                                {searchResults.length > 0 && !showQuickCreate && (


                                    <TableComponent
                                        getTableProps={getTableProps}
                                        headerGroups={headerGroups}
                                        getTableBodyProps={getTableBodyProps}
                                        rows={rows}
                                        prepareRow={prepareRow}
                                        handleRowClick={handleRowClick}
                                        currentPage={currentPage}
                                        rowsPerPage={rowsPerPage}
                                        handleRowsPerPageChange={handleRowsPerPageChange}
                                        handleChangePage={handleChangePage}
                                        totalPages={totalPages}
                                    />

                                )}
                            </>
                            )
                            }

                            {showQuickCreate && (

                                <QuickCreateProviderForm setShowQuickCreate={setShowQuickCreate} RequestId={RequestId} setSavedRecord={setSavedRecord} handleCancel={handleCancel} setAlert={setAlert}></QuickCreateProviderForm>
                            )}
                        </>
                    ) : (
                        <>
                            {savedRecord && (<>
                                <Table bordered size="sm" className="mt-3">
                                    <tbody>
                                        <tr>
                                            <td>Facility Name:</td>
                                            <td>{savedRecord.SiteName}</td>
                                        </tr>
                                        <tr>
                                            <td>NPI:</td>
                                            <td>{savedRecord.NPI}</td>
                                        </tr>
                                        <tr>
                                            <td>Street Address:</td>
                                            <td>{savedRecord.SiteAddr1}</td>
                                        </tr>
                                        <tr>
                                            <td>City:</td>
                                            <td>{savedRecord.SiteCity}</td>
                                        </tr>
                                        <tr>
                                            <td>Zip:</td>
                                            <td>{savedRecord.SiteZip}</td>
                                        </tr>
                                        <tr>
                                            <td>State:</td>
                                            <td>{savedRecord.SiteState}</td>
                                        </tr>
                                        <tr>
                                            <td>Site Type:</td>
                                            <td><span style={{color:'#ffa500'}}>{savedRecord.SiteType}</span></td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </>
                            )}
                        </>
                    )}



                </Card.Body>
            </Card>
        </Col>
         
    );
};

export default ServicingProvider;
