

import { FilterTwoTone, KeyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import './Home.scss';
import { callFetchListBook, callFetchCategory } from '../../service/api';

const Home = () => {

    const [searchTerm, setSearchTerm] = useOutletContext()

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-sold");

    const [listCategory, setListCategory] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm();

    const navigate = useNavigate()



    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>

        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>

        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>

        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>

        },
    ];


    const onChangeItems = (value) => {
        setSortQuery(value)
    }


    useEffect(() => {
        fetchBookHome();
    }, [current, pageSize, filter, sortQuery, searchTerm])


    const fetchBookHome = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`
        }
        const res = await callFetchListBook(query);
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)
    }


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


    const handleChangeFilter = (changedValues, values) => {
        // console.log(">>> check handleChangeFilter", changedValues, values)
        // -> changedValues: là giá trị mình thay đổi; values: là giá trị trên cả form

        // Chỉ chạy khi category thay đổi
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`) // Phải build như này thì BE mới hiểu là $in (theo 1 mảng) và cs thể gọi đc từ MongoDB (Ở BE sử dụng package api-query-param)
            } else {
                setFilter('')
            }
        }
    }


    const handleOnChangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

    };


    const onFinish = (values) => {
        // console.log('check values: ', values);

        if (values?.range?.from > 0 && values.range.to > 0) {
            let f = `price>=${values?.range.from}&price<=${values.range.to}`;
            // Viết ">=" ở phía FE, còn phía BE nó sẽ tự dịch thành '$gte' để quy vấn tham số ở MongoDB (vì sd package api-query-params)
            if (values?.category?.length) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`
            }
            setFilter(f)

        }
    }



    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }


    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }


    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} style={{ padding: '16px', borderRight: '1px solid #999' }}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <span className='filter'> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined className='reset' title="Reset" onClick={() => {
                            form.resetFields();
                            setSearchTerm('');
                            setFilter('');
                        }} />
                    </div>
                    <Form
                        isLoading={isLoading}
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                            style={{
                                textAlign: 'left'
                            }}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {listCategory.map((category, index) => {
                                        return (
                                            <Col key={index} span={24} style={{ padding: '4px 0' }}>
                                                <Checkbox value={category.value} >
                                                    {category.label}
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>

                <Col md={20} xs={24} >
                    <Spin spinning={isLoading} tip='Loading...'>
                        <Row>
                            <Tabs defaultActiveKey='sort=-sold' items={items} onChange={onChangeItems} />
                        </Row>
                        <Row className='customize-row'>
                            {listBook.map((book, index) => (
                                <div key={index} className="column" onClick={() => handleRedirectBook(book)}>
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`} alt="thumbnail book" />
                                        </div>
                                        <div className='text'>{book.mainText}</div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                                        </div>
                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                            <span style={{ fontSize: '16px' }}>Đã bán {book.sold}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {listBook.length <= 0 && <Empty style={{ width: '100%', height: "300px", padding: '80px 0' }} description={<>Không tìm thấy sản phẩm</>} />}

                        </Row>
                        <Divider />
                        <Row style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                            {listBook.length > 0 &&
                                <Pagination
                                    onChange={(c, pS) => handleOnChangePage({ current: c, pageSize: pS })}
                                    current={current}
                                    pageSize={pageSize}
                                    total={total}
                                    showSizeChanger={true}
                                    responsive
                                />}
                        </Row>
                    </Spin>
                </Col>
            </Row>
        </div>
    )
}

export default Home;