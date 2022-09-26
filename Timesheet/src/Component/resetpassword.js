import { Card, Input, Form, message, Space } from 'antd';
import Button from "antd-button-color";
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {MDBInput}from 'mdb-react-ui-kit';
import './login.css';
import { useState, React } from 'react';
import Dashboard from './HRportal/Dashboard/Dashboard';
import Icon, { UserOutlined ,LockOutlined,EditOutlined } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
const ResetPassword = () => {
    const navigate = useNavigate();
    const navig = () => {
        navigate(-1);
        const timeout = setTimeout(() => {
            window.location.reload();
        }, 500);
        return () => clearTimeout(timeout);
    }

    const setMessage = (statusCode, responseMessage) => {
        debugger;
        if (statusCode == 200) {
            message.success(responseMessage, 5);
        }
        else if (statusCode == 404) {
            message.error("Error, URL Not Found");
        }
        else if (statusCode == 400) {
            message.error(responseMessage, 5);
        }
        else if (statusCode == 401) {
            message.error("You are not Registered", 5);
        }
        else {
            message.error(responseMessage);
        }
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const [token, settoken] = useState("");

    const [AddProjectForm] = Form.useForm();

    const navigateLogin = () => {
        navigate("");
    }

    const onFinish = async (e) => {
        debugger;
        await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Account/ChangePassword/Change-password',
            data: e
        }).then((r) => {
            sessionStorage.setItem("token", r.data.token);
            sessionStorage.setItem("mailId", e.username);
            sessionStorage.setItem("id", r.data.employee_Id)
            settoken(r.data.token);
            setMessage(r.request.status, e.username + " Password updated Successfull");
            AddProjectForm.resetFields();

            navigate('');

        }).catch((error) => {
            debugger;
            setMessage(error.response.status, error.response.data.message);
            debugger
            AddProjectForm.resetFields();
        })
    }

    return (
        <>
            <Card className='login'>
                <div style={{ marginLeft: 460, padding: 20,width:500,backgroundColor: "0,0,0,0.1", borderRadius: 15, boxShadow: "0 0 40px rgba(0,0,0,16)", marginTop: 15 }}>
                    {/* <h1 style={{ color: "blue", fontSize: 35 }}>TIME SHEET AUTOMATION</h1> */}
                    {/* <Button type="lightdark" style={{ width: 200, height: 50, marginLeft: 100 }}><Link to="dashboard"><b>HR Portal</b></Link></Button><br /><br />
                    <Button type="lightdark" style={{ width: 200, height: 50, marginLeft: 100 }}><Link to="/Siders"><b>Employee Portal</b></Link></Button> */}
                    <h1 style={{ marginLeft: 90, fontSize: 25, color: 'white',fontFamily:"LucidaConsole" }}><b>PASSWORD RESET PAGE</b></h1><br />
                    <Form
                        {...formItemLayout}
                        onFinish={onFinish}
                        form={AddProjectForm}
                    >
                        <h2 style={{color:"white",fontFamily:"LucidaConsole",marginLeft:150 }}><UserOutlined />-USERNAME</h2>
                        <Form.Item name="username" rules={[
                            {
                                required: true,
                                message: 'Please input your User Name!'
                            },
                            // {
                            //     pattern: new RegExp(/^[a-zA-Z0-9 ]+$/i),
                            //     message: 'field accept only letters'
                            // }
                        ]}>
                            <Input style={{ width: 450 }} />
                        </Form.Item>
                        <h2 style={{color:"white",fontFamily:"LucidaConsole",marginLeft:150  }}><LockOutlined>-</LockOutlined><label style={{fontSize:'123%'}}>-PASSWORD</label></h2>
                        <Form.Item name="password" rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            },
                        ]}>
                            <Input type="password" style={{ width: 450 }} />
                        </Form.Item>
                        
                        <h2 style={{color:"white",fontFamily:"LucidaConsole",marginLeft:130  }}><EditOutlined />-NEW PASSWORD</h2>
                        <Form.Item name="newPassword" rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            },
                        ]}>
                            <Input type="password" style={{ width: 450 }} />
                            
                        </Form.Item>

                        <h2 style={{color:"white",fontFamily:"LucidaConsole",marginLeft:120  }}><EditOutlined />-CONFIRM PASSWORD</h2>
                        <Form.Item name="confrimNewPassword" rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            },
                        ]}>
                            <Input type="password" style={{ width: 450 }} />
                        </Form.Item><br />

                        <Form.Item>
                            <Space>
                                <Button type="danger" htmlType="button" onClick={() => navig()} style={{ marginLeft: 150 }}>Cancel</Button>
                                <Button type="success" htmlType="submit" style={{ marginLeft: 10 }}>Submit</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </>
    )
}

export default ResetPassword;