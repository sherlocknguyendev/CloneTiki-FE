
import { useState } from 'react';
import { Button, Divider, Form, Input, message, notification, } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { callRegister } from '../../service/api';
import './Register.scss'



const RegisterPage = () => {
    const navigate = useNavigate()
    const [isSubmit, setIsSubmit] = useState(false)



    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values
        setIsSubmit(true)
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false)
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message && res.message.length > 0 ? res.message : 'Error in RegisterPage',
                duration: 3
            })
        }
    };


    return (
        <>
            <div className='register-page'>
                <h2 style={{ textAlign: 'center' }}>Đăng Ký Tài Khoản</h2>
                <Divider />
                <Form
                    name="register"
                    style={{
                        maxWidth: 600,
                        margin: '0 auto'
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{
                            span: 24
                        }}
                        label="Full Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your full name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24
                        }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24
                        }}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item

                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Button style={{ width: '100%', height: '100%', fontSize: '20px' }} type="primary" htmlType="submit" loading={isSubmit}>
                            Register
                        </Button>

                    </Form.Item>
                    <Divider>Or</Divider>

                    <p style={{ textAlign: 'center' }}>
                        Đã có tài khoản?
                        <span>
                            <Link to='/login'>Đăng nhập</Link>
                        </span>
                    </p>

                </Form>
            </div>
        </>
    )
}

export default RegisterPage