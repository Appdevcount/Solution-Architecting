/* istanbul ignore file */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CreateRequest from '../pages/CreateRequestView';
import SearchRequest from '../pages/SearchRequestView';
import ViewRequest from '../pages/RequestSummaryView';
import styles from './MainContent.module.css';
import Login from '../auth/Login';
import ProtectedRoute from '../auth/ProtectedRoute';
import InvalidSession from '../auth/InvalidSession';
import SearchHistoricalRequestView from '../pages/SearchHistoricalRequestView';

const MainContent: React.FC = () => {



    return (<div className={styles.rightPane}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={['']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/invalidsession"
                element={
                        <InvalidSession />
                }
            />
            <Route
                path="/createrequest"
                element={
                    <ProtectedRoute allowedRoles={['']}>
                        <CreateRequest />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/searchrequest"
                element={
                    <ProtectedRoute allowedRoles={['']}>
                        <SearchRequest />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/searchhistoricalrequest"
                element={
                    <ProtectedRoute allowedRoles={['']}>
                        <SearchHistoricalRequestView />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/viewrequest"
                element={
                    <ProtectedRoute allowedRoles={['']}>
                        <ViewRequest />
                    </ProtectedRoute>
                }
            />

        </Routes>
    </div>
    );
};

export default MainContent;
