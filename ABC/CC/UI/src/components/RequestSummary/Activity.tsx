import React, { useEffect, useState } from 'react';
import { Card, Col, CardHeader } from 'react-bootstrap';
import { RootState } from '../../state/store/store';
import { useSelector } from 'react-redux';
import CustomAlert from '../CustomAlert';
import { GetActivityDetails } from '../../services/Activity';
import { ActivityResponse, ResponseActivityResponseModel } from '../../types/ActivityModel';


interface ActivityComponentProps{
    refreshFlag?:boolean;
    resetRefreshFlag?: () => void;
}

const ActivityComponent: React.FC<ActivityComponentProps> = ({refreshFlag,resetRefreshFlag}) => {

    const request: any = useSelector((state: RootState) => state.request);
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' }); 
    const [activities, setActivites] = useState<ActivityResponse[]>([]);



    const fetchData = async () => {
        try{
          const response: ResponseActivityResponseModel = await GetActivityDetails(request?.RequestId);
          if(response.apiResult){
            setActivites(response.apiResult);
          }else{
            setActivites([]);
          }
        } catch (err){
         setError("Faild to fetch activities")
        }
    };
    useEffect(() => {
        
        fetchData();
    }, []);

    
    useEffect(() => {
        if(refreshFlag){
            fetchData();
            resetRefreshFlag &&
            resetRefreshFlag();


        }   
    }, [refreshFlag]);
   
    return (
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader >
                    Activity
                </CardHeader>
                <Card.Body className="p-2">
                <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                    <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {activities.map((activity, index) => (
                        <Card className="mb-2"  key={index}>
                            <Card.Body>
                             <strong> {activity.CreatedBy}</strong> {activity.Comment}
                             <br />
                             <small className="text-muted">{activity.CreatedDate}</small>
                            </Card.Body>
                        </Card>                   
                    ))}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ActivityComponent;
