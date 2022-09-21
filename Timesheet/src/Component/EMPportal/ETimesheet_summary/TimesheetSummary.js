import "antd/dist/antd.css";
import React, { Component } from 'react';
import { useState } from "react";
import { Table, Tag, Layout, Space,Button,Popover } from "antd";
import axios from 'axios';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import Sidersbar from "../ESidebar";
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


function TimesheetSummary() {
  const navigate = useNavigate();
  const navig = () => {
      navigate("/#");
  }

  const { Sider } = Layout;
  const [selected, setSelected] = useState('');
  const [dataSource, setdataSource] = useState([]);
   useEffect(() => {axios("https://timesheetjy.azurewebsites.net/api/Employee/GetAllTimeSheet_Summary?Employee_Id=78&year=2022").then((data) => setdataSource(data.data))}, []);

  const columns = [
    {
      title: 'COL_Id',
      render: (COL_ID, title, index) => `${index + 1}`,
    },
    {
      title: 'Timesheet Month',
      dataIndex: 'month'
    },
    {
      title: 'No of days worked',
      dataIndex: 'noOfdays_Worked'
    },
    {
      title: 'No of leaves',
      dataIndex: 'noOfLeave_Taken'

    },
    {
      title: 'Total Duration',
      dataIndex: 'total_Working_Hours'

    },
    {
      title: 'Uploaded Timesheet',
      render: () => (<Link state={{

      }} to="/Viewtimesheet">View Timesheet</Link>)
    },
    {
      title: 'Uploaded image',
      render: () => (<Link state={{

      }} to="/Uploadedimage">View</Link>)
    },
    {
      title: 'Year',
      dataIndex: 'year'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (tag) => {
        // const color = tag.includes('complete') ? 'Green' : tag.includes('pending') ? 'Blue' : 'Red'
        // return <Tag color={color} key={tag}>{tag}</Tag>
        const color = tag.toLowerCase() === 'approved' ? 'green' : tag.toLowerCase() === 'pending' ? 'blue' : 'red'

        return <Tag color={color} key={tag}>{tag}</Tag>
      }
    },
  ]

  return (
    <Space direction="horizantal">
       <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue",  marginTop: -100 }}>
                <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
                    <Link to="/EDashboard">Dashboard</Link>
                </Button><br /><br /><Button  type="primary"  style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Etimesheetsummary">Timesheet summary</Link>
                </Button><br /><br /><Button   style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Eaddtimesheet">Timesheet</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Ehrinfo">HR contact info</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Euserprofile">User Profile</Link>
                </Button><br /><br />
            </Sider>
            <div style={{marginLeft:"90%",marginTop: "1%",position:"fixed"}}>
            <Popover position="top" content='Logout'>
                <button style={{ width: '5em', backgroundColor: '#f77c7c' }}>
                    <LogoutOutlined onClick={navig} />
                </button>
            </Popover>
            </div>
      
      <div style={{  marginTop:"100px",marginLeft:200}} className="App">
      
        <h1 style={{ color: 'Blue' }}> TIMESHEET  SUMMARY</h1>
       
        <header className="App-header">
          
       
          {/* <button onClick={onAdd}>add</button> */}

          <Table style={{ marginLeft: "50px" }}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowSelection={false}
            
          />
          
        </header>
       
      </div>
      
    </Space>
  );

}
export default TimesheetSummary;
