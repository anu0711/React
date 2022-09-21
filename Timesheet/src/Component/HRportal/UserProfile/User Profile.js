import React, { useEffect, useState } from "react";
import { Row, Col, Card, Space, Button, Layout, Popover } from "antd";
import axios from "axios";
import { Link, useSearchParams } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const Userprofile = () => {
  const { Sider, Content } = Layout;
  const [searchparams] = useSearchParams();
  const toke = sessionStorage.getItem("token");
  const mail = sessionStorage.getItem("mailId");
  const navigate = useNavigate();
  const navig = () => {
    navigate("/#");
  }
  const [users, setUsers] = useState([]);

  useEffect(() => {
    debugger;
    axios.get(`https://timesheetjy.azurewebsites.net/api/Admin/GetUserProfile?mail_Id=${mail}`, {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
      .then(data => {
        setUsers(data.data)

      })
  }, [])

  
  return (
    <div style={{ backgroundColor: "white", marginTop: -30 }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue",  marginTop: -100, }}>
        <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button><br /><br />
      </Sider>
      <div style={{ width: 750, height: 600, marginLeft: 250, marginTop: 30, backgroundColor: "white" }}>
        <div style={{ marginLeft: 200, marginTop: 30 }}>
        <div style={{marginTop:"1%",marginLeft:"60%",position:"fixed"}}>
            <Popover position="top" content='Logout'>
              <button style={{ width: '5em', backgroundColor: '#f77c7c' }}>
                    <LogoutOutlined onClick={navig} />
                </button>
            </Popover>
            </div>
          <h1>{users.map(user => (
            <h1 style={{ color: "blue", fontSize: 60, marginLeft: -50 }}>{user.name}</h1>
          ))}</h1>

          <Row>
            <Space>
              <form style={{ paddingLeft: '10%', marginLeft: 50 }}>
                <table>
                  <tbody>
                    <div style={{ marginLeft: -100, marginTop: -5, fontSize: 20, position: "fixed" }}>
                      <tr><b>HR Contact Id</b><b style={{ marginLeft: 44 }}>:</b></tr><br />
                      <tr><b>Name</b><b style={{ marginLeft: 108 }}>:</b></tr><br />
                      <tr><b>Designation</b><b style={{ marginLeft: 50 }}>:</b></tr><br />
                      <tr><b>Joining Date</b><b style={{ marginLeft: 43 }}>:</b></tr><br />
                      <tr><b>Email</b><b style={{ marginLeft: 110 }}>:</b></tr><br />
                      <tr><b>Contact No</b><b style={{ marginLeft: 55 }}>:</b></tr><br />
                    </div>
                  </tbody>
                  <tbody>
                    {users.map((user) => (
                      <>
                        <div style={{ marginLeft: 110, marginTop: -4, fontSize: 20, position: "fixed" }}>
                          <tr style={{ padding: '5%', marginLeft: '-20px' }}>
                            <b>{user.hr_Contact_Id}</b>
                          </tr><br />
                          <tr>
                            <b>{user.name}</b>
                          </tr><br />
                          <tr>
                            <b>HR</b>
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
      </div>
    </div>
  );
};

export default Userprofile;