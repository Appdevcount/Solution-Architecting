import { FormikProps } from "formik";
import CCRequest from "../../types/Request";
import { Card, CardBody, CardHeader, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

interface Props {
  formik: FormikProps<CCRequest>;
}

interface CCTypes {
  ServiceType: string;
  ServiceTypeSubType?: string[];
}

interface InsurerCCTypes {
  Insurers: {
    [key: string]: CCTypes[];
  };
}

const insurerCCTypes: InsurerCCTypes = {
  Insurers: {
    "Cigna": [
      { ServiceType: "DME", ServiceTypeSubType: ["Standard", "O&P"] },
      { ServiceType: "Home Health", ServiceTypeSubType: ["Home Health Standard","Home Infusion Therapy"] },
      { ServiceType: "Sleep", ServiceTypeSubType: ["Sleep Testing"] }
    ],
  }
};

const InsurerInfo: React.FC<Props> = ({ formik }) => {
  const [selectedInsurerCCTypes, setSelectedInsurerCCTypes] = useState<CCTypes[]>([]);

  useEffect(() => {
    if (formik.values.InsurerName) {
      setSelectedInsurerCCTypes(insurerCCTypes.Insurers[formik.values.InsurerName] || []);
    } else {
      setSelectedInsurerCCTypes([]);
    }

    if (formik.values.CareCoordinationType) {
      const selectedService = selectedInsurerCCTypes.find(service => service.ServiceType === formik.values.CareCoordinationType);
      if (selectedService?.ServiceTypeSubType && selectedService.ServiceTypeSubType.length > 0) {
        formik.setFieldValue("CareCoordinationSubType", selectedService.ServiceTypeSubType[0]);
      }
    }
  }, [formik.values.InsurerName, formik.values.CareCoordinationType]);

  return (
    <Card>
      <CardHeader>Insurer Information</CardHeader>
      <CardBody>
      <Row>
        <Col md={6}>
          <Form.Group controlId="InsurerName" className="mb-1">
            <Form.Label>Insurer Name *</Form.Label>
            <Form.Control
              as="select"
              name="InsurerName"
              size="sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.InsurerName}
              isInvalid={formik.touched.InsurerName && !!formik.errors.InsurerName}
            >
              <option value="">Select Insurer</option>
              {Object.keys(insurerCCTypes.Insurers).map((insurer) => (
                <option key={insurer} value={insurer}>
                  {insurer}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.InsurerName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          {selectedInsurerCCTypes.length > 0 && (
            <Form.Group controlId="CareCoordinationType" className="mb-1">
              <Form.Label>Care Coordination Type</Form.Label>
              <div>
                {selectedInsurerCCTypes.map((option) => (
                  <div key={option.ServiceType}>
                    <Form.Check
                      type="radio"
                      name="CareCoordinationType"
                      value={option.ServiceType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.CareCoordinationType === option.ServiceType}
                      label={option.ServiceType}
                      isInvalid={formik.touched.CareCoordinationType && !!formik.errors.CareCoordinationType}
                    />
                    {formik.values.CareCoordinationType === option.ServiceType && option.ServiceTypeSubType && (
                      <div style={{ marginLeft: "20px" }}>
                        {option.ServiceTypeSubType.map((subType) => (
                          <Form.Check
                            key={subType}
                            type="radio"
                            name="CareCoordinationSubType"
                            value={subType}
                            onChange={formik.handleChange}
                            onBlur= {formik.handleBlur}
                            checked={formik.values.CareCoordinationSubType === subType}
                            label= {subType}
                            isInvalid={formik.touched.CareCoordinationSubType && !!formik.errors.CareCoordinationSubType}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {formik.touched.CareCoordinationType && formik.errors.CareCoordinationType && (
                <div className="invalid-feedback d-block">
                  {formik.errors.CareCoordinationType}
                </div>
              )}
            </Form.Group>
          )}
        </Col>
      </Row></CardBody>
    </Card>
  );
};

export default InsurerInfo;
