

import HeaderAdmin from '../HeaderAdmin';
import FooterAdmin from '../FooterAdmin';
import { Outlet, Link, useHref } from 'react-router-dom'
import { useSelector } from 'react-redux';


import React, { useState } from 'react';
import {
    AppstoreOutlined,
    EuroOutlined,
    UserOutlined,
    FormOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { Breadcrumb, Divider, Layout, Menu, theme } from 'antd';
import { useEffect } from 'react';

const { Header, Content, Footer, Sider } = Layout;


const items = [
    {
        label: <Link to='/admin' >Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <Link to='/admin/user'>CRUD</Link>,
        key: 'user',
        icon: <UserOutlined />,

    },
    {
        label: <Link to='/admin/book' >Manage Book</Link>,
        key: 'book',
        icon: <FormOutlined />
    },
    {
        label: <Link to='/admin/orders' >Manage Orders</Link>,
        key: 'orders',
        icon: <EuroOutlined />
    },


];



const LayoutAdmin = () => {
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    const user = useSelector(state => state.account.user);
    const userRole = user.role;

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard')

    const {
        token: { colorBgContainer },
    } = theme.useToken();


    useEffect(() => {
        if (window.location.pathname.includes('/book')) {
            setActiveMenu('book')
        }
        if (window.location.pathname.includes('/user')) {
            setActiveMenu('user')
        }
        if (window.location.pathname.includes('/orders')) {
            setActiveMenu('orders')
        }
    }, [])

    return (
        <>
            <div className='wrapper'>

                <Layout
                    style={{
                        minHeight: '100vh',

                    }}
                >
                    <Sider
                        theme="light"
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                    >
                        <div style={{ fontSize: '16px', color: '#333', fontWeight: 500, textAlign: 'center', padding: '12px' }}>Admin</div>
                        <Menu
                            theme="light"
                            // defaultSelectedKeys={[activeMenu]}
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={items}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    <Layout >

                        <span style={{ fontSize: '22px', position: 'relative', top: '2px', padding: '8px' }}>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed)
                            })}
                        </span>
                        {
                            isAdminRoute && userRole === 'ADMIN' &&
                            <HeaderAdmin />
                        }
                        <Content
                            style={{
                                margin: '14px 16px 0',
                            }}
                        >
                            <Outlet />
                        </Content>

                        {
                            isAdminRoute && userRole === 'ADMIN' &&
                            <Footer
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <FooterAdmin />
                            </Footer>
                        }
                    </Layout>
                </Layout>
            </div>
        </>
    )
}

export default LayoutAdmin