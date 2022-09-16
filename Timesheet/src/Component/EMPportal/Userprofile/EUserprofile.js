import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import axios from "axios";
import { Row, Col, Card, Space, Layout, Button, Popover } from 'antd';
import { Link, } from "react-router-dom";
import { LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';



const EUserprofile = () => {
    const { Sider } = Layout;
    const [users, setUsers] = useState([]);
    const mail = sessionStorage.getItem("mailId");
    const navigate = useNavigate();
    const navig = () => {
        navigate("/#");
    }
    const toke = sessionStorage.getItem("token");

    useEffect(() => {
        axios(`https://timesheetjy.azurewebsites.net/api/Employee/GetUserProfile?mail_id=${mail}`, {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        })
            .then(data => setUsers(data.data))
    }, [])

    return (
        <><Space>
            <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue",  marginTop: -100 }}>
                <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
                    <Link to="/EDashboard">Dashboard</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Etimesheetsummary">Timesheet summary</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Eaddtimesheet">Timesheet</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Ehrinfo">HR contact info</Link>
                </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Euserprofile">User Profile</Link>
                </Button><br /><br />
            </Sider>
            <div style={{marginLeft:"90%",position:"fixed"}}>
            <Popover position="top" content='Logout'>
                    <button style={{ width: '5em', backgroundColor: '#f77c7c' }}>
                    <LogoutOutlined onClick={navig} />
                </button>
            </Popover>
            </div>
            <Card style={{ width: 630, height: 550, marginLeft: 270, marginTop: 20, position: "fixed" }}>
           
                <div style={{ marginLeft: 190, marginTop: 10, position: "fixed" }}>
                    <h1>{users.map(user => (
                        <h1 style={{ color: "blue", fontSize: 40, marginLeft: -50 }}>{user.employee_Name}</h1>
                    ))}</h1>

                    <Row>
                        <Space>
                            <form style={{ paddingLeft: '10%', marginLeft: 50 }}>
                                <table>
                                    <tbody>
                                        <div style={{ marginLeft: -100, marginTop: -5, fontSize: 20, position: "fixed" }}>
                                            <tr><b>Employee Id</b><b style={{ marginLeft: 51 }}>:</b></tr><br />
                                            <tr><b>Employee Name</b><b style={{ marginLeft: 14 }}>:</b></tr><br />
                                            <tr><b>Designation</b><b style={{ marginLeft: 52 }}>:</b></tr><br />
                                            <tr><b>Joining Date</b><b style={{ marginLeft: 47 }}>:</b></tr><br />
                                            <tr><b>Email</b><b style={{ marginLeft: 115 }}>:</b></tr><br />
                                            <tr><b>Mobile No</b><b style={{ marginLeft: 65 }}>:</b></tr><br />
                                        </div>
                                    </tbody>
                                    <tbody>
                                        {users.map((user) => (
                                            <>
                                                <div style={{ marginLeft: 110, marginTop: -4, fontSize: 20, position: "fixed" }}>
                                                    <tr style={{ padding: '5%', marginLeft: '-20px' }}>
                                                        <b>{user.employee_ID}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.employee_Name}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.designation}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.joining_Date}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.email}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.mobile_No}</b>
                                                    </tr><br />
                                                </div>
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                        </Space>
                    </Row>
                </div>
            </Card>
        </Space>
        </>
    );
};

export default EUserprofile;