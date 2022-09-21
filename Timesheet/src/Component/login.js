import { Card, Input, Form, message, Space, Menu } from 'antd';
import Button from "antd-button-color";
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import { useState, React } from 'react';
import Dashboard from './HRportal/Dashboard/Dashboard';


const Login = () => {
    const navigate = useNavigate();

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

    const onFinish = async (e) => {
        debugger;
        await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Account/Login',
            data: e
        }).then((r) => {
            sessionStorage.setItem("token", r.data.token);
            sessionStorage.setItem("mailId", e.username);
            sessionStorage.setItem("id", r.data.employee_Id);
            sessionStorage.setItem("joining_date", r.data.joining_date);
            settoken(r.data.token);
            setMessage(r.request.status, e.username + " Login Successfull");
            AddProjectForm.resetFields();
            if (r.data.role_Id == 1) {
                navigate('/dashboard');
            }
            else if (r.data.role_Id == 2) {
                navigate('/Edashboard');
            }
            else {
                message.error("You are not allowed to Login");
            }
        }).catch((error) => {
            setMessage(error.response.status);
            AddProjectForm.resetFields();
        })
    }

    return (

        <>
            {/* <Card className='login' > */}
            <div style={{ marginLeft: 430, padding: 10, backgroundColor: "white", borderRadius: 15, boxShadow: "0 0 40px rgba(0,0,0,16)", marginTop: 50 }}>
                <h1 style={{ color: "blue", fontSize: 35 }}>TIMESHEET AUTOMATION</h1>
                {/* <Button type="lightdark" style={{ width: 200, height: 50, marginLeft: 100 }}><Link to="dashboard"><b>HR Portal</b></Link></Button><br /><br />
                    <Button type="lightdark" style={{ width: 200, height: 50, marginLeft: 100 }}><Link to="/Siders"><b>Employee Portal</b></Link></Button> */}
                <h1 style={{ marginLeft: 150, fontSize: 25 }}><b>LOGIN PAGE</b></h1>
                <Form
                    {...formItemLayout}
                    onFinish={onFinish}
                    form={AddProjectForm}
                >
                    <h1><b>USERNAME</b></h1>
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
                    <h1><b>PASSWORD</b></h1>
                    <Form.Item name="password" rules={[
                        {
                            required: true,
                            message: 'Please input your Password!'
                        },
                    ]}>
                        <Input.Password type="password" style={{ width: 450 }} />
                    </Form.Item><br />
                    <p>Change password?<span style={{ marginLeft: 5 }}><Link to="/resetPassword"><b><u>click here..</u></b></Link></span></p><br />
                    {/* <Link>click here..</Link> */}
                    <Form.Item>
                        <Space>
                            <Button type="danger" style={{ marginLeft: 150 }}>Cancel</Button>
                            <Button type="success" htmlType="submit" style={{ marginLeft: 10 }}>Submit</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            {/* </Card> */}



        </>
    )
}

export default Login;