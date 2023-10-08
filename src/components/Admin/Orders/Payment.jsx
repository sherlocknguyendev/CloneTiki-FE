


import { Col, Divider, InputNumber, Row, Empty, Steps, Form, Input, Button, message, Checkbox, Radio, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


import { doDeleteBookAction, doOrderBookAction, doUpdateCartAction } from '../../../redux/order/orderSlice';
import './Payment.scss';
import { callOrderBook } from '../../../service/api';

const Payment = ({ setCurrentStep, total }) => {

    const { TextArea } = Input;

    const carts = useSelector(state => state.order.carts)
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const user = useSelector(state => state.account.user)
    const [isLoading, setIsLoading] = useState(false)


    const onFinish = async (values) => {

        setIsLoading(true)

        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })

        const data = {
            name: values.fullName,
            phone: values.phone,
            address: values.address,
            totalPrice: parseInt(total),
            detail: detailOrder
        }

        const res = await callOrderBook(data)
        if (res && res.data) {
            message.success('Hoàn tất thủ tục!')
            dispatch(doOrderBookAction())
            setCurrentStep(2)
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsLoading(false)
    };

    useEffect(() => {
        form.setFieldsValue(user)
    }, [])

    return (
        <div style={{ background: '#efefef', padding: "20px 12px" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24}>
                        {carts?.map((product, index) => {
                            return (
                                <div className='order-book' key={index}>
                                    <div className='book-content'>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${product?.detail?.thumbnail}`} />
                                        <div className='title'>
                                            {product?.detail?.mainText}
                                        </div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.detail?.price)}
                                        </div>
                                    </div>
                                    <div className='action'>
                                        <div className='quantity'>
                                            <input type="text" value={product?.quantity} disabled style={{ width: '100px' }} />
                                        </div>
                                        <div className='sum'>
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((product?.detail?.price) * (product?.quantity))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {!carts.length > 0 && <Empty description={<>Không có sản phẩm trong giỏ hàng</>} />}
                    </Col>
                    <Col md={8} xs={24} >
                        <Form
                            form={form}
                            name="login"

                            style={{
                                maxWidth: 600,
                                margin: '0 auto',
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                padding: '12px'
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
                                label="Tên người mua"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your fullName!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{
                                    span: 24,
                                }}
                                label="Số điện thoại"
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
                                labelCol={{
                                    span: 24,
                                }}
                                label="Địa chỉ"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your address!',
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                style={{ textAlign: 'left' }}
                                labelCol={{
                                    span: 24,
                                }}
                                label="Hình thức thanh toán"
                                name="options"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your options!',
                                    },
                                ]}
                            >
                                <Radio checked /> Thanh toán khi nhận hàng
                            </Form.Item>

                            <Form.Item
                                style={{ textAlign: 'left' }}
                                labelCol={{
                                    span: 24,
                                }}
                                label="Tổng tiền"
                                name="total"

                            >
                                <Input style={{ fontSize: '20px', color: '#fe3834' }} disabled defaultValue={total} />


                            </Form.Item>


                            <Form.Item>
                                <Button
                                    className='btn-payment'
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Đặt hàng ({carts.length})
                                </Button>

                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default Payment;