import { Modal, Button, Form, Row, Col } from "react-bootstrap";



interface StaffingRequestModalProps{
    onClose: () => void;
    onSelectOption:(value: boolean) => void;
}


const StaffingRequestModal : React.FC<StaffingRequestModalProps> = ({onClose, onSelectOption})=>{
  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
                      <Modal.Title><div>Confirmation</div></Modal.Title>
        </Modal.Header>     
        <Modal.Body className="p-3">
        <Form>
                <Row>
                        <Col>                       
                            <Form.Group controlId="formReason">                          
                                <Form.Label><p className= "fw-normal">Was there a service request received where services already staffed by a servicing provider?</p>
                                </Form.Label>                    
                            </Form.Group>
                        </Col>
                </Row>
          </Form>
        </Modal.Body>


        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="dark" onClick={( )=> onSelectOption(true)}> Yes </Button>
          <Button variant="dark"onClick={( )=> onSelectOption(false)}>No</Button>
        </Modal.Footer>  
      </Modal>

      
  );
}


export default StaffingRequestModal;
