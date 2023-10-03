

import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Form, Input, message, notification, Divider, Col, Row, Select, InputNumber, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { callCreateBook, callFetchCategory, callUploadBookImg } from '../../../service/api';


const BookCreateModal = ({ openCreateModal, setOpenCreateModal, fetchBook }) => {

    const [form] = Form.useForm() // Sử dụng giống useRef
    const [isCreate, setIsCreate] = useState(false)
    const [listCategory, setListCategory] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewTitle, setPreviewTitle] = useState(false)
    const [previewImage, setPreviewImage] = useState('')


    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataThumbnail, setDataThumbnail] = useState([]);

    const [loadingSlider, setLoadingSlider] = useState(false);
    const [dataSlider, setDataSlider] = useState([]);



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

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        console.log(file);
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

        const { mainText, category, author, price, quantity, sold } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name)

        setIsCreate(true);
        const res = await callCreateBook(mainText, category, author, price, quantity, sold, thumbnail, slider);
        setIsCreate(false);
        if (res?.data?._id) {
            message.success('Tạo mới sách thành công!');
            form.resetFields();
            setDataThumbnail([])
            setDataSlider([])
            setOpenCreateModal(false);
            await fetchBook()
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description:
                    res.message ? res.message : 'Error in CreateModal (Book)',
                duration: 3
            })
            form.resetFields();
            setOpenCreateModal(false);
        }
    };

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
            setListCategory(categories)
        }
    }



    return (
        <>
            <Modal
                forceRender
                title="Create a new book"
                open={openCreateModal}
                onOk={() => { form.submit() }} //  Khi ấn submit của Modal đồng nghĩa với ấn submit của Form và Form sẽ gọi hàm onFinish (vì đã gán form={form})
                onCancel={() => {
                    setOpenCreateModal(false)
                    form.resetFields();
                }
                }
                okText="Create"
                confirmLoading={isCreate}
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
                                    // onChange={handleChange}
                                    showSearch
                                    allowClear
                                    options={listCategory}
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
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
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
            </Modal >
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


export default BookCreateModal