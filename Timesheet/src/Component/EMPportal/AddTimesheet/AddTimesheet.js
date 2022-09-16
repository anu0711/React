import { Modal, Space, Table, Card, Popover } from 'antd';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Select, Input, Button, message, Layout } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import './AddTimesheet.css';
import Project from './Project';
import Status from './Status';
import Duration from './Duration';
import UploadImage from './UploadImage';
import UploadApTimesheet from './UploadApTimesheet';

const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
        message.success(responseMessage);
    }
    else if (statusCode == 404) {
        message.error(responseMessage);
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

function AddTimesheet() {
    const navigate = useNavigate();
    const navig = () => {
        navigate("/#");
    }
    const employee_Id=sessionStorage.id;
    debugger;
    const month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modal, setModal] = useState(false);
    const [project, setProject] = useState([]);
    const currentDate = new Date();
    const { Sider } = Layout;
    const [state1, setState1] = useState([])
    const [state2, setState2] = useState([])
    const [state3, setState3] = useState([])
    const month = currentDate.getMonth() - 1;
    const year = currentDate.getFullYear();
    const Day_list = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const noOfDays = new Date(year, month + 1, 0).getDate();
    var [data, SetData] = useState([]);
    for (let i = 1; i <= noOfDays; i++) {
        data.push({
            key: i,
            date: format(new Date(year, month, i), 'yyyy-MM-dd'),
            day: Day_list[new Date(year, month, i).getDay()],
            status: Day_list[new Date(year, month, i).getDay()].toLowerCase() === 'saturday' || Day_list[new Date(year, month, i).getDay()].toLowerCase() === 'sunday' ? "Holiday" : "",
            project: "",
            duration: null,
            count: 2
        });
    }

    const [currentState, setCurrentState] = useState(data);
    const [daysWorked, setDaysWorked] = useState(0);
    const [leavesTaken, setLeavesTaken] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        var count = 0;
        currentState.forEach(element => {
            if (element.status === '') {
                count += 1;
            }
            if (element.project == "") {
                count += 1;
            }
            if ((element.duration === 0 || element.duration === null)) {
                count += 1;
            }
            if ((element.status === "Leave" || element.status === "Holiday") && element.project === "" && (element.duration === 0 || element.duration === null)) {
                count -= 2;
            }
        });
        console.log(currentState);
        if (count === 0) {
            setIsDisabled(false);
        }
        if (count > 0) {
            setIsDisabled(true);
        }
    }, [currentState]);

    useEffect(() => {
        calculateAttendance();
        calculateTotalDuration();
    }, [currentState]);



    const columns = [
        {
            key: "date",
            title: (<h4><b>Date</b></h4>),
            dataIndex: "date",
        },
        {
            key: "day",
            title: (<h4><b>Day</b></h4>),
            dataIndex: "day",
        },
        {
            key: "status",
            title: (<h4><b>Status</b></h4>),
            dataIndex: 'status',
            render: (_, record) => (
                <Status
                    allRecord={currentState}
                    defaultValue={record.status}
                    row={record}
                    onSaveData={saveCurrentState}
                    onDeleteRow={onDeleteRow}
                />
            )
        },
        {
            key: "project",
            title: (<h4><b>Project</b></h4>),
            dataIndex: 'project',
            render: (_, record) => (
                <Project
                    allRecord={currentState}
                    row={record}
                    onSaveData={saveCurrentState}
                    setProject={setProject}
                />
            )
        },
        {
            key: "duration",
            title: (<h4><b>Duration</b></h4>),
            dataIndex: "duration",
            render: (_, record) => (
                <Duration
                    defaultValue={record.duration}
                    row={record}
                    allRecord={currentState}
                    onSaveData={saveCurrentState}
                />
            )
        },
        {
            key: "action",
            title: (<h4><b>Action</b></h4>),
            render: row => (
                <>
                    <Space>

                        {
                            row.key <= noOfDays ?
                                <Button
                                    type='info'
                                    onClick={() => onAddProject(row)}
                                    disabled={row.status.toLowerCase() === 'leave' || row.status.toLowerCase() === 'holiday' || row.count === 0 ? true : false}
                                >
                                    Add Project</Button>
                                :
                                <Button
                                    type='danger'
                                    style={{ width: "6.5rem" }}
                                    onClick={() => onDeleteRow(row)}
                                    disabled={row.status.toLowerCase() === 'leave' || row.status.toLowerCase() === 'holiday' ? true : false}
                                >Delete</Button>
                        }

                    </Space>
                </>
            )
        }
    ];
    const columns_summary = [
        {
            key: "summary_date",
            title: (<h4><b>Date</b></h4>),
            render: () => <Input
                value={format(new Date(), 'dd-MM-yyyy')}
                readOnly={true}
            />
        },
        {
            key: "no_of_days_worked",
            title: (<h4><b>No of Days Worked</b></h4>),
            dataIndex: 'no_of_days_worked'
        },
        {
            key: "no_of_leaves_taken",
            title: (<h4><b>No of Leaves Taken</b></h4>),
            dataIndex: 'no_of_leaves_taken'
        },
        {
            key: "no_of_leaves_taken",
            title: (<h4><b>Total Duration(hrs)</b></h4>),
            dataIndex: 'total_duration'
        }
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const saveCurrentState = (newRecord) => {
        var presentState = [...newRecord];
        console.log(presentState);
        setCurrentState(presentState);
    }

    const summary_data = [
        {
            key: "summary_data1",
            no_of_days_worked: daysWorked,
            no_of_leaves_taken: leavesTaken,
            total_duration: totalDuration
        }
    ];

    const onAddProject = (row) => {

        var filteredColumn = currentState.filter(a => a.key == row.key)[0];
        filteredColumn.count -= 1;

        const newRecord = {
            key: Math.random() + 100,
            date: row.date,
            day: row.day,
            status: row.status === '' ?
                row.day.toLowerCase() === 'saturday' || row.day.toLowerCase() === 'sunday' ? "Holiday" : '' : row.status,
            project: row.project,
            duration: Number(0),
        }

        const newState = [...currentState];
        const index = currentState.indexOf(row);
        newState.splice(index + 1, 0, newRecord);
        setCurrentState(newState);
    }

    const onDeleteRow = (row) => {
        var filteredColumn = currentState.filter(a => a.date == row.date)[0];
        filteredColumn.count += 1;
        const record = [...currentState];
        const index = record.indexOf(row);
        record.splice(index, 1);
        setCurrentState(record);

    }

    const calculateAttendance = () => {
        const newCopy = [...currentState];
        var leave = 0, worked = 0;
        newCopy.forEach(element => {
            if (element.status.toLowerCase() === 'leave' && (element.key < 100)) {
                leave++;
            }
            if ((element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh') && element.key < 100) {
                worked++;
            }
        });
        setLeavesTaken(leave);
        setDaysWorked(worked);
    }

    const calculateTotalDuration = () => {
        var totalHrs = 0;
        currentState.forEach(element => {
            if (element.duration > 0) {
                totalHrs += Number(element.duration);
            }
        });
        setTotalDuration(Number(totalHrs));
    }

    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }))
            )
        },
    });

    const images = files.map((file) => (
        <div>
            <div><img src={file.preview} style={{ width: "200px" }} alt="preview" /></div>
        </div>
    ));

    const uploadApprovedTimesheet = async () => {
        await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/UploadfileAzure/EmployeeUploadImage',
            data: {
                Employee_Id: 23,
                Fiscol_Year_Id: 7,
                year: 2022,
                Images: files
            }
        }).then(async (r) => {
            setMessage(r.status, r.data);
        });
    }

    const downloadXL1 = async () => {
        await axios({
            // https://timesheetjy.azurewebsites.net/api/Employee/ExportExcel?id=1&monthid=8&year=2022&project_id=28
            url: `https://timesheetjy.azurewebsites.net/api/Employee/ExportExcel?id=${92}&monthid=${month + 2}&year=${year}&project_id=${state1[0].project_Id}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Timeheet.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
    const downloadXL2 = async () => {
        await axios({
            url: `https://timesheetjy.azurewebsites.net/api/Employee/ExportExcel?id=${1}&monthid=${month + 1}&year=${year}&project_id=${state2[0].project_Id}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Timeheet.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
    const downloadXL3 = async () => {
        await axios({
            url: `https://timesheetjy.azurewebsites.net/api/Employee/ExportExcel?id=${1}&monthid=${month + 1}&year=${year}&project_id=${state3[0].project_Id}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Timeheet.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    const showModal1 = () => {
        setModal(true);
    }
    const handleOk1 = () => {
        setModal(false);
    }
    const handleCancel1 = () => {
        setModal(false);
    }

    const postData = () => {
        var date, count = 0;

        var newState = [];
        var newState1 = [];
        var newState2 = [];
        var dummystate = [];

        currentState.forEach(element => {
            dummystate.push({
                // project_Id: element.project,
                project_Id: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? element.project : project,
                date: element.date,
                day: element.day,
                leave: element.status.toLowerCase() === 'leave' || element.status.toLowerCase() === 'holiday' ? true : false,
                // duration_in_Hrs: element.duration === null ? parseInt(0) : parseInt(element.duration),
                duration_in_Hrs: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? parseInt(element.duration) : parseInt(0),
                timesheet_summary_Id: 0

            })
            if (date != element.date) {
                newState.push({
                    // project_Id: element.project,
                    project_Id: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? element.project : 0,
                    date: element.date,
                    day: element.day,
                    leave: element.status.toLowerCase() === 'leave' || element.status.toLowerCase() === 'holiday' ? true : false,
                    // duration_in_Hrs: element.duration === null ? parseInt(0) : parseInt(element.duration),
                    duration_in_Hrs: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? parseInt(element.duration) : parseInt(0),
                    timesheet_summary_Id: 0

                })
                date = element.date;
                count = 1;
                return;
            }
            if (date == element.date && count === 1) {
                newState1.push({
                    // project_Id: element.project,
                    project_Id: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? element.project : 0,
                    date: element.date,
                    day: element.day,
                    leave: element.status.toLowerCase() === 'leave' || element.status.toLowerCase() === 'holiday' ? true : false,
                    // duration_in_Hrs: element.duration === null ? parseInt(0) : parseInt(element.duration),
                    duration_in_Hrs: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? parseInt(element.duration) : parseInt(0),
                    timesheet_summary_Id: 0

                })
                date = element.date;
                count = 2;
                return;
            }
            if (date == element.date && count == 2) {
                newState2.push({
                    // project_Id: element.project,
                    project_Id: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? element.project : 0,
                    date: element.date,
                    day: element.day,
                    leave: element.status.toLowerCase() === 'leave' || element.status.toLowerCase() === 'holiday' ? true : false,
                    // duration_in_Hrs: element.duration === null ? parseInt(0) : parseInt(element.duration),
                    duration_in_Hrs: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? parseInt(element.duration) : parseInt(0),
                    timesheet_summary_Id: 0
                })
                date = element.date;
                return;
            }
        });

        setState1(newState);
        setState2(newState1);
        setState3(newState2);

        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Employee/AddTimeSheet',
            data: {
                employee_Id: parseInt(employee_Id),
                fiscalYear_Id: month + 1,
                year: year,
                noOfdays_Worked: summary_data[0].no_of_days_worked,
                noOfLeave_Taken: summary_data[0].no_of_leaves_taken,
                total_Working_Hours: summary_data[0].total_duration,
                addTimesheetDay: dummystate
            }
        })

    }



    return (
        <Space direction='horizantal'>
            <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue", marginTop: -100 }}>
                <Button style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
                    <Link to="/EDashboard">Dashboard</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Etimesheetsummary">Timesheet summary</Link>
                </Button><br /><br /><Button type="primary" style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Eaddtimesheet">Timesheet</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Ehrinfo">HR contact info</Link>
                </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
                    <Link to="/Euserprofile">User Profile</Link>
                </Button><br /><br />
            </Sider>
            <Card style={{ marginLeft: 300 }}>
                <React.Fragment>

                    <h1 style={{ color: 'Blue', paddingLeft: 30 }}><b>{`${month_name[month]}`}-2022 TIMESHEET</b></h1>
                    <div style={{ position: "relative", left: 350, top: -40 }}>

                        <Space>
                            {/* <Button type="primary" onClick={downloadXL}><DownloadOutlined /> Download XL</Button> */}
                            <Button type="primary" onClick={showModal}><UploadOutlined /> Approved Timesheet</Button>
                            <Button type="primary" onClick={showModal1}><UploadOutlined /> Approval Image</Button>
                        </Space>

                        <Popover position="top" content='Logout'>
                            <Button style={{ width: '5em', backgroundColor: '#f77c7c', marginLeft: '3%', marginTop: '5%' }}>
                                <LogoutOutlined onClick={navig} />
                            </Button>
                        </Popover>


                    </div>

                    <div style={{ paddingLeft: '200px' }}>
                        <Space>
                            {
                                state1.length > 1 ?
                                    <Button type="primary" onClick={downloadXL1}><DownloadOutlined /> Download XL1</Button>
                                    : ""
                            }
                            {
                                state2.length > 1 ?
                                    <Button type="primary" onClick={downloadXL2}><DownloadOutlined /> Download XL2</Button> : ""
                            }
                            {
                                state3.length > 1 ?
                                    <Button type="primary" onClick={downloadXL3}><DownloadOutlined /> Download XL3</Button> : ""
                            }
                        </Space>


                    </div>
                    {/* <div style={{marginTop:'-2%',marginLeft:'-15%',marginBottom:'20%'}}>
                    <Popover position="top" content='Logout'>
                <Button style={{width:'5em',backgroundColor:'#f77c7c',marginLeft:'70em',  marginTop:'5%'}}>
                <LogoutOutlined  onClick={navig}   />
                </Button>
                </Popover>

                    </div> */}



                    <Table
                        columns={columns_summary}
                        dataSource={summary_data}
                        pagination={false}
                    />
                    <Table
                        columns={columns}
                        dataSource={currentState}
                        pagination={false}
                    />
                    <div style={{ paddingLeft: '85%', paddingTop: 10 }}>
                        <Button onClick={() => postData()} type="primary" disabled={isDisabled}>Post</Button>
                    </div>

                    <Modal
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button
                                onClick={() => {
                                    setFiles([]);
                                    setIsModalVisible(!isModalVisible);
                                }}
                                type='danger'
                            >
                                cancel</Button>,
                            // <Button
                            //     type='success'
                            //     onClick={uploadApprovedTimesheet}
                            // >Send</Button>
                        ]}
                    >
                        {/* <div>
                            <h3>Upload Approval Timesheet</h3>
                            <h4>Timesheet File</h4>
                        </div> */}
                        <UploadImage />
                        {/* <ImageUpload /> */}
                    </Modal>

                    <Modal
                        visible={modal}
                        onOk={handleOk1}
                        onCancel={handleCancel1}
                        footer={[
                            <Button type='danger' onClick={handleCancel1}>Cancel</Button>
                        ]}
                    >
                        <UploadApTimesheet />

                    </Modal>
                </React.Fragment>
            </Card>
        </Space>
    );
}

export default AddTimesheet