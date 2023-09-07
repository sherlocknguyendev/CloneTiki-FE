
import { Form, Button, Input, Divider, notification, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callLogin } from '../../service/api';
import './Login.scss'
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice'

const LoginPage = () => {
    const navigate = useNavigate()
    const [isSubmit, setIsSubmit] = useState(false)

    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const { username, password } = values
        setIsSubmit(true)
        const res = await callLogin(username, password);
        setIsSubmit(false)
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            navigate('/')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in notification of LoginPage',
                duration: 3
            })
        }
    };

    return (
        <>
            <div className='login-page' style={{ padding: '50px' }}>
                <h2 style={{ textAlign: 'center' }}>Đăng Nhập</h2>
                <Divider />
                <Form
                    name="login"

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
                            span: 24,
                        }}
                        label="Email"
                        name="username"
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
                            span: 24,
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
                        wrapperCol={{
                            // offset: 24,
                            span: 24,
                        }}
                    >
                        <Button
                            style={{ width: '100%', height: '100%', fontSize: '20px' }}
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Login
                        </Button>

                    </Form.Item>
                    <Divider>Or</Divider>

                    <p style={{ textAlign: 'center' }}>
                        Chưa có tài khoản?
                        <span>
                            <Link to='/register'>Đăng ký</Link>
                        </span>
                    </p>

                </Form>
            </div>
        </>
    )

}

export default LoginPage