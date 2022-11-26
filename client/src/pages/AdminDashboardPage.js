import React, {useEffect, useState} from 'react';
import getAPIRecords from '../api/adminRecordAPI';
import { getCookie, removeCookie } from '../utils/cookie';
import "../styles/AdminDashboard.css"
import {Report1, Report2, Report3} from "../components/Reports"

function AdminDashboard() {

    const [apiRecords, setAPIRecords] = useState([])
    const [recordShown, setRecordShown] = useState(1)
    
    useEffect(() => {
        const getRecords  = async () => {
            const authToken = getCookie("token")
            const records = await getAPIRecords(authToken)
            setAPIRecords(records.data.data)
        }

        getRecords()
    }, [])


    const showRecord = (recordNumber) => {
        setRecordShown(recordNumber)
    }

    const getReport = () => {
        return (
            <>
                <h1>Report number {recordShown}</h1>
                {recordShown === 1 ? <Report1 record={apiRecords}/> : null}
                {recordShown === 2 ? <Report2 record={apiRecords}/> : null}
                {recordShown === 3 ? <Report3 record={apiRecords}/> : null}
            </>
        )
    }

    const handleLogout = () => {
        removeCookie("token")
        removeCookie("userType")
        window.location.reload()
    }

    return (
        <>
            <h1>Admin Dashboard </h1>
            <button onClick={handleLogout}>Logout</button>
            <h3>Choose a record below</h3>
            <h4 onClick={() => {showRecord(1)}}>1. Unique API user vs. Time</h4>
            <h4 onClick={() => {showRecord(2)}}>2. 4xx errors by endpoint</h4>
            <h4 onClick={() => {showRecord(3)}}>3. Recent 4xx/5xx errors</h4>

            {getReport()}
        </>
    )
}

export default AdminDashboard;