


import { callEditUser } from '../../../service/api';
import { Button, Modal, Form, Input, message, notification, Divider, } from 'antd';
import { useEffect, useState } from 'react';

const UserEditModal = ({ openEditModal, setOpenEditModal, editData, fetchUser }) => {


    const [form] = Form.useForm()
    const [isEdit, setIsEdit] = useState(false)

    const onFinish = async (values) => {

        const { _id, fullName, phone } = values;
        setIsEdit(true);
        const res = await callEditUser(_id, fullName, phone);
        setIsEdit(false);
        if (res?.data) {
            message.success('Cập nhật người dùng thành công!');
            setOpenEditModal(false);
            await fetchUser()
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in Edit Modal',
                duration: 3
            })
            setOpenEditModal(false);
        }
    };

    useEffect(() => {
        form.setFieldsValue(editData)
    }, [editData])

    return (
        <>
            <Modal
                title="Edit user"
                open={openEditModal}
                onOk={() => { form.submit() }} //  Khi ấn submit của Modal đồng nghĩa với ấn submit của Form và Form sẽ gọi hàm onFinish (vì đã gán form={form})
                onCancel={() => setOpenEditModal(false)}
                okText="Edit user"
                confirmLoading={isEdit}
            >
                <Divider />


                <Form
                    form={form} // Gán cả Form với attribute là form vào biến {form}
                    name="edit-user"
                    style={{
                        maxWidth: 600,
                        margin: '0 auto'
                    }}

                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        labelCol={{
                            span: 24
                        }}
                        label="Id"
                        name="_id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your id!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
                        <Input disabled />
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

export default UserEditModal;