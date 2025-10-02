import { ChangeEvent, useEffect, useState } from 'react';
import { Form, Button, ProgressBar, Alert, Card, Col, CardHeader } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ConfirmationModal from '../ConfirmationModal';
import { deleteFile, downloadFile, getUploadedFiles, uploadFile } from '../../services/Attachment';
import { UploadedFileResDataModel, UploadedFileResModel } from '../../types/AttachmentModel';
import { RootState } from '../../state/store/store';
import { useSelector } from 'react-redux';
import Loader from '../Loader';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error' | 'deleted';

interface ConfirmationModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    title: string;
    body: React.ReactNode;
}

const documentTypes = [
    'AOR (Appointment of Representative)',
    'Care Plan',
    'Clinical Information',
    'Guardianship Documents',
    'Guideline Review',
    'Healthcare Power of Attorney',
    'NAP (Network Adequacy Process)',
    'PHI Release Form',
    'Readmission Assessment',
    'Signed NOMNC',
    'Other',
];

const validationSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select a document type'),
    file: Yup.mixed().required('A file is required'),
});

const Attachments: React.FC = () => {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [documentsValue, setDocumentsValue] = useState<string>("");
    const [selectedReason, setSelectedReason] = useState("");
    const request: any = useSelector((state: RootState) => state.request);
    const [requestid, setEpisodeId] = useState<string | null>(null);         
    const [documents, setDocuments] = useState<UploadedFileResDataModel[]>([]); 
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    /* istanbul ignore next */
    useEffect(() => {
        if (request) {
            setEpisodeId(request.RequestId);
        }
        if (request?.Attachments) {
            setEpisodeId(request?.Attachments.DocName);
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

    /* istanbul ignore next */
    useEffect(() => {
    const fetchData = async () => {
        try{
          const response: UploadedFileResModel = await getUploadedFiles(request.RequestId); 
          if(response.apiResult){
            setDocuments(response.apiResult);
          }else{
            setDocuments([]);
          }
        } catch (err){
        }
    };
    fetchData();
}, []);
    
    /* istanbul ignore next */
    const handleDownload = async (e) => {   
    try {
    const response  = await downloadFile(e); 
    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'download-file';
    if(contentDisposition && contentDisposition.includes('filename=')){
      filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    } catch (error) {
    console.error('Download failed:', error);
    }
    };

    const formik = useFormik({
        initialValues: {
            documentType: '',
            file: '',
        },
        validationSchema,
        /* istanbul ignore next */
        onSubmit: async (values) => {
            setStatus('uploading');
            setUploadProgress(0);
            setIsLoadingData(true);
            /* istanbul ignore next */
            const formData = new FormData();
            formData.append('requestId', request.RequestId);
            formData.append('file', values.file);
            formData.append('fileName', 'abc');
            formData.append('createdBy', request.MemberInformation.Name);
            formData.append('documentType', values.documentType);
            /* istanbul ignore next */
            try {
                const result = await uploadFile(formData);
                setStatus('success');
                setUploadProgress(100);
                setShowForm(false);
                setShowAlert(true);              
                setTimeout(() => setShowAlert(false), 1000);
                await new Promise(resolve => setTimeout(resolve,2000))
                /* istanbul ignore next */
                const responsefile: UploadedFileResModel = await getUploadedFiles(request.RequestId); 
                if(responsefile.apiResult){
                    setDocuments(responsefile.apiResult);
                  }else{
                    setDocuments([]);
                }

                
            } catch {
                setStatus('error');
                setUploadProgress(0);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }finally{
                setIsLoadingData(false);
            }
        },
    });
    /* istanbul ignore next */
    const handleDelete = async () => {
        setShowModal(false);
        try {
            
            setStatus('deleted');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 1000);
            const response: UploadedFileResModel = await getUploadedFiles(request.RequestId); 
            if(response.apiResult){
                setDocuments(response.apiResult);
              }else{
                setDocuments([]);
            }
            }
        catch {
            setStatus('error');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    }
    /* istanbul ignore next */
    const deleteDocument = async (e, requestId: any) => {
        const reponse = await deleteFile(e);   
        setShowModal(reponse.isDeleted)
        setDocumentsValue(e);
    }
    /* istanbul ignore next */
    const handleChange = (event) => {
        setSelectedReason(event.target.value);
    }
    /* istanbul ignore next */
    let hideActionButton :boolean = (!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"
    /* istanbul ignore next */
    return (
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader>
                    Attachments
                    {!hideActionButton &&
                    <Button size="sm" variant="dark" style={{ float: 'right' }} onClick={() => setShowForm(!showForm)} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} className="mb-3">
                        {showForm ? 'Cancel' : 'Add File'}
                    </Button>    
                }             
                </CardHeader>
                <Card.Body className="p-2"> 
                {showAlert && status === 'success' && (
                        <Alert variant="success">File uploaded successfully!</Alert>
                    )}

                    {showAlert && status === 'deleted' && (
                        <Alert variant="success">File deleted successfully!</Alert>
                    )}

                    {showAlert && status === 'error' && (
                        <Alert variant="danger">Upload failed. Please try again.</Alert>
                    )}                
                    {showForm && (
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formDocumentType">
                                <Form.Label>Document Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="documentType"
                                    size="sm"
                                    value={formik.values.documentType}
                                    onChange={formik.handleChange}
                                    isInvalid={!!formik.errors.documentType}
                                >
                                    <option value="">Select Document Type</option>
                                    {documentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{formik.errors.documentType}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="file">
                                <Form.Label>Document</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    size="sm"
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        formik.setFieldValue('file', event.currentTarget.files ? event.currentTarget.files[0] : null);
                                    }}
                                    isInvalid={!!formik.errors.file}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.documentType}</Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="dark" type="submit"disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Upload'}</Button>
                        </Form>
                    )}

                    {status === 'uploading' && (
                        <div className="space-y-2">
                            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                        </div>
                    )}
                    <ul className="list-group">
                    <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {documents.map((document, index) => (
                            <li key={index} className="list-group-item">
                                <a href='#' 
                                onClick={(e)=>{handleDownload(document.ObjectId);
                                    e.preventDefault();
                                }}>                             
                                    {document.Filename}
                                </a>                            
                                <span onClick={() => deleteDocument(document.ObjectId, request.RequestId)} style={{ float: 'right', cursor: 'pointer' }}> X </span>
                            </li>
                        ))}
                        </div>
                    </ul>
                </Card.Body>
            </Card>
            <ConfirmationModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleDelete}
                title={'Confirm Delete'}
                body={<div style={{ padding: "10px"}} >
                    <div>
                    <span >Are you sure you want to remove this attachment? This action cannot be undone.</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                        <span>Reason :</span>
                    <form style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                    <label style={{margin:"2px 0"}}>
                        <input
                        type='radio'
                        value = " Duplicate Document"
                        checked={selectedReason === " Duplicate Document"}
                        onChange={handleChange}
                        />Duplicate Document
                    </label >
                    <label style={{margin:"2px 0"}}>
                        <input
                        type='radio'
                        value = " Contains information of wrong patient"
                        checked={selectedReason===" Contains information of wrong patient"}
                        onChange={handleChange}
                        />Contains information of wrong patient
                    </label>
                    </form>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                        <br /><span>Notes:</span>
                        <textarea placeholder="Optional"  style={{ padding: "10px", width: "100%", maxWidth: "100%", borderRadius: "10px", overflow:"auto", resize:"both" }}></textarea>

                    </div>
                </div>}
            />
        </Col>

    );
};

export default Attachments;
