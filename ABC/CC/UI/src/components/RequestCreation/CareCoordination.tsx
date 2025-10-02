import { FormikProps } from "formik";
import CCRequest from "../../types/Request";
import { Card, CardBody, CardHeader, Col, Form, Row } from "react-bootstrap";

interface Props {
  formik: FormikProps<CCRequest>;
}

const CareCoordination: React.FC<Props> = ({ formik }) => {
  const reasons = [
    { value: 'Missed/Late Service', label: 'Missed/Late Service' },
    { value: 'Help finding a serving provider', label: 'Help finding a serving provider' },
    { value: 'Other', label: 'Other' },
    { value: 'Member escalation', label: 'Member escalation' },
  ];

  return (
    <Card>
      <CardHeader>Care Coordination Information</CardHeader>
      <CardBody>
      <Row>
        <Col md={6}>
          <Form.Group controlId="Reason" className="mb-1">
            <Form.Label>Reason *</Form.Label>
            <Form.Control
              as="select"
              name="Reason"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Reason}
              isInvalid={!!(formik.touched.Reason && formik.errors.Reason)}
            >
              <option value="">Select Reason</option>
              {reasons.map(reason => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.Reason}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="StartOfCare" className="mb-1">
            <Form.Label>Start of Care *</Form.Label>
            <Form.Control
              type="date"
              name="StartOfCare"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.StartOfCare}
              isInvalid={!!(formik.touched.StartOfCare && formik.errors.StartOfCare)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.StartOfCare}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="isEscalated" className="mb-1">
            <Form.Check
              type="checkbox"
              name="isEscalated"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.isEscalated}
              isInvalid={!!(formik.touched.isEscalated && formik.errors.isEscalated)}
              label={<label style={{ fontWeight: "bold", fontSize: "12px" }}>Is Escalated</label>}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.isEscalated}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="Notes" className="mb-1">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="Notes"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Notes}
              isInvalid={!!(formik.touched.Notes && formik.errors.Notes)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.Notes}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row></CardBody>
    </Card>
  );
};

export default CareCoordination;
