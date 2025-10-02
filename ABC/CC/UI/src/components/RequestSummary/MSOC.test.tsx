import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MSOC from "../RequestSummary/MSOC";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import * as RequestService from "../../services/RequestService";
import { act } from "react-dom/test-utils";

// Mock the RequestService
jest.mock("../../services/RequestService", () => ({
  UpdateMSOC: jest.fn(),
}));

const mockStore = configureStore([]);

describe("MSOC Component", () => {
    const mockOnSuccess = jest.fn(); 
    const mockOnHide = jest.fn(); 
    let store;

    beforeEach(() => {
        store = mockStore({
            request: {
                RequestId: '12345',
                msocTag: false,
                RequestInformation: {
                    Status: 'Open'
                }
            },
            auth: {
                user: {
                    email: 'test@example.com',
                    roles: ['CCCordSup']
                }
            }
        });
        
        jest.clearAllMocks();
    });

    test("renders MSOC modal with correct props", () => {
        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Confirmation Required"
                    body={<div>Are you sure you want to perform this action?</div>}
                />
            </Provider>
        );

        expect(screen.getByText("Confirmation Required")).toBeInTheDocument();
        expect(
            screen.getByText("Are you sure you want to perform this action?")
        ).toBeInTheDocument();
        expect(screen.getByText("Submit")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    test("checks if dropdown opens and allows selection", () => {
        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        const dropdown = screen.getByRole("combobox", { name: /Reason/i });
        expect(dropdown).toBeInTheDocument();

        fireEvent.change(dropdown, { target: { value: "Custom Needs" } });
        expect((dropdown as HTMLSelectElement).value).toBe("Custom Needs");
    });

    test("checks if dropdown is rendered and contains correct options", () => {
        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        // Check if the dropdown is rendered
        const dropdown = screen.getByRole("combobox", { name: /reason/i });
        expect(dropdown).toBeInTheDocument();

        // Check if the dropdown contains all the options
        const dropdownOptions = screen.getAllByRole("option");
        expect(dropdownOptions).toHaveLength(10); // Ensure all 10 options are present

        const expectedOptions = [
            "Select Reason",
            "Urgent 48hrs",
            "Non Urgent 5d",
            "Private Duty Nursing",
            "Custom Needs",
            "All Other Reasons",
            "Insufficient Lead Time",
            "Referral Source",
            "Provider Not Available",
            "eviCore Error",
        ];

        // Check if all options match the expected values
        dropdownOptions.forEach((option, index) => {
            expect(option).toHaveTextContent(expectedOptions[index]);
        });
    });

    test("calls onHide when Cancel button is clicked", () => {
        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        fireEvent.click(screen.getByText("Cancel"));
        expect(mockOnHide).toHaveBeenCalledTimes(1);
    });


    test("handles API error during submission", async () => {
        // Mock API error
        (RequestService.UpdateMSOC as jest.Mock).mockRejectedValue(
            new Error("API error occurred")
        );

        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        // Select a reason
        const dropdown = screen.getByRole("combobox", { name: /Reason/i });
        fireEvent.change(dropdown, { target: { value: "Urgent 48hrs" } });

        // Submit the form
            fireEvent.click(screen.getByText("Submit"));
        // Check for error message
        await waitFor(() => {
            expect(screen.getByText("API error occurred")).toBeInTheDocument();
        });

        // Verify onSuccess was not called
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test("handles unsuccessful API response", async () => {
        // Mock unsuccessful API response
        (RequestService.UpdateMSOC as jest.Mock).mockResolvedValue({
            apiResp: false
        });

        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        // Select a reason
        const dropdown = screen.getByRole("combobox", { name: /Reason/i });
        fireEvent.change(dropdown, { target: { value: "Urgent 48hrs" } });

        // Submit the form
            fireEvent.click(screen.getByText("Submit"));

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText("MSOC tag can not be added!")).toBeInTheDocument();
        });

        // Verify onSuccess was not called
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test("Close MSOC Modal when API call failed", async () => {
        // Mock unsuccessful API response to trigger alert
        (RequestService.UpdateMSOC as jest.Mock).mockResolvedValue({
            apiResp: false
        });

        render(
            <Provider store={store}>
                <MSOC
                    show={true}
                    onHide={mockOnHide}
                    onSuccess={mockOnSuccess}
                    title="Test Title"
                    body={<div>Test Body Content</div>}
                />
            </Provider>
        );

        // Select a reason and submit to trigger alert
        const dropdown = screen.getByRole("combobox", { name: /Reason/i });
        fireEvent.change(dropdown, { target: { value: "Urgent 48hrs" } });

            fireEvent.click(screen.getByText("Submit"));
        

        // Verify alert is shown
        await waitFor(() => {
            expect(screen.getByText("MSOC tag can not be added!")).toBeInTheDocument();
        });

            fireEvent.click(screen.getByText("Cancel"));
        

        
    });
});
