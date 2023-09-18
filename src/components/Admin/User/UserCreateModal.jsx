

import { Button, Modal, Form, Input, message, notification, Divider, } from 'antd';
import { useState } from 'react';
import { callCreateUser } from '../../../service/api';


const UserCreateModal = ({ openCreateModal, setOpenCreateModal }) => {

    const [form] = Form.useForm() // Sử dụng giống useRef
    const [isCreate, setIsCreate] = useState(false)


    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsCreate(true);
        const res = await callCreateUser(fullName, email, password, phone);
        setIsCreate(false);
        if (res?.data?._id) {
            message.success('Tạo mới người dùng thành công!');
            form.resetFields();
            setOpenCreateModal(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in CreateModal',
                duration: 3
            })
            setOpenCreateModal(false);
        }
    };


    return (
        <>
            <Modal
                title="Create a new user"
                open={openCreateModal}
                onOk={() => { form.submit() }} //  Khi ấn submit của Modal đồng nghĩa với ấn submit của Form và Form sẽ gọi hàm onFinish (vì đã gán form={form})
                onCancel={() => setOpenCreateModal(false)}
                okText="Create"
                confirmLoading={isCreate}
            >
                <Divider />
                <Form
                    form={form} // Gán cả Form với attribute là form vào biến {form}
                    name="create-user"
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


                </Form>
            </Modal>
        </>
    )
}


export default UserCreateModal