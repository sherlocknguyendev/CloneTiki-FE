

import { Modal, Tabs } from "antd"
import ChangePassword from "./ChangePassword"
import UserInfor from "./UserInfor"







const ManageAccount = ({ isOpenManageModal, setIsOpenManageModal }) => {

    const items = [
        {
            key: 'infor',
            label: 'Cập nhật thông tin',
            children: <UserInfor setIsOpenManageModal={setIsOpenManageModal} />
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />
        }
    ]

    return (

        <Modal
            title={'Quản lý tài khoản'}
            open={isOpenManageModal}
            footer={null}
            onCancel={() => setIsOpenManageModal(false)}
            maskClosable={false}
            width={"60vw"}
        >
            <Tabs
                defaultActiveKey="infor"
                items={items}
            />
        </Modal>

    )
}

export default ManageAccount