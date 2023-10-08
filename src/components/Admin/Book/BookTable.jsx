
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Space, Button, Popconfirm, message, notification } from 'antd';
import { PlusOutlined, ReloadOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { BsTrash3, BsPen } from 'react-icons/bs';

import InputSearch from './InputSearch'
import './BookTable.scss'
import { callDeleteBook, callFetchListBook } from '../../../service/api';
import BookViewDetail from './BookViewDetail';
import BookCreateModal from './BookCreateModal';
import BookEditModal from './BookEditModal';







const BookTable = () => {

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1) // Trang thứ mấy
    const [pageSize, setPageSize] = useState(3) // Số lượng book trong 1 trang
    const [total, setTotal] = useState(0) // total: là tổng số lượng book -> nói cho table biết nó cần tạo ra bao nhiêu trang
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('');

    const [dataViewDetail, setDataViewDetail] = useState('')
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [openCreateModal, setOpenCreateModal] = useState(false)


    const [openEditModal, setOpenEditModal] = useState(false)
    const [editData, setEditData] = useState([])




    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery])


    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `${filter}`
        }
        if (sortQuery) {
            query += `${sortQuery}`
        }
        const res = await callFetchListBook(query);
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)

    }


    const columns = [
        {
            title: 'ID',
            dataIndex: '_id', // Trường này để map với database -> để biết lấy dữ liệu của thằng nào
            sorter: true,
            render: (text, record, index) => { // Bình thường là text, muốn modify nó thì dùng render
                return (
                    <a href='#'
                        onClick={() => {
                            setDataViewDetail(record)
                            setOpenViewDetail(true)
                        }}
                    >
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true

        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true

        }, {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true

        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true

        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            width: 200,


        },
        {
            title: 'Action',
            width: 120,
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement='leftTop'
                            title={'Xác nhận xóa book'}
                            description={'Bạn có chắc chắn muốn xóa book này?'}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText='Xác nhận'
                            cancelText='Hủy'
                        >

                            <span className='btn-delete'>
                                <BsTrash3 />
                            </span>

                        </Popconfirm>

                        <span
                            onClick={() => { setOpenEditModal(true); setEditData(record) }}
                            className='btn-edit'>
                            <BsPen />
                        </span>
                    </>
                )
            }

        },
    ];

    const handleDeleteBook = async (bookId) => {
        const res = await callDeleteBook(bookId);
        if (res && res.data) {
            message.success('Xóa sách thành công');
            fetchBook();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }
    }


    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.field) {
            const sorted = sorter.order === 'ascend' ? `&sort=${sorter.field}` : `&sort=-${sorter.field}`
            setSortQuery(sorted) // sort ở đây theo trường createdAt ở DB
        }


    }



    const handleSearch = (query) => {
        setCurrent(1)
        setFilter(query)
    }


    const downloadCSV = () => {
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
            //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(workbook, "DataExport.csv");
        }

    }


    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '20px' }}>Table List Books</span>
                <span style={{ display: 'flex', gap: 15 }}>

                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                        onClick={downloadCSV}
                    >
                        Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type='primary'
                        onClick={() => setOpenCreateModal(true)}
                    >
                        Add new
                    </Button>
                    <Button type='ghost' onClick={() => {
                        setFilter('');
                        setSortQuery('');
                    }}>
                        <ReloadOutlined />
                    </Button>

                </span>

            </div>
        )
    }




    return (
        <>

            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                    />
                </Col>

                <Col span={24}>
                    <Table
                        title={renderHeader}
                        className='book-table'
                        rowKey='_id'
                        columns={columns}
                        dataSource={listBook}

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

            <BookEditModal
                openEditModal={openEditModal}
                setOpenEditModal={setOpenEditModal}
                editData={editData}
                fetchBook={fetchBook}
            />

            <BookCreateModal
                openCreateModal={openCreateModal}
                setOpenCreateModal={setOpenCreateModal}
                fetchBook={fetchBook}

            />


            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

        </>

    )


}

export default BookTable