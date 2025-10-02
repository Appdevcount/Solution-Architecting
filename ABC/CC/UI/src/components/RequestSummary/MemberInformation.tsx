
import React, { useEffect, useState } from 'react';
import { Card, Table, Col, CardHeader } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';
import { MemberInformation } from '../../state/reducers/requestSlice';

const MemberInfo: React.FC = () => {
    const [MemberInfo, setMemberInfo] = useState<MemberInformation | null>(null);

    const request: any = useSelector((state: RootState) => state.request);

    useEffect(() => {
        if (request?.MemberInformation ) {
            setMemberInfo(request.MemberInformation);
        }
    }, [request]);

    return (
        <Col md={12}>
            <Card className="mb-1">
                    <CardHeader>Member Information</CardHeader>
                    <Card.Body className="p-2">
                   { MemberInfo &&
                    <Table bordered size="sm">
                        <tbody>
                            <tr>
                                <td style={{ width: '50%' }}>Name:</td>
                                <td>{MemberInfo.Name}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '50%' }}>Address:</td>
                                <td>{MemberInfo.Address}</td>
                            </tr>
                            <tr>
                                <td>Phone Number:</td>
                                <td>{MemberInfo.PhoneNumber}</td>
                            </tr>
                            <tr>
                                <td>Primary Language:</td>
                                <td>{MemberInfo.PrimaryLanguage}</td>
                            </tr>
                            <tr>
                                <td>Primary Care Physician:</td>
                                <td>{MemberInfo.PrimaryCarePhysician}</td>
                            </tr>
                            <tr>
                                <td>Member ID:</td>
                                <td>{MemberInfo.MemberId}</td>
                            </tr>
                            <tr>
                                <td>Insurance Category:</td>
                                <td>{MemberInfo.InsuranceCategory}</td>
                            </tr>
                            <tr>
                                <td>Member Plan Type:</td>
                                <td>{MemberInfo.MemberPlanType}</td>
                            </tr>
                            <tr>
                                <td>TPA:</td>
                                <td>{MemberInfo.TPA}</td>
                            </tr>
                            <tr>
                                <td>Group ID:</td>
                                <td>{MemberInfo.GroupId}</td>
                            </tr>
                            <tr>
                                <td>Group Name:</td>
                                <td>{MemberInfo.GroupName}</td>
                            </tr>
                            <tr>
                                <td>LOB Code:</td>
                                <td>{MemberInfo.LOBCode}</td>
                            </tr>
                        </tbody>
                    </Table>
}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default MemberInfo;
