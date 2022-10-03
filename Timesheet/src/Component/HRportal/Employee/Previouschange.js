import { Card, Table, Layout, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
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

  const highlightDesignation = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.designation_Name}</p>)
    }
    else if (dataPrevious[index - 1].designation_Name != record.designation_Name) {
      return (<p style={{ color: "red" }}>{record.designation_Name}</p>)
    } else {
      return (<p>{record.designation_Name}</p>)
    }
  }

  const highlightEmployeeName = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.employee_Name}</p>)
    }
    else if (dataPrevious[index - 1].employee_Name != record.employee_Name) {
      return (<p style={{ color: "red" }}>{record.employee_Name}</p>)
    } else {
      return (<p>{record.employee_Name}</p>)
    }
  }
  const highlightTypeName = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.employee_Type_Name}</p>)
    }
    else if (dataPrevious[index - 1].employee_Type_Name != record.employee_Type_Name) {
      return (<p style={{ color: "red" }}>{record.employee_Type_Name}</p>)
    } else {
      return (<p>{record.employee_Type_Name}</p>)
    }
  }
  const highlightJoiningData = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.joining_Date}</p>)
    }
    else if (dataPrevious[index - 1].joining_Date != record.joining_Date) {
      return (<p style={{ color: "red" }}>{record.joining_Date}</p>)
    } else {
      return (<p>{record.joining_Date}</p>)
    }
  }
  const highlightModifiedDate = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.modified_Date}</p>)
    }
    else if (dataPrevious[index - 1].modified_Date != record.modified_Date) {
      return (<p style={{ color: "red" }}>{record.modified_Date}</p>)
    } else {
      return (<p>{record.modified_Date}</p>)
      // moment(testDate).format('MM/DD/YYYY');
      // return (<p>{moment(record.modified_Date).format('MM/DD/YYYY')}</p>)

    }
  }
  const hightReportingManager = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.reporting_Manager1}</p>)
    }
    else if (dataPrevious[index - 1].reporting_Manager1 != record.reporting_Manager1) {
      return (<p style={{ color: "red" }}>{record.reporting_Manager1}</p>)
    } else {
      return (<p>{record.reporting_Manager1}</p>)
    }
  }
  const highlightMailId = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.email}</p>)
    }
    else if (dataPrevious[index - 1].email != record.email) {
      return (<p style={{ color: "red" }}>{record.email}</p>)
    } else {
      return (<p>{record.email}</p>)
    }
  }
  const highlightContactNo = (record) => {
    const index = dataPrevious.indexOf(record);
    if (index === 0) {
      return (<p>{record.contact_No}</p>)
    }
    else if (dataPrevious[index - 1].contact_No != record.contact_No) {
      return (<p style={{ color: "red" }}>{record.contact_No}</p>)
    } else {
      return (<p>{record.contact_No}</p>)
    }
  }

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
      dataIndex: 'employee_Name',
      render: (_, record) => {
        return highlightEmployeeName(record)
      }
    },
    {
      key: '4',
      title: 'Type',
      dataIndex: 'employee_Type_Name',
      render: (_, record) => {
        return highlightTypeName(record);
      }
    },
    {
      key: '5',
      title: 'Joining Date',
      dataIndex: 'joining_Date',
      render: (_, record) => {
        return highlightJoiningData(record);
      }
    },
    {
      key: '6',
      title: 'End Date',
      dataIndex: 'modified_Date',
      render: (_, record) => {
        return highlightModifiedDate(record);
      }
    },
    {
      key: '7',
      title: 'Designation',
      dataIndex: 'designation_Name',
      render: (_, record) => {
        return highlightDesignation(record)
      }
    },
    {
      key: '8',
      title: 'Reporting Manager',
      dataIndex: 'reporting_Manager1',
      render: (_, record) => {
        return hightReportingManager(record);
      }
    },
    {
      key: '9',
      title: 'Mail ID',
      dataIndex: 'email',
      render: (_, record) => {
        return highlightMailId(record);
      }
    },
    {
      key: '10',
      title: 'Contact NO',
      dataIndex: 'contact_No',
      render: (_, record) => {
        return highlightContactNo(record);
      }
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
          <h1 ref={React.createRef()} style={{ color: "blue", fontSize: 25 }}><span>{editEmployee_Name}</span>'s Previous Changes</h1></ChangeHighlight>
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