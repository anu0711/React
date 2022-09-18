import React, { useState } from 'react'
import Select from 'react-select';

function Status(props) {
    const [status, setStatus] = useState('');
    const status_options = [
        { value: "Present", label: "Present", key: "Present" },
        { value: "Leave", label: "Leave", key: "Leave" },
        { value: "WFH", label: "WFH", key: "WFH" },
        { label: "Holiday", value: "Holiday", key: "Holiday" }
    ];

    const onStatusSelect = (value) => {
        setStatus(value.value)
        const row = props.row;
        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.status = value.value;
        filteredColumn.duration = 0;
        props.onSaveData(dataSource);
        if (value.value.toLowerCase() == "leave" || value.value.toLowerCase() == "holiday") {
            if (row.key > 99)
                props.onDeleteRow(row);
        }
    }

    return (
        // <Select
        //     style={{ width: '100%', menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        //     onChange={(value) => onStatusSelect(value)}
        //     defaultValue={props.defaultValue}
        // >
        //     {
        //         status_options.map((status) => (
        //             <Select.Option value={status.value}>{status.label}</Select.Option>
        //         ))
        //     }
        // </Select>
        <Select
            isSearchable={false}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            onChange={(value) => onStatusSelect(value)}
            options={status_options}
            defaultValue={status_options.filter((a) => a.value == props.defaultValue)[0]}
        />
    )
}

export default Status