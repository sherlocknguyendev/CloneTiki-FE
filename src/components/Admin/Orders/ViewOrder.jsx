

import { Col, Divider, InputNumber, Row, Empty, Steps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { doDeleteBookAction, doUpdateCartAction } from '../../../redux/order/orderSlice';
import './ViewOrder.scss';
import Payment from './Payment';

const ViewOrder = ({ setCurrentStep, setTotal }) => {

    const carts = useSelector(state => state.order.carts)
    const dispatch = useDispatch()


    const handleOnchangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, _id: book._id, detail: book }))
        }
    }

    const handleDeleteBook = (book) => {
        if (book) {
            dispatch(doDeleteBookAction({ _id: book._id, detail: book }))
        }
    }

    const handleStep1 = (bookList, total) => {
        if (bookList <= 0) return;
        setCurrentStep(1)
        setTotal(total)
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 12px" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
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
                                            <InputNumber onChange={(value) => handleOnchangeInput(value, product)} value={product?.quantity} />
                                        </div>
                                        <div className='sum'>
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((product?.detail?.price) * (product?.quantity))}
                                        </div>
                                        <DeleteOutlined className='delete-book' onClick={() => handleDeleteBook(product)} />
                                    </div>
                                </div>
                            )
                        })}
                        {!carts.length > 0 && <Empty description={<>Không có sản phẩm trong giỏ hàng</>} />}
                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>Tạm tính</span>
                                <span className='number-right'>
                                    {carts && carts.length > 0
                                        ?
                                        <>
                                            <span>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(carts.reduce((accum, current) => {
                                                    return accum + (current.quantity * current?.detail?.price)
                                                }, 0))}

                                            </span>
                                            <span> + 40.000đ phí giao hàng</span>
                                        </>
                                        :
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</span>
                                    }
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span>Tổng tiền</span>
                                <span className='sum-final'>
                                    {carts && carts.length > 0
                                        ?
                                        <>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(carts.reduce((accum, current) => {
                                                return accum + (current.quantity * current?.detail?.price)
                                            }, 0) + 40000)}
                                        </>
                                        :
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</span>
                                    }

                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button onClick={() => handleStep1(carts.length, new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(carts.reduce((accum, current) => {
                                return accum + (current.quantity * current?.detail?.price)
                            }, 0) + 40000))}>
                                Mua Hàng ({carts.length})
                            </button>

                        </div>
                    </Col>
                </Row>
            </div>



        </div >
    )
}

export default ViewOrder;