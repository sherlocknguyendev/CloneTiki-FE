
import { Col, Divider, InputNumber, Row, Empty, Steps, Button, Result } from 'antd';
import { useState } from 'react';

import './order.scss';
import ViewOrder from '../../components/Admin/Orders/ViewOrder';
import Payment from '../../components/Admin/Orders/Payment';
import { SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const OrdersPage = (props) => {

    const [currentStep, setCurrentStep] = useState(0)
    const [total, setTotal] = useState(0)


    return (
        <div style={{ background: '#efefef', padding: "20px 12px" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className='order-steps' style={{ marginBottom: '12px' }}>
                    <Steps
                        size="small"
                        current={currentStep}
                        status='finish'
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Hoàn thành',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <ViewOrder setCurrentStep={setCurrentStep} setTotal={setTotal} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} total={total} />
                }

                {currentStep === 2 &&
                    <Result
                        style={{ lineHeight: '24px' }}
                        icon={<SmileOutlined />}
                        title='Đặt hàng thành công!'
                        extra={<Button type='primary'><Link to='/history'>Xem lịch sử</Link></Button>}
                    />
                }

            </div>
        </div >
    )
}

export default OrdersPage;