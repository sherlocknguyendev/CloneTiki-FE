
import './HeaderNormal.scss'

import { BiLogoReact } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'

import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Divider, Input, Popover, message } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Badge } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../service/api';

import { doLogoutAction } from '../../redux/account/accountSlice'


import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import ManageAccount from '../Manager/ManageAccount';






const HeaderNormal = ({ searchTerm, setSearchTerm }) => {


    const [isOpenManageModal, setIsOpenManageModal] = useState(false)

    const userName = useSelector(state => state.account.user.fullName)
    const user = useSelector(state => state.account.user)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const carts = useSelector(state => state.order.carts)

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
            label: <label onClick={() => setIsOpenManageModal(true)} style={{ cursor: 'pointer' }}>Quản lý tài thoản</label>,
            key: 'account',
        },
        {
            label: <Link to='/history'>Lịch sử giao dịch</Link>,
            key: 'history',
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

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`} >
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div className='product-name'>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="pop-cart-footer">
                    <Link className='btn-cart' to='/order'>Xem giỏ hàng</Link>
                </div>
            </div>
        )
    }


    return (
        <>
            <nav className='nav'>
                <div className="nav_icon">
                    <Link className='icon' to='/'>
                        <BiLogoReact />
                    </Link>
                    <Link to='/' className='trademark'>S.N.Dev</Link>
                </div>
                <div className="nav_search-cart">
                    <div className='search'>
                        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="large" placeholder="Bạn cần mua sách nào?" prefix={<SearchOutlined style={{ color: 'rgb(64, 138, 241)' }} />} />
                    </div>
                    <a className='cart'>
                        <Popover
                            className='popover-carts'
                            rootClassName='popover-carts'
                            placement='topRight'
                            title={'Danh sách sản phẩm'}
                            content={contentPopover}
                            arrow={true}
                        >
                            <Badge size='small' count={carts ? carts.length : 0} showZero>
                                <BsCart className='cart-icon' />
                            </Badge>
                        </Popover>
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

            <ManageAccount
                isOpenManageModal={isOpenManageModal}
                setIsOpenManageModal={setIsOpenManageModal}
            />
        </>
    )
}

export default HeaderNormal