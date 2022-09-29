import { VictoryPie } from "victory-pie";
import { VictoryLegend } from "victory-legend";
import axios from "axios";
import { Layout, Card, Col, Space, Select, Divider, Button, Popover } from 'antd';
import { useState, useEffect, React } from 'react';
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const { Option } = Select;
const { Sider, Content } = Layout;

const Dashboard = (props) => {

  const [timesheetStatus, setTimesheetStatus] = useState([]);
  const [colorScale, setColorScale] = useState([]);
  // const currentDate = new Date();
  const [year, setYear] = useState((new Date().getFullYear()));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  if(!sessionStorage.token){
    debugger
    navigate("/#");
    debugger
}

  const monthOption = [];
  const month_name = [
    { month: '', id: '' },
    { month: "Jan", id: 1 },
    { month: "Feb", id: 2 },
    { month: "Mar", id: 3 },
    { month: "Apr", id: 4 },
    { month: "May", id: 5 },
    { month: "Jun", id: 6 },
    { month: "Jul", id: 7 },
    { month: "Aug", id: 8 },
    { month: "Sep", id: 9 },
    { month: "Oct", id: 10 },
    { month: "Nov", id: 11 },
    { month: "Dec", id: 12 }
  ];
  const currentMonth = new Date().getMonth();
  for (let i = 1; i < currentMonth + 2; i++) {
    monthOption.push({ id: i, month_name: month_name[i].month });
  }
  const navig = () => {
    navigate("/#");
  }
  const toke = sessionStorage.getItem("token");
  const [yrDropdown, setYrDropdown] = useState([]);
  const dphrs = async () => {
    const details1 = await axios.get("https://timesheetjy.azurewebsites.net/api/Admin/GetTimeSheets", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setYrDropdown(details1.data);
  }
  useEffect(() => {
    dphrs();
  }, []);

  useEffect(() => {
    const empdtl = axios({
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: `https://timesheetjy.azurewebsites.net/api/Admin/GetbyDashboard?year=${parseInt(year)}&month_id=${parseInt(month)}`,
    }).then((response) => {
      var appCnt = 0, penCnt = 0, rejCnt = 0;
      if (response.data.length > 0) {
        const data = response.data;
        const scale = [];
        data.forEach(element => {
          if (element.x.toLowerCase() == 'approved') {
            appCnt = element.y;
            scale.push('blue')

          } else if (element.x.toLowerCase() == 'pending') {
            penCnt = element.y;
            scale.push('rgb(233, 127, 41)')
          } else if (element.x.toLowerCase() == 'rejected') {
            rejCnt = element.y;
            scale.push('rgba(119, 136, 153, 0.849)')
          }

        });
        setCount(appCnt + penCnt + rejCnt);
        setColorScale(scale);

        setTimesheetStatus(data);
        console.log(response.data);


      }
      else {
        const data = [
          { x: " ", y: 0 },
          { x: " ", y: 0 },
          { x: " ", y: 0 },
        ];
        setCount(0);
        setTimesheetStatus(data);
        console.log(response.data);
      }
    });
  }, [year, month,]);

  useEffect(() => {
    const empdtl = axios({
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: `https://timesheetjy.azurewebsites.net/api/Admin/GetbyDashboard?year=${parseInt(year)}&month_id=${parseInt(month)}`,
    }).then((response) => {
      var appCnt = 0;
      var penCnt = 0;
      var rejCnt = 0;
      if (response.data.length > 0) {
        const data = response.data;
        const scale = [];
        data.forEach(element => {

          if (element.x.toLowerCase() == 'approved') {
            appCnt = element.y;
            scale.push('blue')
          } else if (element.x.toLowerCase() == 'pending') {
            penCnt = element.y
            scale.push('rgb(233, 127, 41)')
          } else if (element.x.toLowerCase() == 'rejected') {
            rejCnt = element.y
            scale.push('rgba(119, 136, 153, 0.849)')
          }
        });
        setCount(appCnt + penCnt + rejCnt);
        setColorScale(scale);

        setTimesheetStatus(data);
        console.log(response.data);
      }
      else {
        const data = [
          { x: " ", y: 0 },
          { x: " ", y: 0 },
          { x: " ", y: 0 },
        ];
        setTimesheetStatus(data);
        console.log(response.data);
      }
    });

  }, []);


  return (
    <div style={{ backgroundColor: "white", marginTop: 0 }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "150%", backgroundColor: "deepblue",  marginTop: -100, }}>
        <Button type="primary" style={{ width: 160, margin: "5 10%", height: 50, marginTop: 20, marginLeft: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><br /><br /><Button style={{ margin: "5 10%", width: 160, height: 50, marginLeft: 20 }}>
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
      <div style={{ width: 750, height: 600, marginLeft: 150, marginTop: -100, backgroundColor: "white" }}>
        <Layout>
          <Space direction="horizontal">
            <Space direction="horizantal">
              <div style={{ marginTop: "30px", marginLeft: "60px", padding: 70, position: "fixed" }}>
                {/* <Link to="/timesheet/month/view" state={{ year: year, month: month }}> */}
                  <Button style={{
                    marginLeft: 10,
                    marginTop: 85,
                    width: '210px',
                    height: '310px',
                    border: "2.5px solid black",
                    borderRadius: '50%',
                    fontSize: '28px',
                    color: 'red',
                    fontWeight: 'bold',
                    lineHeight: '50px',
                    textAlign: 'center',
                    background: 'lightskyblue'
                  }}
                    variant="contained" color="secondary">
                    {count} Employees
                  </Button> 
                  {/* </Link> */}

              </div>
            </Space>

            <Space>
              <div class="Year" style={{ position: "fixed", margin: "65px 0px 0px 500px" }}>

                <Select value={year} onChange={(value) => { setYear(value) }} style={{ width: 76, border: "1.5px solid black" }} placeholder="Year">
                  {(yrDropdown && yrDropdown.length > 0) && yrDropdown.map((hpDown) => {
                    return <Select.Option value={hpDown.year}>
                      {hpDown.year}</Select.Option>
                  })}
                </Select>
              </div>


              <div class="Month" style={{ margin: "65px 0px 0px 590px", position: "fixed" }}>

                {/* <Select  value = {month} onChange={(value) => { setMonth(value) }} style={{ width: 73,border: "1.5px solid black"}}  placeholder="Month">
                              {(monDropdown && monDropdown.length > 0) && monDropdown.map((hpDownn) => {
                                return <Select.Option value={hpDownn.monthID}>
                                  {hpDownn.month}</Select.Option>
                              })}
                            </Select> */}
                <Select value={month} onChange={setMonth} style={{ width: 73, border: "1.5px solid black" }} placeholder="Month">
                  {monthOption.map(opt => (<Option value={opt.id}>{opt.month_name}</Option>))}
                </Select>
              </div>
            </Space>
            <div style={{ position: "fixed", border: "2px solid black", marginTop: 120, marginLeft: 430 }}>
              <div id="ef">
                <h1 id="xy" style={{ color: 'lightskyblue', }}>Timesheet {month} - {year} status</h1>
                <div style={{ marginTop: -50, marginLeft: 10 }}>
                  <VictoryPie
                    data={timesheetStatus}

                    style={{
                      data: {
                        stroke: "white", strokeWidth: 1
                      },
                      labels: { fontSize: 18, fill: "white" }

                    }}
                    labels={({ datum }) => datum.y}
                    labelRadius={53}
                    colorScale={colorScale}
                    radius={145}
                  /></div>
                <div style={{ marginTop: -30 }} id="ij">
                  <h2 id="ab" style={{ color: 'lightskyblue', marginLeft: 50 }}>Sent : {count} </h2>

                </div>
              </div>
            </div>

          </Space>

        </Layout>
        <div style={{ position: "fixed",width:600, marginTop: 420, marginLeft: 870 }}>
          <VictoryLegend x={0} y={0}

            orientation="vertical"
            gutter={0}
            style={{ border: { stroke: "white" } }}
            data={[
              { name: "Approved", symbol: { fill: "blue", type: "square" } },
              { name: "Pending", symbol: { fill: "rgb(233, 127, 41)", type: "square" } },
              { name: "Rejected", symbol: { fill: "rgba(119, 136, 153, 0.849)", type: "square" } },

            ]}

          />
        </div>
      </div>
    </div>

  );

};

export default Dashboard;
