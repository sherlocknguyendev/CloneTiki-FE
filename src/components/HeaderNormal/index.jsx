
import './HeaderNormal.scss'

import { BiLogoReact } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'

import { SearchOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';

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

    const items = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài thoản</label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },

    ];

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
                        </>
                        :
                        <span className='text'>
                            <Link to='/login'>Đăng nhập</Link>
                        </span>
                    }


                </div>
            </nav>
        </>
    )
}

export default HeaderNormal