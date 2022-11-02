import React, { useCallback, useEffect, useState } from "react";
import {Button} from 'antd';
import axios from 'axios';
const useAsync = (asyncFunction: Function) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const execute = useCallback(() => {
        setError('');
        setLoading(true);
        setData([]);
        return asyncFunction().then((data: any)=> {
            setLoading(false);
            setData(data);
        }).catch((e: any) => {
            setLoading(false);
            setError(e);
        })
    }, [asyncFunction]);
    return { execute, error, loading, data };
}

export function UserList() {
    const { execute: fetchUsers, error, loading, data } = useAsync(async () => {
        const res = await axios({
            url: 'http://localhost:3000',
            method: 'get'
        });
        return res.data;
    });
    useEffect(() => fetchUsers, []);
    return (
        <div><Button value={data}/></div>
        
    )
}