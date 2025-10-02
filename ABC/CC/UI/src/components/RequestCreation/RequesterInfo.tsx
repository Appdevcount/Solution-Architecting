import { FormikProps } from "formik";
import CCRequest from "../../types/Request";
import { Card, CardBody, CardHeader, Col, Form, Row } from "react-bootstrap";


interface Props {
  formik: FormikProps<CCRequest>;
}

const RequesterInfo: React.FC<Props> = ({formik
}) => {
    return (

      <Card>
        <CardHeader>Requester Information</CardHeader><CardBody>
      <Row>
        <Col md={6}>
          <Form.Group controlId="RequesterFirstName" className="mb-1">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              name="RequesterFirstName"
              size="sm"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterFirstName}
              isInvalid={formik.touched.RequesterFirstName && !!formik.errors.RequesterFirstName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterFirstName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="RequesterLastName" className="mb-1">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="RequesterLastName"
              size="sm"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterLastName}
              isInvalid={formik.touched.RequesterLastName && !!formik.errors.RequesterLastName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterLastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId="RequesterEmail" className="mb-1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="RequesterEmail"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterEmail}
              isInvalid={formik.touched.RequesterEmail && !!formik.errors.RequesterEmail}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterEmail}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="RequesterFaxNumber" className="mb-1">
            <Form.Label>Fax Number</Form.Label>
            <Form.Control
              type="text"
              name="RequesterFaxNumber"
              size="sm"
              maxLength={10}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterFaxNumber}
              isInvalid={formik.touched.RequesterFaxNumber && !!formik.errors.RequesterFaxNumber}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterFaxNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId="RequesterPhoneNumber" className="mb-1">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="RequesterPhoneNumber"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={10}
              value={formik.values.RequesterPhoneNumber}
              isInvalid={formik.touched.RequesterPhoneNumber && !!formik.errors.RequesterPhoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterPhoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="RequesterExtension" className="mb-1">
            <Form.Label>Extension</Form.Label>
            <Form.Control
              type="text"
              name="RequesterExtension"
              size="sm"
              maxLength={10}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterExtension}
              isInvalid={formik.touched.RequesterExtension && !!formik.errors.RequesterExtension}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterExtension}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId="RequesterFacility" className="mb-1">
            <Form.Label>Facility</Form.Label>
            <Form.Control
              type="text"
              name="RequesterFacility"
              size="sm"
              maxLength={50}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.RequesterFacility}
              isInvalid={formik.touched.RequesterFacility && !!formik.errors.RequesterFacility}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.RequesterFacility}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row></CardBody>
      </Card>
    );
  };
  
  export default RequesterInfo;
