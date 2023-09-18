

import { Descriptions, Drawer, Badge } from "antd"
import moment from "moment/moment";


const UserViewDetail = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }) => {

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer
                title="View Detail User"
                placement='right'
                width={'50vw'}
                onClose={onClose}
                open={openViewDetail}

            >
                <Descriptions column={2}>
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Hiển Thị">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số Điện Thoại">{dataViewDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role" span={2}>
                        <Badge status='processing' text={dataViewDetail?.role}></Badge>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>


                </Descriptions>
            </Drawer>

        </>
    )
}

export default UserViewDetail
