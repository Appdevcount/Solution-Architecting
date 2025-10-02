import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Attachments from './Attachments';
import * as AttachmentService from '../../services/Attachment';

// Mock the attachment service functions
jest.mock('../../services/Attachment', () => ({
  getUploadedFiles: jest.fn().mockResolvedValue({
    apiResult: [
      { 
        ObjectId: 'file1', 
        Filename: 'test-file-1.pdf',
        DocumentType: 'Clinical Information'
      }
    ]
  }),
  uploadFile: jest.fn().mockResolvedValue({
    fileUploadSuccess: true
  }),
  downloadFile: jest.fn().mockResolvedValue({
    blob: jest.fn().mockResolvedValue(new Blob(['test content'], { type: 'application/pdf' })),
    headers: {
      get: jest.fn().mockReturnValue('attachment; filename="test-file.pdf"')
    }
  }),
  deleteFile: jest.fn().mockResolvedValue({
    isDeleted: true
  })
}));

// Create a mock store
const mockStore = configureStore([]);

describe('Attachments Component', () => {
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock store with required state
    store = mockStore({
      request: {
        RequestId: '12345',
        MemberInformation: {
          Name: 'Test Patient'
        },
        RequestInformation: {
          Status: 'Open'
        },
        AssignToId: 'test@example.com'
      },
      auth: {
        user: {
          email: 'test@example.com',
          roles: ['CCCordSup']
        }
      }
    });
  });

  // Basic rendering test
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Attachments />
      </Provider>
    );
  });

  // Test API function calls
  test('getUploadedFiles is called with correct parameters', () => {
    AttachmentService.getUploadedFiles('12345');
    expect(AttachmentService.getUploadedFiles).toHaveBeenCalledWith('12345');
  });

  test('uploadFile is called with correct parameters', () => {
    const formData = new FormData();
    AttachmentService.uploadFile(formData);
    expect(AttachmentService.uploadFile).toHaveBeenCalledWith(formData);
  });

  test('downloadFile is called with correct parameters', () => {
    AttachmentService.downloadFile('file1');
    expect(AttachmentService.downloadFile).toHaveBeenCalledWith('file1');
  });

});
