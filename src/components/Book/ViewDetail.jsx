import { Row, Col, Rate, Divider, Button } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';

import './book.scss';
import ModalGallery from './ModalGallery';
import BookLoading from './BookLoading';
import { doAddBookAction } from '../../redux/order/orderSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const ViewDetail = (props) => {

    const { dataBook } = props;

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [currentQuantity, setCurrentQuantity] = useState(1)

    const refGallery = useRef(null);

    const dispatch = useDispatch()

    const navigate = useNavigate()




    const images = dataBook?.items ?? []

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }


    const onChange = (value) => {
        console.log('changed', value);
    };


    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1)
        }
    }


    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }


    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, _id: book._id, detail: book }))
    }


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook._id ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <div className='author'>Tác giả: <a href='#'>{dataBook.author}</a> </div>
                                <div className='title'>{dataBook.mainText}</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        {dataBook.sold} đã bán
                                    </span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left-side'>Vận chuyển</span>
                                        <span className='right-side'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left-side'>Số lượng</span>
                                    <span className='right-side'>
                                        <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                        <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                        <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart' onClick={() => handleAddToCart(currentQuantity, dataBook)}>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button onClick={() => navigate('/order')} className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Row>
                        :
                        <BookLoading />
                    }
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook.mainText}
            />
        </div >
    )
}

export default ViewDetail;