
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, message, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import { callLogout } from '../../../service/api';

import './HeaderAdmin.scss'
import ManageAccount from '../../Manager/ManageAccount';


const HeaderAdmin = () => {

    const [isOpenManageModal, setIsOpenManageModal] = useState(false)



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
            label: <Link to='/'>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label onClick={() => setIsOpenManageModal(true)} style={{ cursor: 'pointer' }}>Quản lý tài thoản</label>,
            key: 'account',
        },

        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },

    ];



    const userName = useSelector(state => state.account.user.fullName)
    const user = useSelector(state => state.account.user)


    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;


    return (
        <>
            <div className="nav-admin-page">

                <div className="account-admin-page">
                    <Dropdown
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <Space style={{ fontSize: '20px', cursor: "pointer" }}>
                            <Avatar src={urlAvatar}></Avatar>
                            {userName}
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
            </div>

            <ManageAccount
                isOpenManageModal={isOpenManageModal}
                setIsOpenManageModal={setIsOpenManageModal}
            />
        </>
    )
}

export default HeaderAdmin