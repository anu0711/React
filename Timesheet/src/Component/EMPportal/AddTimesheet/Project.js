import React, { useEffect, useState } from 'react'
import Select from "react-select";
import axios from 'axios';

function Project(props) {

    const toke = sessionStorage.getItem("token");
    const [project, setProject] = useState([]);
    const [projectOption, setProjectOption] = useState([]);
    useEffect(() => {
        axios.get("https://timesheetjy.azurewebsites.net/api/Employee/GetAllProjects", {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        }).then(r => setProject(r.data));
        assignOptions();
    }, []);

    const assignOptions = () => {
        project.forEach(element => {
            projectOption.push({
                value: element.project_Id,
                label: element.project_Name
            });
        });
        setProject([...projectOption]);
        debugger;
    }


    const onProjectSelect = (value) => {
        const row = props.row;
        console.log(row);
        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.project = value;
        console.log(filteredColumn);
        console.log(dataSource);
        props.onSaveData(dataSource);
        props.setProject(project[0].project_Id);
    }

    return (
        // <Select
        //     // menuPortal: base => ({ ...base, zIndex: 9999 })
        //     // style={{ width: '100%' }}
        //     menuPortalTarget={document.body}
        //     styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        //     defaultValue={props.row.project}
        //     onChange={(value) => onProjectSelect(value)}
        //     disabled={props.row.status.toLowerCase() === 'holiday' || props.row.status.toLowerCase() === 'leave' ? true : false}
        // >
        //     {
        //         project.map(opt => (
        //             <Select.Option value={opt.project_Id}>{opt.project_Name}</Select.Option>
        //         ))
        //     }
        // </Select>
        <Select
            isDisabled={props.row.status.toLowerCase() === 'holiday' || props.row.status.toLowerCase() === 'leave' ? true : false}
            isSearchable={false}
            option={project.map(element => ({ value: element.project_Id, label: element.project_Name }))}
        />
    )
}
export default Project