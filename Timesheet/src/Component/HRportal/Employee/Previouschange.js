import { Card, Table, Layout, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { data } from 'jquery';
import ChangeHighlight from 'react-change-highlight';

const Previouschange = () => {
  const { Sider, Content } = Layout;
  const [dataPrevious, setDataPrevious] = useState([]);
  const [dataP1, setDataP1] = useState([]);
  const [dataP2, setDataP2] = useState([]);
  const location = useLocation();
  const hStyle = { color: 'red' };
  const toke = sessionStorage.getItem("token");

  const { id } = location.state;
  const { editEmployee_Name } = location.state;


  // const AuthStr = 'Bearer '.concat(toke);
  //   axios.get(`https://timesheetjy.azurewebsites.net/api/Admin/Getviewpreviouschanges?id=${parseInt(id)}`, { headers: { Authorization: `Bearer ${toke}` } })
  //      .then(data => {
  //       setDataPrevious(data.data);

  //   console.log(data.data.length);
  //   var len = data.data.length;

  //   setDataP1(data.data[len-2]);
  //   setDataP2(data.data[len-1]);
  //      })

  const AuthStr = 'Bearer '.concat(toke);

  axios.get(`https://timesheetjy.azurewebsites.net/api/Admin/Getviewpreviouschanges?id=${parseInt(id)}`, { headers: { Authorization: `Bearer ${toke}` } })

    .then(data => {
      setDataPrevious(data.data);

      console.log(data.data.length);
      var len = data.data.length;
      debugger
      setDataP1(data.data[len - 2]);
      setDataP2(data.data[len - 1]);
    })

    .catch((error) => {
      console.log('error ' + error);
      

    }
    );






  // useEffect(() => {
  //   console.log(id, location.state);
  //   debugger
  //   axios(`https://timesheetjy.azurewebsites.net/api/Admin/Getviewpreviouschanges?id=${parseInt(id)}`)
  //     .then((data) => {
  //       setDataPrevious(data.data);

  //       console.log(data.data.length);
  //       var len = data.data.length;

  //       setDataP1(data.data[len-2]);
  //       setDataP2(data.data[len-1]);

  //       debugger
  //       //console.log(data.data.length);
  //       console.log(dataP1);
  //       debugger
  //       console.log(dataP2);
  //       debugger

  //       // if (dataP1.employee_Type_Name === dataP2.employee_Type_Name) {
  //       //   console.log(dataP2.employee_Type_Name);
  //       // }else{

  //       //   debugger
  //       // }
  //     });

  // }, [])

  const columns = [
    {
      title: 'S.No',
      render: (colid, title, index) => `${index + 1}`,
      dataIndex: 'colid',
    },
    {
      key: '2',
      title: 'Change No',
      dataIndex: 'employee_Id'
    },
    {
      key: '3',
      title: 'Employee Name',
      dataIndex: 'employee_Name'
      // render:(dataPrevious,color) =>{
      //   if (dataP1.employee_Type_Name === dataP2.employee_Type_Name) {
      //     console.log(dataP2.employee_Type_Name);
      //   }else{
      //   return  (

      //  dataPrevious.employee_Type_Name
      //                                   )





      //   }
      // } 
    },
    {
      key: '4',
      title: 'Type',
      dataIndex: 'employee_Type_Name'
    },
    {
      key: '5',
      title: 'Joining Date',
      dataIndex: 'joining_Date'
    },
    {
      key: '6',
      title: 'End Date',
      dataIndex: 'modified_Date'
    },
    {
      key: '7',
      title: 'Designation',
      dataIndex: 'designation_Name'
    },
    {
      key: '8',
      title: 'Reporting Manager',
      dataIndex: 'reporting_Manager1'
    },
    {
      key: '9',
      title: 'Mail ID',
      dataIndex: 'email'
    },
    {
      key: '10',
      title: 'Contact NO',
      dataIndex: 'contact_No'
    }
  ];

  return ( 
    <div style={{ color: "white" }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue", marginTop: -100, }}>
        <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button><br /><br />
      </Sider>
      <Card style={{ marginLeft: 250 }}>
        <div ><ChangeHighlight>
          <h1  ref={React.createRef()} style={{ color: "blue", fontSize: 25 }}><span>{editEmployee_Name}</span>'s Previous Changes</h1></ChangeHighlight>
        </div>

        <Table columns={columns}
          dataSource={dataPrevious}
          bordered
          size="middle"
          className="table_border_antd"
        />
      </Card>
    </div>
  )
}
export default Previouschange;