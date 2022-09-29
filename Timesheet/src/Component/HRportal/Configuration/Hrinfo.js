import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Form, Modal, Col, Row, Table, Select, message, Card, Layout, Popover } from "antd";
import { PlusCircleOutlined, EditOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Deactivatehrinfo from './Deactivehrinfo';
import $, { data } from 'jquery';
import Button from 'antd-button-color';
import { Checkbox } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Hrinfo = () => {

  function refreshPage1() {

    setTimeout(() => {

      // window.location.reload(false);

    }, 5000);

    console.log('page to reload')

  }

  const [deactivate, setDeactivate] = useState(false);
  const [isActivateModal, setIsActivateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toggleActivate, setToggleActivate] = useState(false);
  const { Sider, Content } = Layout;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [addedClient, setAddedClient] = useState({ "hr_Mail_Id": "" });
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const toke = sessionStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const navig = () => {
    navigate("/#");
  }
  if(!sessionStorage.token){
    debugger
    navigate("/#");
    debugger
}
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage, 4);
    }
    else if (statusCode == 400) {
      message.error(responseMessage, 5);
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HrContactinfo", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setClientDataSoure(response.data);
    setFilteredClient(response.data);
    console.log(response.data)
    debugger
  }
  useEffect(() => {
    clientdtl();
  }, []);

  const [hrDropdown, setHrDropdown] = useState([]);
  const dphrs = async () => {
    const details1 = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployee", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    });

    setHrDropdown(details1.data);
  }
  useEffect(() => {
    dphrs();
  }, []);

  const clientDtlColumns = [
    {
      title: 'S.No',
      render: (value, item, index) => (page - 1) * 4 + index + 1,
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
      title: 'Contact Info',
      dataIndex: 'hr_Contact_No',
    },
    // {
    //   render: (clidtl, actdtl) => {
    //     return <>
    //       <Button type="primary" icon={<EditOutlined />} title="Edit"
    //         onClick={() => {
    //           console.log(clidtl);
    //           onEdit(clidtl);
    //         }} />
    //     </>
    //   }
    // }
  ];




  const showAddData = () => {
    setIsModalVisible(true);
  }
  const buttonOk = () => {
    setIsModalVisible(false);
    addCli();
  };
  const buttonCancel = () => {
    setIsModalVisible(false);
  };

  const AddClient = () => {

    const [hr_Mail_Id, setHr_Email_Id] = useState('');

    const addHr_Email_Id = (hr_Mail_Id) => {
      addedClient["hr_Mail_Id"] = hr_Mail_Id;
      setAddedClient(addedClient);
      setHr_Email_Id(hr_Mail_Id);
    }

    return (
      <div>
        <Form form={form} layout="vertical" name="form_in_modal">
          <h2 className="add">HR INFO</h2>
          <Row>
            <Col span={10}>

            </Col>
            <Col span={1}></Col>
            <Col span={10}>

            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Mail Id:</p>
            </Col>
            <Col span={1}></Col>
            <Col span={10}>
              <Form.Item name="hr_Mail_Id" rules={[{ required: true, message: 'Please enter the Mail' }]}>
                <Select value={hr_Mail_Id}
                  onChange={(value) => { addHr_Email_Id(value) }} placeholder="Select Mail_id">
                  {(hrDropdown && hrDropdown.length > 0) && hrDropdown.map((hpDown) => {
                    return <Select.Option value={hpDown.email}>
                      {hpDown.email}</Select.Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>

            </Col>
            <Col span={1}></Col>
            <Col span={10}>

            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  const addCli = async () => {
    await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },

      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Add_HrContactInfo',
      data: addedClient
    }).then((r) => {
      console.log(r);
      setMessage(r.request.status, addedClient.hr_Mail_Id + " Added Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HrContactinfo", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredClient(data.data))
    }).catch((error) => {
      setMessage(error.request.status, error.response.data);
    })
  }

  const [editForm] = Form.useForm();
  const onEdit = (row) => {
    editForm.setFieldsValue({
      hr_Contact_Id: selectedRows[0].hr_Contact_Id,
      hr_Name: selectedRows[0].hr_Name,
      hr_Email_Id: selectedRows[0].hr_Email_Id,
      hr_Contact_No: selectedRows[0].hr_Contact_No,
    });

    setIsEditing(true);
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEdtCli([]);
  };
  const EditProjects = (dtl) => {
    const [hr_Contact_Id, sethr_Contact_Id] = useState(dtl.dtl.hr_Contact_Id);
    const [hr_Name, sethr_Name] = useState(dtl.dtl.hr_Name);
    const [hr_Email_Id, sethr_Email_Id] = useState(dtl.dtl.hr_Email_Id);
    const [hr_Contact_No, sethr_Contact_No] = useState(dtl.dtl.hr_Contact_No);

    const edithr_Contact_Id = (hr_Contact_Id) => {
      edtCli["hr_Contact_Id"] = hr_Contact_Id;
      setEdtCli(edtCli);
      sethr_Contact_Id(hr_Contact_Id);
    }
    const edithr_Contact_No = (hr_Contact_No) => {
      edtCli["hr_Contact_No"] = hr_Contact_No;
      setEdtCli(edtCli);
      sethr_Contact_No(hr_Contact_No);
    }

    return (
      <>
        {/* <form>
          <h2 className="edt">EDIT</h2>
          <Row>
            <Col span={5}>
              <p style={{ fontWeight: "bold" }}>Contact_Id</p>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Name:</p>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <p style={{ fontWeight: "bold" }}>Mail Id</p>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Contact Info</p>
            </Col>
            <Col span={1}></Col>
          </Row>

          <Row>
            <Col span={5}>
              <Input type='text' id='hr_Contact_Id' name='hr_Contact_Id' value={hr_Contact_Id}
                disabled />
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Input type='text' id='hr_Name' value={hr_Name}
                style={{ marginLeft: 10 }} readOnly />
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Input type='text' id='hr_Email_Id' value={hr_Email_Id}
                style={{ marginLeft: 10 }} readOnly />
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Input type='text' id='hr_Contact_No' value={hr_Contact_No} maxLength={10}
                onChange={(e) => edithr_Contact_No(e.target.value)} style={{ marginLeft: 10 }} />
            </Col>
            <Col span={1}></Col>
          </Row>
        </form> */}
        <Form
          form={editForm}
          onFinish={(inputData) => editsClient(inputData)}
        >
          <Form.Item style={{ marginLeft: 10 }}
            label='hr_Contact_Id'
            name='hr_Contact_Id'
          >
            <Input style={{ marginLeft: "27px", width: "60px" }} disabled />
          </Form.Item>
          {/* <Form.Item
           
            name='hr_Contact_No' 

          >
            <Input style={{ width: "200px" }} />
          </Form.Item> */}
              <Form.Item
               label='hr_Contact_No'
              name="hr_Contact_No" type={"text"} rules={[{ required: true, message: 'Please enter the Phone Number' }, {
                            pattern: new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
                            message: "Field must contain 10 numbers"
                          }, {
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Field must only contain numbers"
                          }]}>
                            <Input style={{ width: "200px"}} type={"text"} id='contact_No' value={hr_Contact_No} maxLength={10}></Input>
                               
                          </Form.Item>
          <Form.Item>
            <Button type="danger" style={{ marginLeft: 490, marginBotton: -20 }} onClick={resetEditing}>Cancel</Button>
            <Button htmlType="submit" style={{ backgroundColor: "lightgreen", marginLeft: "10px" }}>Save Changes</Button>
          </Form.Item>
        </Form>
      </>
    )
  }
  const editsClient = async (inputData) => {
    debugger
    console.log(inputData);
    const data = await axios({
      method: 'put',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Edit_HRContact',
      data: inputData
    }).then((r) => {
      setMessage(r.request.status, inputData.hr_Contact_No + " Updated Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HrContactinfo", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredClient(data.data))
      const timout1 = setTimeout(() => {
        window.location.reload();
      }, 1100);

      return () => clearTimeout(timout1);
      setIsEditing(!isEditing);
    }).catch((error) => {
      setMessage(error.request.status, error.response.data);
    })
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const hassSelect = selectedRows.length == 1;

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
      setSelectedRowKeys(selectedRowKeys);
      setDeactivate(true);
      setToggleActivate(true)
      if (selectedRow.length === 0) {
        setDeactivate(false);
        setToggleActivate(false);
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditHrContactInfoIsActive',
        data: {
          id: element.hr_Contact_Id,
          is_Active: false
        },
      }).then((r) => {
        //setMessage(r.request.status, element.hr_Name + "Deactivated Successfully");

        clientdtl();

        $('#hrisactive');

        if (page == 1) {

          setPage(page);

        }

        else {

          setPage(page - 1);

        }
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HrContactinfo", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data));
        const timeout1 = setTimeout(() => {
          window.location.reload();
        }, 1100);

        return () => clearTimeout(timeout1);


      })
      activateDesignation = activateDesignation + element.hr_Name + ', ';
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation + " Deactivated Successfully");
    debugger
    setIsConfirmModalVisible(false);
    setIsActivateModal(false);
    setToggleActivate(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    rowSelection = ''
    setIsConfirmModalVisible(false);
  }


  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.hr_Name.toString().toLowerCase().match(search.toLowerCase()) ||
        cliDataSource.hr_Contact_No.toString().toLowerCase().match(search.toLowerCase()) ||
        cliDataSource.hr_Email_Id.toString().toLowerCase().match(search.toLowerCase())
    })
    setFilteredClient(result);
  }, [search])

  $("#dcthrtable").hide();
  $(document).ready(function () {
    $('#validhr').on('change', function () {
      if (this.value == 1) {
        $("#hrtable").show();
        $("#abc").show();
        $("#ac").show();
        $('#hrisactive').show();
        $("#dcthrtable").hide();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HrContactinfo", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data));
      } else if (this.value == 0) {
        $("#dcthrtable").show();
        $('#hrisactive').hide();
        $("#abc").hide();
        $("#ac").hide();
        $("#hrtable").hide();
      }
    });
  });


  return (
    <>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue", marginTop: -100, }}>
        <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button><br /><br />
      </Sider>

      <div style={{ width: "85%", marginLeft: 250 }}>
        <div style={{ marginTop: "1%" }}>
          <Row>
            <Col span={2}><p style={{ color: "blue", fontSize: 30 }}><b>Configuration</b></p></Col>
            <Col span={19}>
              <button style={{ width: '5em', backgroundColor: '#f77c7c', marginLeft: '91%', marginTop: '0%' }}>
                <LogoutOutlined onClick={navig} />
              </button>
            </Col>
          </Row>
        </div>
        <div style={{ position: "fixed", width: "85%" }}>
          <Row><Col span={2}></Col>
            <Col span={4}><Link to="/Configuration/Client"><Button style={{ width: 130 }}>Client</Button></Link></Col>
            <Col span={4}><Link to="/Configuration/Project"><Button style={{ width: 130 }}>Project</Button></Link></Col>
            <Col span={4}><Link to="/Configuration/Designation"><Button style={{ width: 130 }}>Job Title</Button></Link></Col>
            <Col span={4} stylw={{ marginLeft: 10 }}><Link to="/Configuration/EmployeeType"><Button style={{ width: 130 }}>Employee Type</Button></Link></Col>
            <Col span={4}><Link to="/Configuration/HrInfo" disabled><Button style={{ width: 130 }} type="primary">HR Contact Info</Button></Link></Col><Col span={2}></Col>
          </Row><Card className="table_border_antd" style={{ width: 1000, borderTopColor: "blue", borderLeftColor: "black", borderRightColor: "black", borderBottomColor: "black", borderTopWidth: 5, position: "fixed" }}>
            <h1 style={{ marginLeft: 110, color: "blue", fontSize: 25 }}><b>HR Contact Info</b></h1>
            <div style={{ marginLeft: 290, marginTop: 30, width: 400 }}>
              <Space direction="Horizantal" style={{ marginTop: 1 }}>
                <div id="abc" style={{ position: "fixed" }}>
                  <Input
                    type="text"
                    placeholder="Search here...."
                    className="w-25% form-control"
                    suffix={<SearchOutlined />}
                    value={search}
                    style={{ width: 150, marginLeft: -180, marginTop: "-1px" }}
                    onChange={(e) => setSearch(e.target.value)} /></div>
                <p style={{ fontWeight: "bold", fontSize: 20, position: "fixed", marginLeft: 5 }}>Active :</p>
                <select id="validhr" style={{ width: 70, height: 30, position: "fixed", marginLeft: 70 }}>
                  <option disabled>-Select One-</option>
                  <option value={1} selected="selector">Yes</option>
                  <option value={0}>No</option>
                </select>
                <div id="hrisactive" style={{ position: 'fixed', marginLeft: 80, paddingLeft: '5%', display: 'inline' }}>
                  <Button
                    hidden={!hasSelected}
                    type="danger"
                    onClick={showDeactivateModal}
                    icon={<CloseCircleOutlined />}
                  >
                    Deactivate
                  </Button>
                  <div style={{ marginLeft: '113%', marginTop: '-27%' }}>
                    <Button style={{ position: 'fixed' }} type="primary" icon={<EditOutlined />} title="Edit"
                      hidden={!hassSelect}
                      onClick={() => {
                        onEdit();
                      }} >EDIT</Button>
                  </div>
                </div>

                {/* EDIT ==================>*/}

                {/* <div style={{ marginLeft: 20 }}>
                  <Button type="primary" icon={<EditOutlined />} title="Edit"
                    hidden={!hassSelect}
                    onClick={() => {
                      onEdit();
                    }} >EDIT</Button>
                </div> */}
              </Space>
              <div id="hrtable" style={{ marginTop: 10, marginLeft: -180 }}>
                <Table
                  style={{ marginTop: "5%" }}
                  columns={clientDtlColumns}
                  dataSource={filteredClient}
                  rowKey={record => record.hr_Contact_Id}
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
                    y: 150
                  }}
                /></div>

              <Button id="ac"
                type="link" rowKey="id"
                icon={<PlusCircleOutlined />}
                onClick={showAddData}
                style={{ marginLeft: 300, fontWeight: 'bolder', fontSize: 20 }}>ADD</Button>
              <Modal onOk={() => {
                form.validateFields().then((values) => {
                  buttonOk(values)
                  form.resetFields();
                })
                  .catch((info) => {
                    console.log('validate Field:', info);
                  });
              }}
                width={400}

                onCancel={buttonCancel}

                visible={isModalVisible}

                footer={[

                  <Button type="danger" onClick={buttonCancel}>Cancel</Button>, <Button type="primary" onClick={() => {

                    form.validateFields().then((values) => {

                      buttonOk(values)

                      form.resetFields();

                    })

                      .catch((info) => {

                        console.log('validate Field:', info);

                      });

                  }}>Add</Button>

                ]}
              >
                <AddClient />
              </Modal>
            </div>
            <Modal
              visible={isEditing}
              //okText="Save Changes"
              okButtonProps={{ background: "#52c41a" }}
              width={750}
              onCancel={() => {
                resetEditing()
              }}
              footer={false}
            // onOk={() => {
            //   editsClient(edtCli)
            //   resetEditing()
            // }}
            >
              <EditProjects
                dtl={edtCli}
              />
            </Modal>
            <Modal visible={isConfirmModalVisible}
              onOk={handleConfirmOk}
              onCancel={handleConfirmCancel}
              footer={[
                <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
                <Button type='primary' onClick={handleConfirmCancel}>No</Button>
              ]}>
              <h2 className="edt">Are you sure want to Deactivate the Hr?</h2>
            </Modal>
            <div id="dcthrtable">
              <Deactivatehrinfo />
            </div></Card></div></div>
    </>
  )
}
export default Hrinfo;