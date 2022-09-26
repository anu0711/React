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
        props.onSaveData(dataSource);
        if (row.key > 99)
            props.onDeleteRow(row);
    }

    return (
        <Select
            isSearchable={false}
            styles={{ width: "100%" }}
            onChange={(value) => onStatusSelect(value)}
            options={status_options}
            defaultValue={status_options.filter((a) => a.value == props.defaultValue)[0]}
        />
    )
}

export default Status