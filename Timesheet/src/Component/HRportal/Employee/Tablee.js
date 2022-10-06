import "antd/dist/antd.css";
import { Modal, Input, Space, Col, Row, Form, message, Table, Select, DatePicker, Card, Layout, Popover, } from "antd";
import Button from "antd-button-color";
import 'antd-button-color/dist/css/style.css';
import { useEffect, useState } from "react";
import { EditOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import $, { data } from 'jquery';
import Deactivateemp from "./DeactiveEmployee";
import { Link } from 'react-router-dom';
import { Checkbox } from 'semantic-ui-react';
import { LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from "../../login";
//import Select from 'react-select';

const Tablee = () => {
  // if (toke != undefined){
  //   return <Login/>
  // }

  const { Sider, Content } = Layout;
  const navigate = useNavigate();

  const navig = () => {

    navigate("/#");

  }
  if (!sessionStorage.token) {
    debugger
    navigate("/#");
    debugger
  }
  const { RangePicker } = DatePicker;
  const [empDataSource, setEmpDataSoure] = useState([]);
  const [addedEmploy, setAddedEmploy] = useState({ "employee_Name": "", "reporting_Manager1": "", "employee_Type_Id": "", "email": "", "designation_Id": "", "contact_No": "", "joining_Date": "" });
  const [isEditing, setIsEditing] = useState(false);
  const [edtEmp, setEdtEmp] = useState([]);
  const [isDeEditing, setisDeEditing] = useState(false);
  const [dctEmp, setDctEmp] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { Option } = Select;
  const toke = sessionStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage, 5);
    }
    else if (statusCode == 404) {
      message.error("Page not Found");
    }
    else if (statusCode == 400) {
      message.error(responseMessage, 10);
    }
    else if (statusCode == 500) {
      message.error("Internal Server Error");
    }
    else {
      message.error("Network Error");
    }
  }

  const employee = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setEmpDataSoure(response.data);
    setFilteredEmployee(response.data);
  }
  useEffect(() => {
    employee();
  }, []);

  const [desigDropdown, setDesigdropdown] = useState([]);
  const desig = async () => {
    const details0 = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    var multiverse = [];
    details0.data.forEach(element => {
      multiverse.push({
        value: element.designation_Id,
        label: element.designation_Name
      })
    });
    setDesigdropdown(multiverse)
    debugger;
    var optionS = new Array();
    details0.data.map((element) => {
      let Option = {
        text: element.designation_Name,
        value: element.designation_Name
      }
      optionS.push(Option);
    })
    setfilteredoption(optionS);
  }
  useEffect(() => {
    desig();
  }, []);

  const [typeDropdown, setTypeDropdown] = useState([]);
  const drptypes = async () => {
    const details1 = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    var nagarjun = [];
    details1.data.forEach(element => {
      nagarjun.push({
        value: element.employee_Type_Id,
        label: element.employee_Type_Name
      });
    });
    console.log(nagarjun);
    setTypeDropdown(nagarjun);
    var optionS = new Array();
    details1.data.map((element) => {
      let Option = {
        text: element.employee_Type_Name,
        value: element.employee_Type_Name
      }
      optionS.push(Option);
    })
    setfilteroption(optionS);
  }
  useEffect(() => {
    drptypes();
  }, []);



  // Edit On
  const [editEmployee_Type_Id, seteditEmployee_Type_Id] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editEmployee_Id, setEditEmployee_Id] = useState('');
  const [editfirst_Name, setEditEmployeeFst_Name] = useState('');
  const [editlast_Name, setEditEmployeeLst_Name] = useState('');

  const [fullName, setfullName] = useState('');

  const onEdit = () => {
    seteditEmployee_Type_Id(employee_Type_Id);
    setEditDesignation(selectedRows[0].designation_Id);
    setEditEmployee_Id(selectedRows[0].employee_Id);
    setEditEmployeeFst_Name(selectedRows[0].first_Name);
    setEditEmployeeLst_Name(selectedRows[0].editlast_Name);

    const fname = selectedRows[0].first_Name;
    const lname = selectedRows[0].last_Name;
    const flname = (fname + " " + lname);

    setfullName(flname);

    editForm.setFieldsValue(
      {
        employee_Id: selectedRows[0].employee_Id,
        first_Name: selectedRows[0].first_Name,
        last_Name: selectedRows[0].last_Name,
        employee_Type_Id: selectedRows[0].employee_Type_Id,
        joining_Date: selectedRows[0].joining_Date,
        end_Date: selectedRows[0].end_Date,
        designation_Id: selectedRows[0].designation_Id,
        employee_code: selectedRows[0].employee_code,
        alternate_Email: selectedRows[0].alternate_Email,
        reporting_Manager1: selectedRows[0].reporting_Manager1,
        email: selectedRows[0].email,
        contact_No: selectedRows[0].contact_No
      });

    setIsEditing(!isEditing);
  }

  const resetEditing = () => {
    setIsEditing(!isEditing);
  }

  const handleEdit = async (e) => {

    await axios({
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditEmployee',
      data: {
        employee_Id: editEmployee_Id,
        first_Name: e.first_Name,
        last_Name: e.last_Name,
        reporting_Manager1: e.reporting_Manager1,
        employee_Type_Id: e.employee_Type_Id,
        designation_Id: e.designation_Id,
        employee_code: e.employee_code,
        email: e.email,
        contact_No: e.contact_No,
        alternate_Email: e.alternate_Email,
        joining_Date: e.joining_Date,
        end_Date: e.end_Date
      }
    }).then((r) => {
      setMessage(r.request.status, e.first_Name + " " + e.last_Name + " Updated Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredEmployee(data.data))
      //   const timout1 = setTimeout(() => {
      //     window.location.reload();
      //   }, 1100);  

      // return () => clearTimeout(timout1);
      setIsEditing(!isEditing);
      const timeout1 = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timeout1);
    }).catch((error) => {
      setMessage(error.request.status, error.response.data);
    })
  }


  // Edit Off
  //FILTER ON 
  const [filteroption, setfilteroption] = useState();
  const [filteredoption, setfilteredoption] = useState();
  // filter values and dropdown values set from common link
  //FILTER OFF

  const employDtlColumns = [
    {
      title: 'S.No',
      render: (value, item, index) => (page - 1) * 7 + index + 1,
      dataIndex: 'colid',
      width: 100
    },
    {
      title: 'Employee ID',
      dataIndex: 'employee_Id',
      width: 100
    },
    {
      title: 'Employee code',
      dataIndex: 'employee_code',
      width: 100
    },
    {
      title: 'Employee Name',
      render: (record) => (
        <span>{record.first_Name} {record.last_Name}</span>
      ),
      width: 100
    },
    {
      title: 'Type',
      dataIndex: 'employee_Type_Name',
      filters: filteroption,
      onFilter: (value, data) => data.employee_Type_Name.startsWith(value),
      filterSearch: true,
      width: 100
    },
    {
      title: 'Designation',
      dataIndex: 'designation_Name',
      filters: filteredoption,
      onFilter: (val, dat) => dat.designation_Name.startsWith(val),
      filterSearch: true,
      width: 100
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'reporting_Manager1',
      width: 100
    },
    {
      title: 'Joining Date',
      dataIndex: 'joining_Date',
      render: (joining_Date) => { return (<p>{moment(joining_Date).format('DD-MM-YYYY')}</p>) },
      width: 100
    },
    {
      title: 'End Date',
      dataIndex: 'end_Date',
      render: (end_Date) => { return (<p>{moment(end_Date).format('DD-MM-YYYY')}</p>) },
      width: 100
    },
    {
      title: 'Official E-mail ID',
      dataIndex: 'email',
      width: 100
    },
    {
      title: 'Contact No',
      dataIndex: 'contact_No',
      width: 100
    },
    {
      title: 'Alternate E-mail ID',
      dataIndex: 'alternate_Email',
      width: 100
    }
  ]

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showAddData = () => {
    setIsModalVisible(true);
  }

  const buttonOk = () => {
    addEmp();
  };

  const buttonCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [endOpen, setEndOpen] = useState(false);
  const disabledStartDate = (joining_Date) => {
    if (!joining_Date || !endValue) {
      return false;
    }
    return joining_Date.valueOf() > endValue.valueOf();
  };
  const disabledEndDate = (end_Date) => {
    if (!end_Date || !startValue) {
      return false;
    }
    return end_Date.valueOf() <= startValue.valueOf();
  };
  const handleStartOpenChange = (open) => {
    if (!open) {
      setEndOpen(true);
    }
  };
  const handleEndOpenChange = (open) => {
    setEndOpen(open);
  };
  const handleStartDate = (event) => {
    setStartValue(event);
    const d = moment(new Date(event)).format("YYYY-MM-DD");
    setjoining_Date(d);
  }
  const handleEndDate = (event) => {
    setEndValue(event);
    const v = moment(new Date(event)).format('YYYY-MM-DD');
    setEnd_Date(v);
  }

  const [employee_Id, setEmployeeId] = useState('');
  const [first_Name, setEmployeeFstName] = useState('');
  const [last_Name, setEmployeeLstName] = useState('');
  const [reporting_Manager1, setreporting_Manager1] = useState('');
  const [employee_Type_Id, setemployee_Type_Id] = useState('');
  const [email, setemail] = useState('');
  const [designation_Id, setdesignation_Id] = useState('');
  const [contact_No, setcontact_No] = useState('');
  const [joining_Date, setjoining_Date] = useState('');
  const [end_Date, setEnd_Date] = useState('');
  const [alternate_Email, setAlternate_Email] = useState('');
  const [employee_code, setemployee_code] = useState('');
  const [password, setpassword] = useState('');
  const setDefault = () => {
    setEmployeeId(''); setEmployeeFstName(''); setemployee_code(''); setpassword(''); setEmployeeLstName(''); setreporting_Manager1(''); setemployee_Type_Id(''); setemail(''); setdesignation_Id(''); setAlternate_Email(''); setcontact_No(''); setStartValue(''); setEndValue('');
  }

  const addEmp = async () => {

    debugger
    const change = parseInt(employee_Type_Id.value);
    const change1 = parseInt(designation_Id.value);
    debugger

    await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/AddEmployee',
      data: {
        first_Name,
        last_Name,
        reporting_Manager1,
        employee_Type_Id: employee_Type_Id,
        reportinng_Manager2: "---",
        email,
        password: 'Joyitemp@123',
        // password,
        designation_Id: designation_Id,
        contact_No,
        joining_Date,
        alternate_Email,
        employee_code,
        end_Date: "----"
      }
    }).then((r) => {
      setMessage(r.request.status, first_Name + " " + last_Name + " Added Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredEmployee(data.data))
      setIsModalVisible(!isModalVisible);
      setDefault();
      const timeout1 = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timeout1);

    }).catch((error) => {

      setMessage(error.request.status, error.response.data);
      //setMessage(error.request.status, error.response.data.errors.Alternate_Email[0]);

    })
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {

      }
    }
  };
  const SelectionRow = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {
      }
    }
  };
  const showDeactivateModal = () => {
    showConfirmModal();
  }
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };
  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
  };
  const handleConfirmOk = () => {
    var activateDesignation = '';
    setIsConfirmModalVisible(false);
    selectedRows.forEach(element => {

      axios({
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': `Bearer ${toke}`
        },
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditEmployeIsActive',
        data: {
          id: element.employee_Id,
          is_Active: false
        }
      }).then((r) => {
        // setMessage(r.request.status, element.first_Name + " " + element.last_Name + " - Deactivated Successfully");
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredEmployee(data.data))
        const timeout2 = setTimeout(() => {
          window.location.reload();
        }, 1000);
        return () => clearTimeout(timeout2);
      }).catch((error) => {
        setMessage(error.request.status);
      })
      console.log(element.designation_Name)
      debugger
      activateDesignation = activateDesignation + element.first_Name + element.last_Name + ', ';
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation + " Deactivated Successfully");
    debugger
    setIsConfirmModalVisible(false);
  }

  useEffect(() => {
    const result = empDataSource.filter(emDataSource => {
      return emDataSource.employee_Id.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.first_Name.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.last_Name.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.employee_Type_Name.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.designation_Name.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.reporting_Manager1.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.email.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.contact_No.toLowerCase().match(search.toLowerCase())

    })
    setFilteredEmployee(result);
  }, [search])

  // var state = document.getElementById('validemp').value;

  $("#dctemptable").hide();
  $(document).ready(function () {
    $('#validemp').on('change', function () {
      if (this.value == 1) {
        $("#emptable").show();
        $("#abc").show();
        $("#activate").show();
        //$("#clientisactive").show();
        $("#dctemptable").hide();
        window.location.reload();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }

        })
          .then(data => setFilteredEmployee(data.data))
      } else if (this.value == 0) {
        $("#dct1").hide();
        $("#dctemptable").show();
        $("#activate").hide();
        //$("#clientisactive").hide();
        $("#abc").hide();
        $("#emptable").hide();
      }
    });
  });

  return (
    <>
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

      <Popover position="top" content='Logout'>
        <button style={{ width: '5em', backgroundColor: '#f77c7c', marginLeft: '91%', marginTop: '2%' }}>
          <LogoutOutlined onClick={navig} />
        </button>
      </Popover>

      <div style={{ position: "fixed", marginLeft: 250 }}>
        <div className="App" style={{ display: "-ms-flexbox", marginBottom: 30, maxHeight: 500 }}>
          <h1 style={{ color: "blue", fontWeight: "bolder" }}>EMPLOYEES</h1>

          <header className="App-header">
            <Space direction="Horizantal" style={{ marginTop: 10 }}>
              <div id="abc">
                <Input
                  type="text"
                  title="Search"
                  placeholder="Search here...."
                  suffix={<SearchOutlined />}
                  value={search}
                  style={{ width: 150, position: "fixed" }}
                  onChange={(e) => setSearch(e.target.value)} />
              </div>
              <p style={{ fontWeight: "bold", marginLeft: 150, fontSize: 20, marginTop: 2, position: "fixed" }}>Active:</p>
              <select id="validemp" title="Select One Option" style={{ width: 70, height: 30, marginTop: 2, marginLeft: 215, position: "fixed" }}>
                <option disabled>-Select One-</option>
                <option value={1} selected="selector">Yes</option>
                <option value={0}>No</option>
              </select>
              <div id="efg" style={{ marginLeft: 350 }}>
                <Button id="activate" type="primary" rowKey="id" title="Add Employee" onClick={showAddData}>Add Employee</Button>
                <Modal
                  style={{ position: 'fixed', marginTop: '-6.5%', marginLeft: '24%' }}
                  title={<Space><h2 className="add" style={{ color: "blue" }}>ADD EMPLOYEE</h2><Button type="link" icon={<CloseCircleOutlined />} style={{ marginLeft: 470, fontWeight: "bold", color: "red" }} onClick={buttonCancel}></Button></Space>}
                  okText="Confirm"
                  okType="success"
                  cancelText="Cancel"
                  closable={false}
                  width={750}
                  footer={<><Button type="danger" onClick={buttonCancel}>Cancel</Button> <Button type="success" onClick={() => {
                    form.validateFields().then((values) => {
                      buttonOk(values)
                    })
                      .catch((info) => {
                      });
                  }}>Confirm</Button></>}
                  // onCancel={buttonCancel}
                  visible={isModalVisible}>
                  <div>
                    <Form form={form} layout="vertical" name="form_in_modal">
                      <Row>
                        <Col span={5}>
                          <p style={{ fontWeight: "bold" }}>Employee ID<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}>First Name<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}>Last Name<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}>Type<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                      </Row>

                      <Row>
                        <Col span={5} >
                          <Input type='text' id='employee_Id' name='employee_Id' value={null}
                            disabled />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <Form.Item name="first_Name" rules={[{ required: true, message: 'Please enter the Name' }, {
                            pattern: new RegExp(/^[a-z A-Z]+$/i),
                            message: "It does not accept numbers and special characters"
                          }]}>
                            <Input type='text' id='first_Name' value={first_Name}
                              onChange={(e) => setEmployeeFstName(e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <Form.Item name="last_Name" rules={[{ required: true, message: 'Please enter the Name' }, {
                            pattern: new RegExp(/^[a-z A-Z]+$/i),
                            message: "It does not accept numbers and special characters"
                          }]}>
                            <Input type="text" id='last_Name' value={last_Name}
                              onChange={(e) => setEmployeeLstName(e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <Form.Item
                            name="type"
                            rules={[{ required: true, message: 'Please Select the Type' }]}>
                            {/* <Select onChange={(value) => { setemployee_Type_Id(value) }} placeholder="Select One">
                              {(typeDropdown && typeDropdown.length > 0) && typeDropdown.map((typDown) => {
                                return <Option value={typDown.employee_Type_Id}>{typDown.employee_Type_Name}</Option>
                              })}
                            </Select> */}
                            <Select
                              isSearchable={false}
                              onChange={(value) => { setemployee_Type_Id(value) }} placeholder="Select One"
                              options={typeDropdown}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: 10 }}>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}>Joining Date<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}>End Date</p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 10, fontWeight: "bold" }}> Designation<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ marginLeft: 15, fontWeight: "bold" }}>Reporting Manager</p>
                        </Col>
                        <Col span={1}></Col>
                      </Row>

                      <Row>
                        <Col span={5}>
                          <Form.Item name="Date" rules={[{ required: true, message: 'Please enter the Date' }]}>
                            <DatePicker
                              style={{ width: '100%' }}
                              disabledDate={(current) => {
                                let customDate = new Date;
                                return current && current > moment(customDate, "YYYY-MM-DD");
                              }
                              }
                              // disabledDate={disabledStartDate}
                              value={startValue}
                              placeholder="Start"
                              format={"DD-MM-YYYY"}
                              onChange={handleStartDate}
                              onOpenChange={handleStartOpenChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={disabledEndDate}
                            value={endValue}
                            placeholder="End"
                            format={"DD-MM-YYYY"}
                            onChange={handleEndDate}
                            onOpenChange={handleEndOpenChange}
                          />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={6}>
                          <Form.Item name="designation" rules={[{ required: true, message: 'Please Select the Designation' }]}>
                            {/* <Select style={{ width: 150 }} onChange={(value) => { setdesignation_Id(value) }} placeholder="Select One">
                              {(desigDropdown && desigDropdown.length > 0) && desigDropdown.map((dpDown) => {
                                return <Option value={dpDown.designation_Id}>{dpDown.designation_Name}</Option>
                              })}
                            </Select> */}
                            <Select style={{ width: 150 }}
                              isSearchable={false}

                              onChange={(value) => { setdesignation_Id(value) }} placeholder="Select One"
                              options={desigDropdown}
                            />


                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item name="reporting_Manager1"
                          // rules={[{ required: true, message: 'Please enter the Reporting Manageer' }]}
                          >
                            <Input id='reporting_Manager1' value={reporting_Manager1}
                              onChange={(e) => setreporting_Manager1(e.target.value)}
                              style={{ marginLeft: 10 }} />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                      </Row>
                      <Row>
                        <Col span={5}>
                          <p style={{ fontWeight: "bold" }}>Employee Code<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        {/* <Col span={5}>
                          <p style={{ fontWeight: "bold" }}> password<span style={{ color: "red" }}>*</span></p>
                        </Col> */}
                      </Row>
                      <Row>
                        <Col span={5}>
                          <Form.Item name="employee_code"
                            rules={[{ required: true, message: 'Please enter the Employee Code' }]}
                          >
                            <Input id='employee_code' value={employee_code}
                              onChange={(e) => setemployee_code(e.target.value)} />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        {/* <Col span={5}>
                          <Form.Item name="password"
                            rules={[{ required: true, message: 'Please enter the password' }]}
                          >
                            <Input id='password' value={password}
                              onChange={(e) => setpassword(e.target.value)} />
                          </Form.Item>
                        </Col> */}
                      </Row>
                      {/* <Row>
                      <Col span={5}>
                          <p style={{ fontWeight: "bold", marginLeft: 10 }}>pass<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                      </Row>
                      <Row>
                      <Col span={5}>
                        <Form.Item name="password"
                          rules={[{ required: true, message: 'Please enter the Employee Code' }]}
                          >
                            <Input id='password' value={password}
                              onChange={(e) => setpassword(e.target.value)} />
                          </Form.Item>
                        </Col>
                      </Row> */}

                      <h2 className="edt" style={{ marginTop: 20, fontWeight: "bold", color: "blue" }}>CONTACT INFO</h2>
                      <Row>
                        <Col span={5}>
                          <p style={{ fontWeight: "bold", marginLeft: 10 }}>Official E-mail ID<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ fontWeight: "bold", marginLeft: 10 }}>Alternate E-mail ID</p>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <p style={{ fontWeight: "bold", marginLeft: 10 }}>Contact No<span style={{ color: "red" }}>*</span></p>
                        </Col>
                        <Col span={1}></Col>
                      </Row>
                      <Row>
                        <Col span={5}>
                          <Form.Item type={"email"} name="email" rules={[{ required: true, message: 'Please enter the Email' }, {
                            pattern: new RegExp(/^([a-z0-9-_\.]+)@([a-z0-9]+)\.([a-z]{2,10})(\.[a-z]{2,8})?$/),
                            message: "Enter valid Email"
                          }]}>
                            <Input type={"email"} id='email' value={email}
                              onChange={(e) => setemail(e.target.value)} />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <Form.Item name="alteremail" dependencies={["email"]}

                            hasFeedback

                            rules={[{

                              pattern: new RegExp(/^([a-z0-9-_\.]+)@([a-z0-9]+)\.([a-z]{2,10})(\.[a-z]{2,8})?$/),

                              message: "Enter valid Email"

                            },

                            ({ getFieldValue }) => ({

                              validator(_, value) {

                                if (!value || getFieldValue("email") != value)

                                  return Promise.resolve();



                                return Promise.reject(

                                  new Error("Alternate mail and Official mail should not be same")

                                );

                              },

                            })

                            ]}>
                            <Input type={"email"} id='alteremail' value={email}
                              onChange={(e) => setAlternate_Email(e.target.value)} />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>
                          <Form.Item name="contact_No" type={"text"} rules={[{ required: true, message: 'Please enter the Phone Number' }, {
                            pattern: new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
                            message: "Field must contain 10 numbers"
                          }, {
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Field must only contain numbers"
                          }]}>
                            <Input type={"text"} id='contact_No' value={contact_No} maxLength={10}
                              onChange={(e) => setcontact_No(e.target.value)} />
                          </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                      </Row>
                    </Form>
                  </div>
                </Modal>
              </div>
              <div id="dct" style={{ marginLeft: 50, paddingLeft: '5%', display: 'inline' }}>
                <div id="dct1" style={{ marginLeft: 50, paddingLeft: '5%', display: 'inline' }}>
                  <Space direction="horizantal">
                    <Button
                      hidden={!hasSelected}
                      type="danger"
                      title="Deactivate"
                      onClick={showDeactivateModal}
                      icon={<CloseCircleOutlined />}
                    >
                      Deactivate
                    </Button>

                    {
                      selectedRows.length === 1 ?
                        <Button type="primary" icon={<EditOutlined />} title="Edit" onClick={() => {
                          onEdit();
                        }} >Edit</Button> : ""
                    }

                  </Space>
                </div>
              </div>
            </Space>
            <div id="emptable" style={{ width: "72%" }}>

              <Table
                columns={employDtlColumns}
                dataSource={filteredEmployee}
                rowKey={record => record.employee_Id}
                rowSelection={{
                  type: Checkbox,
                  ...rowSelection,
                }}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize)
                  }
                }}
                size="small"
                bordered
                scroll={{
                  x: 1390,
                  y: 370
                }}
              />
            </div>

            <div id="dctemptable">
              <Deactivateemp />
            </div>

            <Modal
              style={{ position: 'fixed', marginTop: '-6.5%', marginLeft: '24%' }}
              header={false}
              title={[<Space><h2 style={{ color: "blue" }}><b>Edit</b></h2><Button style={{ marginLeft: 620, marginTop: -20, fontSize: 20 }} type="link" onClick={resetEditing}>X</Button></Space>]}
              visible={isEditing}
              width={750}
              closable={false}
              footer={false}
            >
              <Form
                form={editForm}
                onFinish={(e) => handleEdit(e)}
              ><Row>
                  <Col span={5}>
                    <p style={{ fontWeight: "bold" }}>Employee ID<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>First Name<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>Last Name<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>Type<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                </Row>

                <Row>
                  <Col span={5}>
                    <Form.Item
                      name='employee_Id'
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col> <Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='first_Name'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Employee Name!'
                        },
                        {
                          pattern: new RegExp(/^[a-zA-Z ]+$/i),
                          message: 'field accept only letters'
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col> <Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='last_Name'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Employee Name!'
                        },
                        {
                          pattern: new RegExp(/^[a-z A-Z]+$/i),
                          message: 'field does not accept numbers'
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col> <Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='employee_Type_Id'
                    >
                      {/* <Select>
                        {typeDropdown.map(opt => (
                          <Select.Option value={opt.employee_Type_Id}>{opt.employee_Type_Name}</Select.Option>
                        ))
                        }
                      </Select> */}
                      <Select
                        isSearchable={false}
                        onChange={(value) => { setemployee_Type_Id(value) }} placeholder="Select One"
                        options={typeDropdown}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row style={{ marginTop: 10 }}>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>Joining Date<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }} >End Date</p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}> Designation<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>Reporting Manager</p>
                  </Col>
                  <Col span={1}></Col>
                </Row>

                <Row>
                  <Col span={5}>
                    <Form.Item
                      name='joining_Date'
                    >
                      <Input type="datetime-local" value={moment(joining_Date).format('DD - MM - YYYY')} format="yyyy-mm-dd" disabled />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='end_Date'
                    >
                      <Input type='date'
                        value={endValue}
                        onChange={handleEndDate}
                        onOpenChange={handleEndOpenChange}
                      />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='designation_Id'
                    >
                      {/* <Select>
                        {desigDropdown.map(opt => (
                          <Select.Option value={opt.designation_Id}>{opt.designation_Name}</Select.Option>
                        ))}
                      </Select> */}
                      <Select style={{ width: 155, }}
                        isSearchable={false}

                        onChange={(value) => { setdesignation_Id(value) }} placeholder="Select One"
                        options={desigDropdown}
                      />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='reporting_Manager1'
                    >
                      <Input />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                </Row>
                <Row>
                  <Col span={5}>
                    <p style={{ marginLeft: 10, fontWeight: "bold" }}>Employee Code<span style={{ color: "red" }}>*</span></p>
                  </Col>
                </Row>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name='employee_code'
                      rules={[{ required: true, message: 'Please enter the Employee Code' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <h2 className="edt" style={{ marginTop: 20, fontWeight: "bold", color: "blue" }}>CONTACT INFO</h2>
                <Row>
                  <Col span={5}>
                    <p style={{ fontWeight: "bold", marginLeft: 10 }}>Official E-mail ID<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ fontWeight: "bold", marginLeft: 10 }}>Alternate E-mail ID<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={5}>
                    <p style={{ fontWeight: "bold", marginLeft: 10 }}>Contact No<span style={{ color: "red" }}>*</span></p>
                  </Col>
                  <Col span={1}></Col>
                </Row>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name='email'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your email'
                        },
                        {
                          pattern: new RegExp(/^([a-z0-9-_\.]+)@([a-z0-9]+)\.([a-z]{2,10})(\.[a-z]{2,8})?$/),
                          message: 'Invalid email'
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='alternate_Email'
                      rules={[
                        {
                          pattern: new RegExp(/^([a-z0-9-_\.]+)@([a-z0-9]+)\.([a-z]{2,10})(\.[a-z]{2,8})?$/),
                          message: 'Invalid email'
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col><Col span={1}></Col>
                  <Col span={5}>
                    <Form.Item
                      name='contact_No'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Contact Number'
                        },
                        {
                          pattern: new RegExp(/^\d{10}$/),
                          message: 'Invalid Phone Number'
                        }
                      ]}
                    >
                      <Input maxLength={10} />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ marginTop: 10 }}>
                  {/* <Link state={{ id: editEmployee_Id, editEmployee_Name: fullName }} to="/employee/Previouschange" ><p style={{ color: "blue" }}><u>View Previous Changes</u></p></Link> */}
                  <p style={{ color: "blue" }}><Link state={{ id: editEmployee_Id, editEmployee_Name: fullName }} to="/employee/Previouschange" ><u style={{ fontSize: 20 }}>View Previous Changes</u></Link>
                    <span >
                      <Space>
                        <Button type="danger" style={{ marginLeft: 400, marginBotton: -20, marginTop: '-1%', position: 'fixed' }} onClick={resetEditing}>Cancel</Button>
                        <Button style={{ marginLeft: 250, position: 'fixed', marginTop: '-1%' }} type="success" htmlType="submit">Save Changes</Button>
                      </Space>
                    </span>
                  </p>

                </div>
                {/* <Form.Item>
                  <Space>
                    <Button type="danger" style={{ marginLeft: 470, marginBotton: -20 }} onClick={resetEditing}>Cancel</Button>
                    <Button type="success" htmlType="submit">Save Changes</Button></Space>
                </Form.Item> */}
              </Form>

            </Modal>

            <Modal
              visible={isConfirmModalVisible}
              onOk={handleConfirmOk}
              onCancel={handleConfirmCancel}
              footer={[
                <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
                <Button type='primary' onClick={handleConfirmCancel}>No</Button>
              ]}
            >
              <h2 className="edt">Are you sure want to Deactivate the Employee?</h2>
            </Modal>
          </header>
        </div>
      </div>
    </>
  )
}
export default Tablee; 