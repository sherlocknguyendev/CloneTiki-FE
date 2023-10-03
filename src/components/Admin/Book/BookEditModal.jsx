

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Form, Input, message, notification, Divider, Upload, Row, Col, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { callEditBook, callFetchCategory, callUploadBookImg } from '../../../service/api';

const BookEditModal = ({ openEditModal, setOpenEditModal, editData, fetchBook }) => {

    const [form] = Form.useForm()
    const [isEdit, setIsEdit] = useState(false)
    const [listCategoryEdit, setListCategoryEdit] = useState([])

    const [loading, setLoading] = useState(false);
    const [dataThumbnail, setDataThumbnail] = useState([]);

    const [loadingSlider, setLoadingSlider] = useState(false);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewTitle, setPreviewTitle] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const [imageUrl, setImageUrl] = useState('');
    const [initForm, setInitForm] = useState(null)
    // const [editData, setEditData] = useState([])



    const onFinish = async (values) => {

        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Trường thumbnail đang để trống!'
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Trường slider đang để trống!'
            })
            return;
        }


        const { _id, mainText, category, author, price, quantity, sold } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name)

        setIsEdit(true);
        const res = await callEditBook(_id, mainText, category, author, price, quantity, sold, thumbnail, slider);
        setIsEdit(false);
        if (res && res.data) {
            message.success('Cập nhật book thành công!');
            form.resetFields()
            setDataSlider([]);
            setDataThumbnail([]);
            setInitForm(null);
            setOpenEditModal(false);
            await fetchBook()
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in Edit Book Modal ',
                duration: 3
            })
            setOpenEditModal(false);
        }
    };


    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };



    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload files')
        }
    }


    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            // Copy previous state => upload multiple images
            // Phải lấy đc state cũ xog rồi thêm state mới vào; nếu k lấy state cũ thì setDataSlider sẽ tự lấy thằng nào gọi sau cùng (nếu gọi nhiều lần)
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload files')
        }
    }


    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };


    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider)
        }
    }

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        })
    };


    const getBase64 = (img, callback) => { // Sử dụng base64 để hiển thị ảnh
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };



    useEffect(() => {

        if (editData?._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: editData?.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${editData?.thumbnail}`,
                }
            ]
            const arrSlider = editData?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })

            const init = {
                _id: editData._id,
                mainText: editData.mainText,
                author: editData.author,
                price: editData.price,
                category: editData.category,
                quantity: editData.quantity,
                sold: editData.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            }
            setInitForm(init);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider)
            form.setFieldsValue(init)

        }

        return () => {
            form.resetFields();
        }

    }, [editData])

    useEffect(() => {
        fetchListCategory()
    }, [])


    const fetchListCategory = async () => {
        const res = await callFetchCategory()
        if (res?.data) {
            const categories = res.data.map(item => {
                return (
                    { label: item, value: item }
                )
            })
            setListCategoryEdit(categories)
        }
    }


    return (
        <>
            <Modal
                title="Edit book"
                open={openEditModal}
                onOk={() => { form.submit() }} //  Khi ấn submit của Modal đồng nghĩa với ấn submit của Form và Form sẽ gọi hàm onFinish (vì đã gán form={form})
                onCancel={() => {
                    setOpenEditModal(false);
                    setInitForm(null);
                    form.resetFields();
                }}
                okText="Edit book"
                confirmLoading={isEdit}
            >
                <Divider />


                <Form
                    form={form} // Gán cả Form với attribute là form vào biến {form}
                    name="create-book"
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
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                hidden
                                labelCol={{
                                    span: 24
                                }}
                                label="Id"
                                name="_id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your id!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ padding: '0 4px 0 0' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Book's name"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: `Please input your book's name!`,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ padding: '0 0 0 4px' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Author"
                                name="author"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your author!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Price"
                                name="price"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your price!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    addonAfter="VND"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />

                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ padding: '0 4px 0 8px' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Category"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your category!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategoryEdit}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ padding: '0 8px 0 4px' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Quantity"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your quantity!',
                                    },
                                ]}
                            >

                                <InputNumber
                                    min={1}
                                    max={1000}
                                    style={{ width: '100%' }}
                                />

                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Sold"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your sold!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ padding: '0 4px 0 0' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Thumbnail Image"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}

                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}> Upload </div>
                                    </div>
                                </Upload>

                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ padding: '0 0 0 4px' }}>
                            <Form.Item
                                labelCol={{
                                    span: 24
                                }}
                                label="Slider Image"
                                name="slider"
                            >
                                <Upload
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    multiple
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemoveFile(file, 'slider')}
                                    onPreview={handlePreview}
                                    defaultFileList={initForm?.slider?.fileList ?? []} // Dùng fileList sẽ cố định list, còn defaultFileList thì có thể thay đổi
                                >

                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}> Upload </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form >
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>


        </>
    )
}

export default BookEditModal