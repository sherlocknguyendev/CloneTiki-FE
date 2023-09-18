
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Table, notification } from 'antd';
import { useState } from 'react';

import * as XLSX from 'xlsx'; // thư viện xlsx để đọc dữ liệu dạng sheet

import { callCreateBulkUser } from '../../../../service/api';
import templateFile from './templateFile.xlsx?url' // Thêm ?url để Vite hiểu là file đọc đc -> để có thể truy cập đc

const { Dragger } = Upload;

const UserImport = ({ openImportModal, setOpenImportModal, fetchUser }) => {

    const [dataExcel, setDataExcel] = useState('')

    // Tạo fake 1 request
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok') // Dùng tham số onSuccess để báo cho thư viện biết là upload thành công -> Để hiện ra UI, và để chạy vào status = 'done' trong onChange
        }, 1000)
    }

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        accept: ".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",

        customRequest: dummyRequest, // Custom để k cần phải upload file (action) với Component Upload  


        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') { // Chỉ vào status = 'done' khi onSuccess đc chạy vào
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file); // -> data (file) sẽ trở thành 1 array buffer
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result); // Biến thành array

                        const workbook = XLSX.read(data, { type: 'array' }); // Đọc dữ liệu từ bảng tính (sheet)

                        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Lấy sheet đầu tiên trong bảng tính

                        const json = XLSX.utils.sheet_to_json(sheet, { // covert excel file to json
                            header: ['fullName', 'email', 'phone'],
                            range: 1 // skip header row
                        });

                        if (json && json.length > 0) setDataExcel(json)
                    }
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {

        const fixData = [];
        // Vì đã lưu biến dataExcel ở state của React nên k cần truyền từ tham số vào
        dataExcel.map(data => {
            data['password'] = '123456'
            fixData.push(data)
            return fixData
        })
        // Nếu trùng email thì k đc thêm đc nữa do config phía BE 
        const res = await callCreateBulkUser(fixData);
        if (res) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: 'Upload Success!',

            })
            setDataExcel([])
            setOpenImportModal(false);
            fetchUser()
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in ImportModal',
                duration: 3
            })
            setOpenImportModal(false);
        }
    }

    return (
        <>
            <Modal
                title="Upload Data User"
                width={"50vw"}
                open={openImportModal}
                onOk={handleImport}
                onCancel={() => {
                    setOpenImportModal(false)
                    setDataExcel([])
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataExcel.length < 1
                }}


                maskClosable={false} // Tránh ấn ra bên ngoài Modal mà tự động đóng
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single. Only accept .csv, .xls, .xlsx, . or
                        &nbsp;
                        <a onClick={e => e.stopPropagation()} href={templateFile} download>
                            Download Template File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 10 }}>
                    <Table
                        title={() => <span>Dữ liệu upload:</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                        dataSource={dataExcel}
                    />
                </div>
            </Modal>
        </>
    )
}

export default UserImport