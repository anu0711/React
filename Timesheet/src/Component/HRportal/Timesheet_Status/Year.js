import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { Table, Button, Layout,Popover } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {LogoutOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';


function Tb1() {
  const { Sider } = Layout;
  const toke = sessionStorage.getItem("token");
  const [dataSource, setdataSource] = useState([
  ]);
  useEffect(() => {
    axios("https://timesheetjy.azurewebsites.net/api/Admin/GetTimeSheets", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    }).then(data => setdataSource(data.data))
  }, []);
  const [year, setyear] = useState("2018");
  const navigate = useNavigate();

  const navig = () => {

      navigate("/#");

     }
  const columns = [
    {
      title: 'COL_ID',
      render: (COL_ID, title, index) => `${index + 1}`,
    },
    {
      title: 'Year',
      render: (data) => (<Link state={{ year: data.year }} to="/timesheet/month" >{data.year}</Link>)
    }
  ];
  return (
    <div>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue", marginLeft: 20, marginTop: -100,}}>
        <Button  style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20,marginLeft: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><br/><br/><Button style={{ margin: "5 10%", width: 160, height: 50,marginLeft: 20 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><br/><br/><Button  type="primary" style={{ margin: "5 10%", width: 160, height: 50 ,marginLeft: 20}}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><br/><br/><Button style={{ margin: "5 10%", width: 160, height: 50 ,marginLeft: 20}}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><br/><br/><Button style={{ margin: "5 10%", width: 160, height: 50 ,marginLeft: 20}}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button><br/><br/>
      </Sider>
      <Popover position="top" content='Logout'>
      <button style={{width:'5em',backgroundColor:'#f77c7c',marginLeft:'91%',marginTop:'2%'}}>
      <LogoutOutlined  onClick={navig}   />
      </button>
      </Popover>
      <div className="yertab">
        <h1 style={{ color: 'blue', fontSize: '40px', backgroundColor: "white", marginLeft: '400px', marginTop: '5%', position: "fixed" }}>TIMESHEET  STATUS</h1>
        <div>
          <Table style={{ margin: "0px 800px 900px 400px", marginTop: "10%", position: "fixed", width: '20%', height: '20%' }}
            pagefixed
            bordered
            pagination={false}
            rowKey={record => record.year}
            columns={columns}
            dataSource={dataSource}
          >
          </Table>
        </div>
      </div>
    </div>
  );
}
export default Tb1;
