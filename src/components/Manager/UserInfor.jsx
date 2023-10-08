

import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Form, Input, Row, Upload, message, notification } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { callUpdateAvatar, callUpdateUserInfor } from "../../service/api"
import { doUpdateUserInforAction, doUploadAvatarAction } from "../../redux/account/accountSlice"



const UserInfor = ({ setIsOpenManageModal }) => {

    const user = useSelector(state => state.account.user)
    const dispatch = useDispatch()
    const [form] = useForm()
    const [isSubmit, setIsSubmit] = useState(false)
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.tempAvatar || user?.avatar}`


    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await callUpdateAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            dispatch(doUploadAvatarAction({ avatar: newAvatar }));
            setUserAvatar(newAvatar);
            onSuccess('ok');
        } else {
            onError("Đã có lỗi xảy ra khi upload file")
        }
    }


    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(infor) {
            if (infor.file.status !== 'uploading') {

            }
            if (infor.file.status === 'done') {
                message.success('Upload file thành công!')
            } else if (infor.file.status === 'error') {
                message.error('Upload file thất bại!')
            }
        }
    }


    const onFinish = async (values) => {
        const { fullName, phone, id } = values;


        setIsSubmit(true)
        const res = await callUpdateUserInfor(id, fullName, phone, userAvatar)

        if (res && res.data) {
            // update redux
            dispatch(doUpdateUserInforAction({ avatar: userAvatar, fullName, phone }))
            message.success('Cập nhật thông tin user thành công!')

            // force renew token
            localStorage.removeItem('access_token')
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    useEffect(() => {
        form.setFieldsValue(user)
    }, [])


    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                icon={<AntDesignOutlined />}
                                src={urlAvatar}
                                shape="circle"
                            />
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        form={form}
                        name="manage-account"
                        style={{
                            maxWidth: 800,
                            margin: '0 auto'
                        }}
                        initialValues={{
                            remember: true,
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
                            name="id"
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
                            label="Email"
                            name="email"

                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            labelCol={{
                                span: 24
                            }}
                            label="Tên tài khoản"
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your fullName!`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{
                                span: 24
                            }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your phone!`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                className='btn-manage-account'
                                htmlType="submit"
                                type="primary"
                                loading={isSubmit}
                            >

                                Cập nhật thông tin
                            </Button>

                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfor