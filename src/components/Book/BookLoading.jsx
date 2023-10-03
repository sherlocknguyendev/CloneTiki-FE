

import { Row, Col, Skeleton } from 'antd';

const BookLoading = () => {
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                    <Skeleton.Input
                        active={true}
                        block={true}
                        style={{ width: '100%', height: 350 }}
                    />
                    <div style={{ display: 'flex', gap: 20, marginTop: 20, overflow: 'hidden' }}>
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                    </div>
                </Col>
                <Col md={14} sm={24} xs={24}>
                    <Skeleton
                        paragraph={{ rows: 6 }}
                        active={true}
                    />
                    <br></br>
                    <div style={{ lineHeight: '12px', display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, overflow: 'hidden' }}>
                        <Skeleton.Button active={true} style={{ width: 100 }} />
                        <Skeleton.Button active={true} style={{ width: 100 }} />
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default BookLoading