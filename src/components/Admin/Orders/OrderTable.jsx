

import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
import { callFetchListOrder } from '../../../service/api';
import { BsPen, BsTrash3 } from 'react-icons/bs';



const OrderTable = () => {

    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1) // Trang thứ mấy
    const [pageSize, setPageSize] = useState(3) // Số lượng user trong 1 trang
    const [total, setTotal] = useState(0) // total: là tổng số lượng user -> nói cho table biết nó cần tạo ra bao nhiêu trang
    const [isLoading, setIsLoading] = useState(false)



    useEffect(() => {
        fetchOrder();
    }, [current, pageSize])


    const fetchOrder = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        const res = await callFetchListOrder(query);
        if (res && res.data) {
            setListOrder(res.data.result)
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)

    }


    const columns = [
        {
            title: 'ID',
            dataIndex: '_id', // Trường này để map với database -> để biết lấy dữ liệu của thằng nào
        },
        {
            title: 'Tên người mua',
            dataIndex: 'name',

        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',

        }, {
            title: 'Số điện thoại',
            dataIndex: 'phone',

        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',

        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',

        },
        {
            title: 'Action',
            width: 120,
            render: (text, record, index) => {
                return (
                    <>
                        <span className='btn-delete'>
                            <BsTrash3 />
                        </span>

                        <span
                            className='btn-edit'>
                            <BsPen />
                        </span>
                    </>
                )
            }

        },
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }


    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '20px' }}>Table List Orders</span>
                <span style={{ display: 'flex', gap: 15 }}></span>
            </div>
        )
    }


    return (
        <>

            <Row gutter={[20, 20]}>

                <Col span={24}>
                    <Table
                        title={renderHeader}
                        className='order-table'
                        rowKey='_id'
                        columns={columns}
                        dataSource={listOrder}
                        onChange={onChange}
                        isLoading={isLoading}
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                showTotal: (total, range) => {
                                    return (
                                        <div>{range[0]} - {range[1]} on {total} rows</div>
                                    )
                                }
                            }
                        }
                    />
                </Col>

            </Row>

        </>

    )


}

export default OrderTable