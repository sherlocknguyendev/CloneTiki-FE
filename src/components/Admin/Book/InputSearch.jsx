

import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';



const InputSearch = (props) => {

    const { token } = theme.useToken(); // Chứa các mã (key) để CSS
    const [form] = Form.useForm(); // Sử dụng form có sẵn -> Gồm các phương thức để thao tác với form



    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        const { mainText, category, author } = values
        let query = '';
        if (mainText) {
            query += `&mainText=/${mainText}/i`
        }
        if (category) {
            query += `&category=/${category}/i`
        }
        if (author) {
            query += `&author=/${author}/i`
        }
        if (query) {
            props.handleSearch(query)
        }

    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={'mainText'}
                        label={`Book's name`}
                    >
                        <Input placeholder="placeholder" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={'category'}
                        label={`Category`}
                    >
                        <Input placeholder="placeholder" />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={'author'}
                        label={`Author`}
                    >
                        <Input placeholder="placeholder" />
                    </Form.Item>
                </Col>

            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 0 0 8px' }}
                        onClick={() => {
                            form.resetFields();
                        }}
                    >
                        Clear
                    </Button>

                </Col>
            </Row>
        </Form>
    );
};

// https://stackblitz.com/run?file=demo.tsx
// https://ant.design/components/form
export default InputSearch