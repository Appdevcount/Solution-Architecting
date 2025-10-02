import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewRequest from './RequestSummaryView';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as RequestService from '../services/RequestService';
import configureStore from 'redux-mock-store';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../services/RequestService', () => ({
  GetRequest: jest.fn(),
  UndoEscalate: jest.fn(),
  UndoMSOC: jest.fn(),
  UpdateMSOC: jest.fn(),
}));

jest.mock('../components/RequestSummary/HealthPlanCaseManager', () => {
  return function DummyHealthPlanCaseManager() {
    return <div data-testid="health-plan-case-manager">HealthPlanCaseManager Component</div>;
  };
});

jest.mock('../components/RequestSummary/ServicingProvider', () => {
  return function DummyServicingProvider() {
    return <div data-testid="servicing-provider">ServicingProvider Component</div>;
  };
});

jest.mock('../components/RequestSummary/ProcedureCode', () => {
  return function DummyProcedureCode() {
    return <div data-testid="procedure-code">ProcedureCode Component</div>;
  };
});

jest.mock('../components/RequestSummary/Notes', () => {
  return function DummyNotes() {
    return <div data-testid="notes">Notes Component</div>;
  };
});

jest.mock('../components/RequestSummary/FollowUpInfo', () => {
  return function DummyFollowUpInfo() {
    return <div data-testid="follow-up-info">FollowUpInfo Component</div>;
  };
});

jest.mock('../components/RequestSummary/CareCoordination', () => {
  return function DummyCareCoordinationInfo() {
    return <div data-testid="care-coordination-info">CareCoordinationInfo Component</div>;
  };
});

jest.mock('../components/RequestSummary/MemberInformation', () => {
  return function DummyMemberInformation() {
    return <div data-testid="member-information">MemberInformation Component</div>;
  };
});

jest.mock('../components/RequestSummary/RequesterInfoSummary', () => {
  return function DummyRequesterInfoSummary() {
    return <div data-testid="requester-info-summary">RequesterInfoSummary Component</div>;
  };
});

jest.mock('../components/RequestSummary/Attachments', () => {
  return function DummyAttachments() {
    return <div data-testid="attachments">Attachments Component</div>;
  };
});

jest.mock('../components/RequestSummary/MSOC', () => {
  return function DummyMSOC(props) {
    return (
      <div data-testid="msoc-modal" data-show={props.show}>
        <button onClick={props.onHide}>Close</button>
        <button onClick={props.onSuccess}>Success</button>
      </div>
    );
  };
});

jest.mock('../components/RequestSummary/CloseRequest', () => {
  return function DummyCloseRequest(props) {
    return (
      <div data-testid="close-request-modal" data-show={props.show}>
        <button onClick={props.onHide}>Cancel</button>
        <button onClick={props.onSuccess}>Success</button>
      </div>
    );
  };
});

jest.mock('../components/RequestSummary/Activity', () => {
  return function DummyActivity(props) {
    return <div data-testid="activity">Activity Component</div>;
  };
});

jest.mock('../components/RequestSummary/Escalate', () => {
  return function DummyEscalate(props) {
    return (
      <div data-testid="escalate-modal" data-show={props.show}>
        <button onClick={props.onHide}>Close</button>
        <button onClick={props.onSuccess}>Success</button>
      </div>
    );
  };
});

describe('ViewRequest Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockRequestId = '12345';
  
  const mockRequestData = {
    RequestInformation: {
      RequestId: mockRequestId,
      Status: 'Open',
      isEscalated: false
    },
    MemberInformation: {
      Name: 'John Doe',
      DateOfBirth: '01/01/1980',
      Age: '43',
      Gender: 'Male',
      MemberId: 'M12345',
      Insurance: 'Blue Cross',
      MemberQuickCreate: false
    },
    AssignToId: 'user@example.com',
    MSOCtag: false,
    StaffedRequest: true,
    ProcedureCode: [
      { procedureCode: 'P001', procedureDesc: 'Procedure 1' }
    ],
    CareCoordinationInformation: {
      ServiceType: 'Home Health'
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useLocation as jest.Mock).mockReturnValue({
      state: { RequestId: mockRequestId }
    });
    
    const mockStore = configureStore([]);
    
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    
   let store = mockStore({
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup'],
          hasLEA: true,
        },
      },
    });
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockRequestData);
    
    (RequestService.UndoMSOC as jest.Mock).mockResolvedValue({
      apiResp: true
    });
    
    (RequestService.UndoEscalate as jest.Mock).mockResolvedValue({
      apiResp: true
    });
  });

  test('renders loading state initially', () => {
    render(<ViewRequest />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  test('renders error state when API call fails', async () => {
    (RequestService.GetRequest as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  test('renders request details after successful API call', async () => {
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.getByText(`Request # :`)).toBeInTheDocument();
      
    });
    expect(screen.getByText(mockRequestId)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('renders all child components', async () => {
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.getByTestId('health-plan-case-manager')).toBeInTheDocument();    
    });
      expect(screen.getByTestId('servicing-provider')).toBeInTheDocument();
      expect(screen.getByTestId('procedure-code')).toBeInTheDocument();
      expect(screen.getByTestId('notes')).toBeInTheDocument();
      expect(screen.getByTestId('follow-up-info')).toBeInTheDocument();
      expect(screen.getByTestId('care-coordination-info')).toBeInTheDocument();
      expect(screen.getByTestId('member-information')).toBeInTheDocument();
      expect(screen.getByTestId('requester-info-summary')).toBeInTheDocument();
      expect(screen.getByTestId('attachments')).toBeInTheDocument();
      expect(screen.getByTestId('activity')).toBeInTheDocument();
  });

  test('dispatches setRequestDetails action after successful API call', async () => {
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        payload: mockRequestData
      }));
    });
  });

  test('shows MSOC modal when MSOC button is clicked', async () => {
    render(<ViewRequest />);
    
    const msocButton = await screen.findByText('MSOC');
    fireEvent.click(msocButton)
    await waitFor(() => {
      const msocModal = screen.getByTestId('msoc-modal');
      expect(msocModal).toHaveAttribute('data-show', 'true');
    });     
  });

  test('shows MSOC tag after successful MSOC action', async () => {
    render(<ViewRequest />);
    
   
      const msocButton = await screen.findByText('MSOC');
      fireEvent.click(msocButton);
    await waitFor(()=>{
            expect(screen.getByText('MSOC')).toBeInTheDocument();
    })

  });
  test('handles Undo MSOC action', async () => {
    const mockMSOCRequest = {
      ...mockRequestData,
      MSOCtag: true
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockMSOCRequest);
    
    render(<ViewRequest />);
    
    
      const undoMSOCButton = await  screen.findByText('Undo MSOC');
      fireEvent.click(undoMSOCButton);
    await waitFor(() => {
      expect(RequestService.UndoMSOC).toHaveBeenCalled();
    });
  });

  test('shows Escalate modal when Escalate button is clicked', async () => {
    render(<ViewRequest />);
    
     const escalateButton = await screen.findByText('Escalate Request');
     fireEvent.click(escalateButton);
    await waitFor(() => {
       const escalateModal = screen.getByTestId('escalate-modal');
       expect(escalateModal).toHaveAttribute('data-show', 'true');
    });         
      
  });
  test('handles Undo Escalate action', async () => {
    const mockEscalatedRequest = {
      ...mockRequestData,
      RequestInformation: {
        ...mockRequestData.RequestInformation,
        isEscalated: true
      }
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockEscalatedRequest);
    
    render(<ViewRequest />);
    
    const undoEscalateButton = await screen.findByText('Undo Escalation');
    fireEvent.click(undoEscalateButton);

    await waitFor(() => {
        expect(RequestService.UndoEscalate).toHaveBeenCalled();
    });
      
  });

  test('shows Close Request modal when Close request button is clicked', async () => {
    render(<ViewRequest />);
    
    const closeRequestButton = await screen.findByText('Close request');
    fireEvent.click(closeRequestButton);
    await waitFor(() => {
      const closeRequestModal = screen.getByTestId('close-request-modal');
      expect(closeRequestModal).toHaveAttribute('data-show', 'true');
    });          
      
  });

  test('updates status to Closed after successful Close Request action', async () => {
    render(<ViewRequest />);
    
     const closeRequestButton = await  screen.findByText('Close request');   
     fireEvent.click(closeRequestButton); 
    await waitFor(() => {
        expect(screen.getByText(/Open/i)).toBeInTheDocument();
    });      
  });

  test('hides Close Request modal when Cancel is clicked', async () => {
    render(<ViewRequest />);
    
    const closeRequestButton = await screen.findByText('Close request');
      fireEvent.click(closeRequestButton);       
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);  
            
    await waitFor(() => {
      const closeRequestModal = screen.getByTestId('close-request-modal');
      expect(closeRequestModal).toHaveAttribute('data-show', 'false');
    });  
      
  });

  test('does not render ServicingProvider when StaffedRequest is false', async () => {
    const mockUnstaffedRequest = {
      ...mockRequestData,
      StaffedRequest: false
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockUnstaffedRequest);
    
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('servicing-provider')).not.toBeInTheDocument();
    });
  });

  test('shows QuickCreatedMember tag when MemberQuickCreate is true', async () => {
    const mockQuickCreateRequest = {
      ...mockRequestData,
      MemberInformation: {
        ...mockRequestData.MemberInformation,
        MemberQuickCreate: true
      }
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockQuickCreateRequest);
    
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.getByText('QuickCreatedMember')).toBeInTheDocument();
    });
  });

  test('does not show action buttons when status is Closed', async () => {
    const mockClosedRequest = {
      ...mockRequestData,
      RequestInformation: {
        ...mockRequestData.RequestInformation,
        Status: 'Closed'
      }
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockClosedRequest);
    
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.queryByText('Close request')).not.toBeInTheDocument();
      
    });
      expect(screen.queryByText('MSOC')).not.toBeInTheDocument();
      expect(screen.queryByText('Escalate Request')).not.toBeInTheDocument();
  });

  test('does not show action buttons when user is not case owner or supervisor', async () => {
    render(<ViewRequest />);
    
    await waitFor(() => {
      expect(screen.queryByText('MSOC')).not.toBeInTheDocument();
    });
      expect(screen.queryByText('Escalate Request')).not.toBeInTheDocument();

  });

  test('handles API error during UndoMSOC', async () => {
    const mockMSOCRequest = {
      ...mockRequestData,
      MSOCtag: true
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockMSOCRequest);
    (RequestService.UndoMSOC as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ViewRequest />);
    
    const undoMSOCButton = await screen.findByText('Undo MSOC');
    fireEvent.click(undoMSOCButton);
    await waitFor(() => {      
      expect(mockAlert).toHaveBeenCalledWith('Undo failed: API Error');
    });
    
    mockAlert.mockRestore();
  });

  test('handles API error during UndoEscalate', async () => {
    const mockEscalatedRequest = {
      ...mockRequestData,
      RequestInformation: {
        ...mockRequestData.RequestInformation,
        isEscalated: true
      }
    };
    
    (RequestService.GetRequest as jest.Mock).mockResolvedValue(mockEscalatedRequest);
    (RequestService.UndoEscalate as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ViewRequest />);
    
    const undoEscalateButton = await screen.findByText('Undo Escalation');
    fireEvent.click(undoEscalateButton);
    await waitFor(() => {      
      expect(mockAlert).toHaveBeenCalledWith('Undo failed: API Error');
    
    });   
    mockAlert.mockRestore();
  });
});
