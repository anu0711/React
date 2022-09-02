import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Row, Col, Modal, Table, message, Space } from "antd";
import { Checkbox } from 'semantic-ui-react';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';

function Readdeactivated() {


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const toke = sessionStorage.getItem("token");
  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 5,
  });
  const setMessage = (statusCode, responseMessage) => {
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
      message.error("Error, " + responseMessage);
    }
    else if (statusCode == 500) {
      message.error("Internal Server Error");
    }
    else {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetEmployeetypeIs_Active", {
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
      title: 'Employee Type',
      dataIndex: 'employee_Type_Name',
    },
    {
      title: 'No of employees',
      dataIndex: 'no_of_Employees',
    },

  ];

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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditEmployeetypeIsActive',
        data: {
          id: element.employee_Type_Id,
          is_Active: true
        },     
      }).then((r) => {
        setMessage(r.request.status, element.employee_Type_Name + " - Activated Successfully");

        // const timeout = setTimeout(() => {
        //   //console.log('hii after 2 seconds');
        //   window.location.reload();
        // }, 1500);

        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetEmployeetypeIs_Active", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data));
        //return () => clearTimeout(timeout);
      })
    });
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.employee_Type_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])


  return (
    <>
      <div style={{ marginLeft: 200, width: 600 }}>
        <Space direction="horizantal">
          <div style={{ marginTop: -5 }}>
            <Input
              type="text"
              suffix={<SearchOutlined />}
              placeholder="Search here...."
              className="w-25% form-control"
              value={search}
              style={{ width: 150 }}
              onChange={(e) => setSearch(e.target.value)} /></div>
          <div style={{ marginLeft: 270, marginTop: -9, position: "fixed" }}>
            <Button
              hidden={!hasSelected}
              type="primary"
              onClick={showDeactivateModal}
              icon={<CheckCircleOutlined />}
            >
              Activate
            </Button></div></Space>

        <div style={{ marginTop: 1 }}>
          <Table
            columns={clientDtlColumns}
            dataSource={filteredClient}
            rowKey={record => record.employee_Type_Id}
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
          />
          <Modal
            visible={isConfirmModalVisible}
            onOk={handleConfirmOk}
            onCancel={handleConfirmCancel}
            footer={[
              <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
              <Button type='primary' onClick={handleConfirmCancel}>No</Button>
            ]}
          >
            <h2 className="edt">Are you sure want to Activate the Employee Type?</h2>
          </Modal>
        </div>
      </div>

    </>
  )


};
export default Readdeactivated;