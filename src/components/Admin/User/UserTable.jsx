
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Space, Button, Popconfirm, message, notification } from 'antd';
import { PlusOutlined, ReloadOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';

import InputSearch from './InputSearch'
import './UserTable.scss'
import { callDeleteUser, callFetchListUser } from '../../../service/api';
import UserViewDetail from './UserViewDetail';
import UserCreateModal from './UserCreateModal';
import UserImport from './data/UserImport';
import * as XLSX from 'xlsx';
import { BsTrash3, BsPen } from 'react-icons/bs';
import UserEditModal from './UserEditModal';







const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1) // Trang thứ mấy
    const [pageSize, setPageSize] = useState(3) // Số lượng user trong 1 trang
    const [total, setTotal] = useState(0) // total: là tổng số lượng user -> nói cho table biết nó cần tạo ra bao nhiêu trang
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuey] = useState('');

    const [dataViewDetail, setDataViewDetail] = useState('')
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [openCreateModal, setOpenCreateModal] = useState(false)

    const [openImportModal, setOpenImportModal] = useState(false)

    const [openEditModal, setOpenEditModal] = useState(false)
    const [editData, setEditData] = useState([])




    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery])


    const fetchUser = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `${filter}`
        }
        if (sortQuery) {
            query += `${sortQuery}`
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result)
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
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true

        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true

        }, {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true

        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement='leftTop'
                            title={'Xác nhận xóa user'}
                            description={'Bạn có chắc chắn muốn xóa user này?'}
                            onConfirm={() => handleDeleteUser(record._id)}
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

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xóa người dùng thành công');
            fetchUser();
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
            setSortQuey(sorted) // sort ở đây theo trường createdAt ở DB
        }

    }



    const handleSearch = (query) => {
        setCurrent(1)
        setFilter(query)
    }

    const downloadCSV = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
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
                <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '20px' }}>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ImportOutlined />}
                        type='primary'
                        onClick={() => setOpenImportModal(true)}
                    >
                        Import
                    </Button>
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
                        setSortQuey('');
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
                        className='user-table'
                        rowKey='_id'
                        columns={columns}
                        dataSource={listUser}

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

            <UserEditModal
                openEditModal={openEditModal}
                setOpenEditModal={setOpenEditModal}
                editData={editData}
                fetchUser={fetchUser}
            />

            <UserCreateModal
                openCreateModal={openCreateModal}
                setOpenCreateModal={setOpenCreateModal}

            />

            <UserImport
                openImportModal={openImportModal}
                setOpenImportModal={setOpenImportModal}
                fetchUser={fetchUser}
            />

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

        </>

    )


}

export default UserTable