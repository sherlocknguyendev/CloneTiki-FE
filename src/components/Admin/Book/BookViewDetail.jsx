
import React, { useEffect, useState } from 'react';
import { Descriptions, Drawer, Badge, Modal, Upload, Divider } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment/moment";
import { v4 as uuidv4 } from 'uuid';


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const BookViewDetail = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }) => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([])


    useEffect(() => {
        uploadFileList()
    }, [dataViewDetail])

    const uploadFileList = () => {

        if (dataViewDetail) {
            let imgThumbnail = {}, imgSlider = [];

            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail?.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.thumbnail}`,
                }
            }

            if (dataViewDetail && dataViewDetail.slider && dataViewDetail.slider.length > 0) {

                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })

            }
            setFileList([imgThumbnail, ...imgSlider])
        }

    }


    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);


    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer
                title="View Detail Book"
                placement='right'
                width={'50vw'}
                onClose={onClose}
                open={openViewDetail}

            >
                <Descriptions column={2}>
                    <Descriptions.Item label="Tên sách" span={2}>{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại">{dataViewDetail?.category}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá thành">{dataViewDetail?.price}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Đã bán">{dataViewDetail?.sold}</Descriptions.Item>


                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>


                </Descriptions>
                <Divider orientation='left'>Ảnh Sách</Divider>
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>

        </>
    )
}

export default BookViewDetail
