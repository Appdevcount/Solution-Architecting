import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Col, CardHeader } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AddNote } from '../../services/RequestService';
import { RootState } from '../../state/store/store';
import { useSelector } from 'react-redux';
import CustomAlert from '../CustomAlert';
import {NoteResponseModel, ResponseAddNoteModel} from '../../types/AddNoteModel';
import Loader from '../Loader';

const Notes: React.FC = () => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [notes, setNotes] = useState<NoteResponseModel[]>([]);
    
    
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const request: any = useSelector((state: RootState) => state.request);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    

    useEffect(() => {
        if (request.Notes) {
            setNotes(request.Notes);
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
    const formik = useFormik({
        initialValues: {
            Notes: ""
           
        },
        validationSchema: Yup.object({
            Notes: Yup.string().required('Note is required'),
        }),
        onSubmit: async (values, { resetForm }) => {

            try {    
                setIsLoadingData(false);                      
                const response: ResponseAddNoteModel = await AddNote(values.Notes, request?.RequestId, authState?.user?.email);
                let addNote = response.apiResult[0];
                let newNote:NoteResponseModel= {Notes: addNote.Notes, CareCoordinationEpisodeId: addNote.CareCoordinationEpisodeId, CareCoordinationEpisodeDate:addNote.CareCoordinationEpisodeDate, CreatedDate:addNote.CreatedDate}
                
                setNotes([newNote, ...(notes ?? [])]);
                setIsAdding(false);
                resetForm();
                setAlert({ show: true, message: 'Notes has been added', variant: 'success' });
            } catch (error) {
                if (error instanceof Error) {
                    setAlert({ show: true, message: error.message, variant: 'danger' });
                } else {
                    setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
                }
            }finally{
                setIsLoadingData(true);
            }
        },
    });

    const handleAdd = () => {
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        formik.resetForm();
    };

    let hideActionButton :boolean = (!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"
    return (
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader >
                    Notes
                    {!isAdding && !hideActionButton &&  (
                        <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} onClick={handleAdd}>
                            Add Note
                        </Button>
                    )}
                    {isAdding && !hideActionButton && (
                        <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}

                </CardHeader>
                <Card.Body className="p-2">
                    <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                    {isAdding && (
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formNoteText">
                                <Form.Label>Note</Form.Label>
                                <Form.Control
                                    name="Notes"
                                    as="textarea"
                                    size="sm"
                                    rows={3}
                                    maxLength={250}
                                    value={formik.values.Notes}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.Notes && formik.errors.Notes)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.Notes}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="dark" type="submit" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Save'} </Button>
                        </Form>
                    )}
                    <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notes && notes.map((note) => (
                            <Card className="mb-2" >
                            <Card.Body>
                            <div key={note.CreatedDate} className="mb-2">
                                <p><b>{note.CreatedDate}</b></p>                              
                                <p className=''>{note.Notes}</p>
                            </div>
                            </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Notes;
