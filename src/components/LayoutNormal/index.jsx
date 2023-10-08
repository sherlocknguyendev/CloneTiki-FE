


import { Layout, Space } from 'antd';
import HeaderNormal from '../HeaderNormal';
import FooterNormal from '../FooterNormal';
import { Outlet } from 'react-router-dom'
import { useState } from 'react';


const { Header, Footer, Sider, Content } = Layout;



const headerStyle = {
    textAlign: 'center',
    color: '#000',
    height: 64,
    lineHeight: '64px',
    backgroundColor: '#fff',
    padding: 0
};

const contentStyle = {
    textAlign: 'center',
    minHeight: "120px",
    lineHeight: '120px',
    color: '#000',
    backgroundColor: '#fff',
    padding: 0
};

const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#000',
    backgroundColor: '#fff',
};

const footerStyle = {
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#fff',
    padding: 0
};


const LayoutNormal = () => {

    const [searchTerm, setSearchTerm] = useState("")

    return (
        <>
            <div className='wrapper'>
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                    size={[0, 48]}
                >

                    <Layout style={{
                        minHeight: '100vh'
                    }}>
                        <Header style={headerStyle}>
                            <HeaderNormal searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </Header>

                        <Layout hasSider>
                            <Content style={contentStyle}>
                                <Outlet context={[searchTerm, setSearchTerm]} />
                            </Content>
                        </Layout>

                        <Footer style={footerStyle}>
                            <FooterNormal />
                        </Footer>

                    </Layout>


                </Space>
            </div>
        </>
    )
}

export default LayoutNormal