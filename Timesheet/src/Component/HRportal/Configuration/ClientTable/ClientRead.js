import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Form, Modal, Col, Row, Table, message, Card, Layout, Popover } from "antd";
import Button from "antd-button-color";
import { PlusCircleOutlined, EditOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Readdeactivated from "./Readdeactivated";
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { Checkbox } from 'semantic-ui-react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function ClientRead() {

  const { Sider, Content } = Layout;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deactivate, setDeactivate] = useState(false);
  const [isActivateModal, setIsActivateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toggleActivate, setToggleActivate] = useState(false);
  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [addedClient, setAddedClient] = useState({ "client_Name": "", "is_Active": true });
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const navig = () => {
    navigate("/#");
  }
  const toke = sessionStorage.getItem("token");
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage, 5);
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else if (statusCode == 400) {
      message.error(responseMessage, 5);
    }
    else {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_Clients", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setClientDataSoure(response.data);
    setFilteredClient(response.data);
  }
  useEffect(() => {
    clientdtl();
  }, []);

  const clientDtlColumns = [
    {
      title: 'COL_ID',
      render: (value, item, index) => (page - 1) * pageSize + index + 1,
      dataIndex: 'colid',
      width: "5rem"
    },
    {
      title: 'Client',
      dataIndex: 'client_Name',
      width: "10rem"
    },

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
    const [client_Name, setClientName] = useState('');

    const addClient_Name = (client_Name) => {
      addedClient["client_Name"] = client_Name;
      setAddedClient(addedClient);
      setClientName(client_Name);
    }

    return (
      <div>
        <Form form={form} layout="vertical" name="form_in_modal">
          <h2 className="add">ADD CLIENT</h2>
          <Row>
            <Col span={10}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Client Name:</p>
            </Col>
            <Col span={1}></Col>
            <Col span={10}>
              <Form.Item name="client_Name" rules={[{ required: true, message: 'Please enter the Name' }, {
                pattern: new RegExp(/^[a-zA-Z0-9 ]+$/i),
                message: "field does not accept numbers"
              }]}>
                <Input type='text' id='client_Name' value={client_Name}
                  onChange={(e) => addClient_Name(e.target.value)}
                  required />
              </Form.Item>
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
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Add_Client',
      data: addedClient
    }).then((r) => {
      console.log(r);
      setMessage(r.request.status, addedClient.client_Name + " Added Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_Clients", {
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
      client_Id: selectedRows[0].client_Id,
      client_Name: selectedRows[0].client_Name
    });
    setIsEditing(!isEditing);
  }
  const resetEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleEdit = async (e) => {
    await axios({
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Edit_Client',
      data: e,
    }).then((r) => {
      setMessage(r.request.status, e.client_Name + " Updated Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_Clients", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }

      })

        .then(data => setFilteredClient(data.data))

      setIsEditing(!isEditing);
    }).catch((error) => {

      setMessage(error.request.status, error.response.data);
    });
    const timeoutmsg = setTimeout(() => {
      window.location.reload();
    }, 1500);
    return () => clearTimeout(timeoutmsg);
  }
  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const hassSelect = selectedRows.length == 1;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      setSelectedRowKeys(selectedRowKeys);
      setDeactivate(true);
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {
        setDeactivate(false);
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditClientIsActive',
        data: {
          id: element.client_Id,
          is_Active: false
        },
      }).then((r) => {
        clientdtl();
        clientdtl();

        $('#clientisactive');

        if (page == 1) {

          setPage(page);

        }

        else {

          setPage(page - 1);

        }
        //setMessage(r.request.status, element.client_Name + " Deactivated Successfully");
        const timeoutmsg = setTimeout(() => {
          window.location.reload();
        }, 1500);
        return () => clearTimeout(timeoutmsg);
      })
      activateDesignation = activateDesignation + element.client_Name + ', ';
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation + " Deactivated Successfully");
    setIsActivateModal(false);
    setToggleActivate(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    rowSelection = ''
    setIsConfirmModalVisible(false);
  }


  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.client_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])


  $("#dctclitable").hide();
  $(document).ready(function () {
    $('#validcli').on('change', function () {
      if (this.value == 1) {
        $("#clitable").show();
        $("#abc").show();
        $("#efg").show();
        $('#clientisactive').show();
        $("#dctclitable").hide();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_Clients", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
      } else if (this.value == 0) {
        $("#dctclitable").show();
        $('#clientisactive').hide();
        $("#abc").hide();
        $("#efg").hide();
        $("#clitable").hide();
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
      
      <div style={{ position: "fixed", width: "85%", marginLeft: 250 }}>
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
        <Row><Col span={2}></Col>
          <Col span={4}><Link to="/Configuration/Client" disabled><Button style={{ width: 130 }} type="primary">Client</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Project"><Button style={{ width: 130 }}>Project</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Designation"><Button style={{ width: 130 }}>Job Title</Button></Link></Col>
          <Col span={4} stylw={{ marginLeft: 10 }}><Link to="/Configuration/EmployeeType"><Button style={{ width: 130 }}>Employee Type</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/HrInfo" ><Button style={{ width: 130 }} >HR Contact Info</Button></Link></Col><Col span={2}></Col>
        </Row><Card className="table_border_antd" style={{ width: 1000, borderTopColor: "blue", borderLeftColor: "black", borderRightColor: "black", borderBottomColor: "black", borderTopWidth: 5, position: "fixed" }}>
          <h1 style={{ marginLeft: 50, color: "blue", fontSize: 30 }}><b>Client</b></h1>
          <div style={{ marginLeft: 150, width: 600, marginTop: -30 }}>
            <Space direction="Horizantal" style={{ marginTop: 10 }}>

              <div id="abc" style={{ position: "fixed" }}>
                <Input
                  type="text"
                  placeholder="Search here...."
                  className="w-25% form-control"
                  title="Search"
                  value={search}
                  suffix={<SearchOutlined />}
                  style={{ width: 150 }}
                  onChange={(e) => setSearch(e.target.value)} /></div>
              <p style={{ fontWeight: "bold", fontSize: 20, position: "fixed", marginLeft: 150 }}>Active:</p>
              <select id="validcli" title="Select a State" style={{ width: 70, height: 30, position: "fixed", marginLeft: 220 }}>
                <option disabled>-Select One-</option>
                <option value={1} selected="selector">Yes</option>
                <option value={0}>No</option>
              </select>
              <div id="clientisactive" style={{ marginLeft: 280, paddingLeft: '5%', display: 'inline' }}>
                <Button
                  hidden={!hasSelected}
                  type="danger"
                  title="Deactivate"
                  onClick={showDeactivateModal}
                  icon={<CloseCircleOutlined />}
                >
                  Deactivate
                </Button>
                <div style={{ marginTop: "-8%", marginLeft: "115%", }}>
                  <Button style={{ position: 'fixed' }} type="primary" icon={<EditOutlined />} title="Edit"
                    hidden={!hassSelect}

                    onClick={() => {
                      onEdit();
                    }} >EDIT</Button>
                </div>
              </div>

            </Space>

            {/* <div style={{ marginLeft: 20 }}>
                <Button type="primary" icon={<EditOutlined />} title="Edit"
                  hidden={!hassSelect}
                  
                  onClick={() => {
                    onEdit();
                  }} >EDIT</Button>
              </div> */}

            <div id="clitable" style={{ marginTop: 30 }}>
              <Table
                columns={clientDtlColumns}
                dataSource={filteredClient}
                rowKey={record => record.client_Id}
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
            <Button id="efg"
              type="link" rowKey="id"
              icon={<PlusCircleOutlined />}
              onClick={showAddData}
              style={{ marginLeft: 500, fontWeight: 'bolder', fontSize: 20 }}>ADD</Button>
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
            title={[<Space><h2 style={{ color: "blue" }}><b>Edit</b></h2><Button style={{ marginLeft: 620, marginTop: -20, fontSize: 20 }} type="link" onClick={resetEditing}>X</Button></Space>]}
            width={750}
            closable={false}
            footer={false}
          >
            <Form
              form={editForm}
              onFinish={(e) => handleEdit(e)}
            >
              <Row>
                <Col span={5}>
                  <p style={{ fontWeight: "bold" }}>Client ID</p>
                </Col>
                <Col span={1}></Col>
                <Col span={5}>
                  <p style={{ marginLeft: 10, fontWeight: "bold" }}>Client Name:</p>
                </Col>
                <Col span={1}></Col>
              </Row>

              <Row>
                <Col span={5}>
                  <Form.Item
                    name='client_Id'
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={5}>
                  <Form.Item
                    name='client_Name'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Client Name!'
                      },
                      {
                        pattern: new RegExp(/^[a-zA-Z0-9 ]+$/i),
                        message: 'field accept only letters'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
              </Row>
              <Form.Item>
                <Space>
                  <Button type="danger" style={{ marginLeft: 470, marginBotton: -20 }} onClick={resetEditing}>Cancel</Button>
                  <Button type="success" htmlType="submit">Save Changes</Button></Space>
              </Form.Item>
            </Form>
          </Modal>
          <Modal visible={isConfirmModalVisible}
            onOk={handleConfirmOk}
            onCancel={handleConfirmCancel}
            footer={[
              <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
              <Button type='primary' onClick={handleConfirmCancel}>No</Button>
            ]}>
            <h2 className="edt">Are you sure want to Deactivate the Client?</h2>
          </Modal>
          <div id="dctclitable">
            <Readdeactivated />
          </div></Card></div>
    </>
  )
}
export default ClientRead;