

import { Button, Form, Input, message, notification } from "antd"
import { useForm } from "antd/es/form/Form"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { callUpdatePassword } from "../../service/api"



const ChangePassword = () => {

    const user = useSelector(state => state.account.user)
    const [isSubmit, setIsSubmit] = useState(false)
    const [form] = useForm()

    useEffect(() => {
        form.setFieldsValue(user)
    }, [])

    const onFinish = async (values) => {
        const { email, oldPassword, newPassword } = values
        setIsSubmit(true)
        const res = await callUpdatePassword(email, oldPassword, newPassword)
        if (res && res.data) {
            message.success('Cập nhật mật khẩu thành công!')
            form.setFieldValue("oldPassword", '');
            form.setFieldValue("newPassword", '');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsSubmit(false)

    }

    return (
        <>
            <Form
                form={form}
                name="change-password"
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
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your full name!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    labelCol={{
                        span: 24
                    }}
                    label="Nhập lại mật khẩu cũ"
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    labelCol={{
                        span: 24
                    }}
                    label="Nhập mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your newPassword!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button
                        className='btn-manage-account'
                        htmlType="submit"
                        type="primary"
                        loading={isSubmit}
                    >

                        Cập nhật mật khẩu
                    </Button>

                </Form.Item>
            </Form>

        </>
    )
}

export default ChangePassword