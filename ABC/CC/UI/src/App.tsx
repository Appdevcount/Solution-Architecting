
import React from 'react';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import MainContent from './layout/MainContent';
import styles from './App.module.css'; // Import CSS module
import { Provider } from 'react-redux';
import { store } from './state/store/store';
import AuthProvider from './context/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';


const App: React.FC = () => {

    return (
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter basename='/CareCoordinationUI'>
                    <ErrorBoundary>
                        <AuthProvider>
                            <div className={styles.container}>
                                <Sidebar />
                                <MainContent />
                            </div>
                        </AuthProvider>
                    </ErrorBoundary>
                </BrowserRouter>
            </Provider>
        </React.StrictMode>

    );
};

export default App;
