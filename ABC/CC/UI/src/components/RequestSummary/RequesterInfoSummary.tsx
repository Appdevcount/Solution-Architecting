import React, { useEffect, useState } from 'react';
import { Card, Table, Col, CardHeader } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';

interface RequesterInformation {
    Name: string;
    PhoneNumber: string;
    Email: string;
    Facility: string;
  }
const RequesterInfoSummary: React.FC = () => {
    const [requesterInfo, setrequesterInfo] = useState<RequesterInformation|null>(null);
    
    const request: any = useSelector((state: RootState) => state.request);

    useEffect(() => {
        if (request?.RequesterInformation) {
            setrequesterInfo(request.RequesterInformation);
        }
    }, [request]);

    return (
        <Col md={12}>
            <Card className="mb-1">
                    <CardHeader>Requester Information Summary</CardHeader>
                    <Card.Body className="p-2">
                    {requesterInfo &&
                    <Table bordered size="sm">
                        <tbody>
                            <tr>
                                <td style={{ width: '50%' }}>Name:</td>
                                <td>{requesterInfo.Name}</td>
                            </tr>
                            <tr>
                                <td>Phone number:</td>
                                <td>{requesterInfo.PhoneNumber}</td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td>{requesterInfo.Email}</td>
                            </tr>
                            <tr>
                                <td>Facility:</td>
                                <td>{requesterInfo.Facility}</td>
                            </tr>
                        </tbody>
                    </Table>}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default RequesterInfoSummary;
