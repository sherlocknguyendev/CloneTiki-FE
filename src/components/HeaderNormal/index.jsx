
import './HeaderNormal.scss'

import { BiLogoReact } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'

import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Divider, Input, message } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Badge } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../service/api';

import { doLogoutAction } from '../../redux/account/accountSlice'


import { useNavigate, Link } from 'react-router-dom';






const HeaderNormal = () => {

    const userName = useSelector(state => state.account.user.fullName)
    const user = useSelector(state => state.account.user)

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

    let items = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài thoản</label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },
    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;


    return (
        <>
            <nav className='nav'>
                <div className="nav_icon">
                    <a className='icon'><BiLogoReact /></a>
                    <div className='trademark'>S.N.Dev</div>
                </div>
                <div className="nav_search-cart">
                    <div className='search'>
                        <Input size="large" placeholder="Bạn cần mua gì hôm nay?" prefix={<SearchOutlined />} />
                    </div>
                    <a className='cart'>
                        <Space >
                            <Badge size='small' count={5}>
                                <BsCart />
                            </Badge>
                        </Space>
                    </a>
                </div>
                <div className="nav_account">
                    {userName ?
                        <>

                            <Dropdown

                                menu={{
                                    items,
                                }}
                                trigger={['click']}
                            >

                                <Space style={{ fontSize: '20px', cursor: 'pointer' }}>
                                    <Avatar src={urlAvatar}></Avatar>
                                    {userName}
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        </>
                        :
                        <span className='text'>
                            <Link to='/login'>Đăng nhập</Link>
                        </span>
                    }


                </div>
            </nav >
        </>
    )
}

export default HeaderNormal