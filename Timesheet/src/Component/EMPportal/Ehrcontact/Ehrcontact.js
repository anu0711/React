import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Button, Form, Modal, Col, Row, Table, message, Card, Layout, Popover } from "antd";
import { Link, } from "react-router-dom";
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const EHrInfo = () => {

    const { Sider } = Layout;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [filteredClient, setFilteredClient] = useState([]);
    const navigate = useNavigate();
    const navig = () => {
        navigate("/#");
    }
    const toke = sessionStorage.getItem("token");

    const clientdtl = async () => {
        const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HRcontactinfo", {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        })
        setFilteredClient(response.data);
    }
    useEffect(() => {
        clientdtl();
    }, []);


    const clientDtlColumns = [
        {
            title: 'COL_ID',
            render: (value, item, index) => (page - 1) * 8 + index + 1,
            dataIndex: 'colid',
        },
        {
            title: 'Name',
            dataIndex: 'hr_Name',
        },
        {
            title: 'Mail Id',
            dataIndex: 'hr_Email_Id',
        },
        {
            title: 'Contact No',
            dataIndex: 'hr_Contact_No',
        }

    ];


    return (
        <><Space direction="horizantal">
            <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue", marginLeft: 20, marginTop: -100 }}>
                <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
                    <Link to="/EDashboard">Dashboard</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Etimesheetsummary">Timesheet summary</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Eaddtimesheet">Timesheet</Link>
                </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Ehrinfo">HR contact info</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Euserprofile">User Profile</Link>
                </Button><br /><br />
            </Sider>
            <h1 style={{ position: "fixed", marginLeft: 300, color: "blue", marginTop: 40, fontSize: 35 }}
            ><b>HR Contact Info</b></h1>
           
            <Table

                style={{ position: "fixed", padding: 155, marginLeft: 150, marginTop: -20, width: '80vw', height: '20vh' }}
                columns={clientDtlColumns}
                dataSource={filteredClient}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize)
                    }
                }}
                size="middle"
                bordered
            />
            <div style={{marginLeft:"90%",position:"fixed"}}>
            <Popover position="top" content='Logout'>
                <button style={{ width: '3em', backgroundColor: '#f77c7c' }}>
                    <LogoutOutlined onClick={navig} />
                </button>
            </Popover>
            </div>
             
        </Space>
        
        </>

    )
};

export default EHrInfo;