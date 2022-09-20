import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Button, Form, Modal, Col, Row, Card, Table, message, Layout, Popover } from "antd";
import { Checkbox, Label } from 'semantic-ui-react';
import { PlusCircleOutlined, EditOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Readdeactivated from "./Readdeactivated";
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


function ReadJob() {

  // function refreshPage() {

  //   setTimeout(() => {

  //     // window.location.reload(false);

  //   }, 5000);

  //   console.log('page to reload')

  // }


  const [deactivate, setDeactivate] = useState(false);
  const [isActivateModal, setIsActivateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toggleActivate, setToggleActivate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { Sider, Content } = Layout;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [addedClient, setAddedClient] = useState({ "designation_Name": "", "is_Active": true });
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const navigate = useNavigate();
  const navig = () => {
    navigate("/#");
  }
  const [pagination, setPagination] = useState({
    pageSize: 5,
  });
  const toke = sessionStorage.getItem("token");
  const setMessage = (statusCode, responseMessage) => {
    console.log(statusCode);
    debugger
    if (statusCode == 200) {
      message.success({
        content: responseMessage,
        style: {
          marginLeft: 600,
          width: 300
        }
      });
    }

    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else if (statusCode == 400) {
      message.error(responseMessage);
    }
    else if (statusCode == 500) {
      message.error("Internal Server Error");
    }
    else {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation", {
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

      title: 'S.No',
      render: (value, item, index) => (page - 1) * 5 + index + 1,
      dataIndex: 'colid',
    },
    {
      title: 'Designations',
      dataIndex: 'designation_Name',
    },
    {
      title: 'No of employees',
      dataIndex: 'no_of_Employees',
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
    const [designation_Name, setDesignation_Name] = useState('');

    const addDesignation_Name = (designation_Name) => {
      addedClient["designation_Name"] = designation_Name;
      setAddedClient(addedClient);
      setDesignation_Name(designation_Name);
    }

    return (
      <div>
        <Form form={form} layout="vertical" name="form_in_modal">
          <h2 className="add">ADD Designation</h2>
          <Row>
            <Col span={10}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Designation Name:</p>
            </Col>
            <Col span={1}></Col>
            <Col span={10}>
              <Form.Item name="designation_Name " rules={[{ required: true, message: 'Please enter the Name' }, {
                pattern: new RegExp(/^[a-zA-Z ]+$/i),
                message: "field does not accept numbers"
              }]}>
                <Input type='text' id='designation_Name' value={designation_Name}
                  onChange={(e) => addDesignation_Name(e.target.value)}
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
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Add_Designation',
      data: addedClient
    }).then((r) => {
      console.log(r);
      setMessage(r.request.status, addedClient.designation_Name + " - Added Successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredClient(data.data))
    }).catch((error) => {
      setMessage(error.request.status, error.response.data);
    })
  }

  const onEdit = (record) => {
    setIsEditing(true);
    setEdtCli(record);
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEdtCli([]);
  };

  const EditProjects = (dtl) => {

    const [designationedit] = Form.useForm();

    designationedit.setFieldsValue({

      designation_Id: selectedRows[0].designation_Id,
      designation_Name: selectedRows[0].designation_Name
    })

    const designationsubmit = async (e) => {

      console.log(e);
      debugger;

      const data = await axios({

        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': `Bearer ${toke}`
        },
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/Edit_Designation',
        data: {
          designation_Id: e.designation_Id,
          designation_Name: e.designation_Name
        }

      }).then((r) => {




        setIsEditing(false);

        debugger
        setMessage(r.request.status, e.designation_Name + " - " + "Updated Successfully");

        debugger

        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
        const timout1 = setTimeout(() => {
          window.location.reload();
        }, 1100);

        return () => clearTimeout(timout1);
      }).catch((error) => {

        setMessage(error.request.status, error.response.data);
        console.log(error.request.status, error.response.data)
        debugger
      })
    }


    return (
      <>
        <Form
          form={designationedit}
          onFinish={(e) => designationsubmit(e)}
        >
          <Form.Item style={{ marginLeft: 10 }}
            label='Designation ID'
            name='designation_Id'
          >
            <Input style={{ marginLeft: "27px", width: "60px" }} disabled />
          </Form.Item>
          <Form.Item
            label='Designation Name'
            name='designation_Name'
            rules={[
              {
                required: true,
                message: 'Please input your designation Name!'
              },
              {
                pattern: new RegExp(/^[a-zA-Z ]+$/i),
                message: 'field does not accept numbers'
              }
            ]}
          >
            <Input style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item >
            <Button htmlType="submit" style={{ backgroundColor: "lightgreen" }}>Save Changes</Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const hassSelected = selectedRows.length == 1;
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
    setIsConfirmModalVisible(false);
    var activateDesignation = '';

    selectedRows.forEach(element => {
      axios({
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': `Bearer ${toke}`
        },
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditDesignationIsActive',
        data: {
          id: element.designation_Id,
          is_Active: false
        },
      }).then((r) => {
        clientdtl();

        $('#jobisactive');

        if (page == 1) {

          setPage(page);

        }

        else {

          setPage(page - 1);

        }
        // debugger
        //setMessage(r.request.status, element.designation_Name + "- Deactivated Successfully");
        // debugger


        window.location.reload();
        //$('#jobisactive').hide();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation")
          .then(data => setFilteredClient(data.data));
      })
      activateDesignation = activateDesignation + element.designation_Name + ', ';
    });
    //window.location.reload();
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation + " Deactivated Successfully");
    debugger
    setIsActivateModal(false);
    setToggleActivate(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    rowSelection = ''
    setIsConfirmModalVisible(false);

    const timeout1 = setTimeout(() => {
      window.location.reload();
    }, 1500);
    return () => clearTimeout(timeout1);
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.designation_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])


  $("#dctjobtable").hide();
  $(document).ready(function () {
    $('#validdsn').on('change', function () {
      if (this.value == 1) {
        $("#destable").show();
        $("#src").show();
        $("#add").show();
        $('#jobisactive').show();
        $("#dctjobtable").hide();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllDesignation")
          .then(data => setFilteredClient(data.data))
      } else if (this.value == 0) {
        $("#dctjobtable").show();
        $('#jobisactive').hide();
        $("#src").hide();
        $("#add").hide();
        $("#destable").hide();
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
          <Col span={4}><Link to="/Configuration/Client"><Button style={{ width: 130 }}>Client</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Project"><Button style={{ width: 130 }}>Project</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Designation" disabled><Button style={{ width: 130 }} type="primary">Job Title</Button></Link></Col>
          <Col span={4} stylw={{ marginLeft: 10 }}><Link to="/Configuration/EmployeeType"><Button style={{ width: 130 }}>Employee Type</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/HrInfo" ><Button style={{ width: 130 }} >HR Contact Info</Button></Link></Col><Col span={2}></Col>
        </Row><Card className="table_border_antd" style={{ width: 1000, borderTopColor: "blue", borderLeftColor: "black", borderRightColor: "black", borderBottomColor: "black", borderTopWidth: 5, position: "fixed" }}>
          <h1 style={{ marginLeft: 100, color: "blue", fontSize: 30 }}><p><b>Job Title</b></p></h1>
          <div style={{ marginLeft: 200, width: 600, marginTop: -30 }}>
            <Space direction="Horizantal" style={{ marginTop: 10 }}>
              <div id="src" style={{ position: "fixed" }}>
                <Input
                  type="text"
                  placeholder="Search here...."
                  className="w-25% form-control"
                  suffix={<SearchOutlined />}
                  value={search}
                  style={{ width: 150 }}
                  onChange={(e) => setSearch(e.target.value)} /></div>
              <p style={{ fontWeight: "bold", fontSize: 20, position: "fixed", marginLeft: 210 }}>Active:</p>
              <select id="validdsn" style={{ width: 70, height: 30, position: "fixed", marginLeft: 280 }}>
                <option disabled>-Select One-</option>
                <option value={1} selected="selector">Yes</option>
                <option value={0}>No</option>
              </select>
              <div id="jobisactive" style={{ marginLeft: 320, position: "fixed", paddingLeft: '5%', display: 'inline' }}>
                <Button
                  hidden={!hasSelected}
                  type="danger"
                  onClick={showDeactivateModal}
                  icon={<CloseCircleOutlined />}
                >
                  Deactivate
                </Button>
                <div style={{ marginTop: "-27%", marginLeft: "115%" }}>
                  <Button type="primary" icon={<EditOutlined />} title="Edit"

                    hidden={!hassSelected}

                    onClick={() => {



                      onEdit();

                    }}

                  >EDIT</Button>

                </div>

              </div>

            </Space>
            <div id="destable" style={{ marginTop: 30 }}>
              <Table
                columns={clientDtlColumns}
                dataSource={filteredClient}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize)
                  }
                }}
                rowKey={record => record.designation_Id}
                rowSelection={{
                  type: Checkbox,
                  ...rowSelection,
                }}
                size="small"
                bordered
                scroll={{
                  y: 150
                }}
              /></div>
            <Button id="add"
              type="link" rowKey="id"
              icon={<PlusCircleOutlined />}
              onClick={showAddData}
              style={{ marginLeft: 360, fontWeight: 'bolder', fontSize: 20 }}>ADD</Button>
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
                <Button
                  type="danger"
                  onClick={buttonCancel}
                >Cancel</Button>,
                <Button
                  type="primary"
                  onClick={() => {
                    form.validateFields().then((values) => {
                      buttonOk(values)
                      form.resetFields();
                    })
                      .catch((info) => {
                        console.log('validate Field:', info);
                      });
                  }}
                >ok</Button>
              ]}
            >
              <AddClient />
            </Modal>
          </div>
          <Modal
            visible={isEditing}

            onCancel={() => {
              resetEditing()
            }}
            footer={null}
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
            <h2 className="edt">Are you sure want to Deactivate the <br></br>Designation?</h2>
          </Modal>

          <div id="dctjobtable">
            <Readdeactivated />
          </div></Card></div>
    </>
  )
}
export default ReadJob;