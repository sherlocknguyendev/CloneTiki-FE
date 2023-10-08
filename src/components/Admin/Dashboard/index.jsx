

import { Card, Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import CountUp from 'react-countup'
import { callFetchDashboard } from "../../../service/api"




const DashBoard = () => {

    const [dataDashboard, setDataDashboard] = useState({
        countUser: 0,
        countOrder: 0
    })

    useEffect(() => {
        const initDashboard = async () => {
            const res = await callFetchDashboard();
            if (res && res.data) {
                setDataDashboard(res.data)
            }
        }
        initDashboard();
    }, [])

    const formatter = (value) => <CountUp end={value} seperator="," />

    return (
        <>
            <Row gutter={[40, 40]}>
                <Col span={10}>
                    <Card title='' bordered={false}>
                        <Statistic
                            title='Tổng Users'
                            value={dataDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title='' bordered={false}>
                        <Statistic
                            title='Tổng Orders'
                            value={dataDashboard.countOrder}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default DashBoard