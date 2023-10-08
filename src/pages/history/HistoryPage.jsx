
import { Table, notification, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view'

import { callFetchOrderHistory } from '../../service/api';

const HistoryPage = () => {

    const [orderHistory, setOrderHistory] = useState([])


    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => {
                return (
                    <span>{index + 1}</span>
                )
            },
            width: 100,


        },
        {
            title: 'Thời gian mua',
            dataIndex: 'createdAt',
            width: 200,

        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            width: 200,

        }, {
            title: 'Trạng thái',
            render: () => {
                return (
                    <Tag color="green">Thành công</Tag>
                )
            },
            width: 200,
        },
        {
            title: 'Chi tiết',
            render: (text, record, index) => {
                return (
                    <ReactJson src={record.detail}
                        name={'Chi tiết đơn mua'}
                        collapsed={true}
                        enableClipboard={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                    />
                )
            }

        },
    ];

    useEffect(() => {
        fetchOrderHistory();
    }, [])


    const fetchOrderHistory = async () => {
        const res = await callFetchOrderHistory()
        console.log(res);
        if (res && res.data) {
            setOrderHistory(res.data)
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '20px' }}>
                    Table Order History
                </span>
            </div>
        )
    }

    return (
        <>

            <Table
                style={{ padding: '0 12px' }}
                title={renderHeader}
                className='history-table'
                rowKey='_id'
                columns={columns}
                dataSource={orderHistory}
                pagination={false}

            />
        </>
    )
}

export default HistoryPage