
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout } from '../../service/api';

import './HeaderAdmin.scss'


const HeaderAdmin = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const res = await callLogout()
        if (res && res.data) {
            dispatch(doLogoutAction())
            message.success('Đăng xuất thành công!');
            navigate('/')
        }
    }

    const items = [
        {
            label: <label>Quản lý tài thoản</label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },

    ];



    const userName = useSelector(state => state.account.user.fullName)

    return (
        <>
            <div className="nav-admin-page">

                <div className="account-admin-page">
                    <span className='text'>Welcome, </span>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a onClick={(e) => e.preventDefault()}>

                            <Space style={{ fontSize: '20px' }}>
                                {userName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

export default HeaderAdmin