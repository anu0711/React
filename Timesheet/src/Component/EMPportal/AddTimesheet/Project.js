import React, { useEffect, useState } from 'react'
import Select from "react-select";

function Project(props) {

    const [project, setProject] = useState([]);
    useEffect(() => {
        setProject(props.ProjectOption);
    }, []);


    const onProjectSelect = (value) => {
        const row = props.row;

        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.project = value.value;
        props.onSaveData(dataSource);
        props.setProject(project[0].project_Id);
    }

    return (
        <Select
            styles={{ width: "100%" }}
            isDisabled={props.row.status.toLowerCase() === 'holiday' || props.row.status.toLowerCase() === 'leave' ? true : false}
            isSearchable={false}
            options={project}
            onChange={(value) => onProjectSelect(value)}
            defaultValue={project.filter((a) => a.value === props.row.project)[0]}
        />
    )
}
export default Project