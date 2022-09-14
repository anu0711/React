import React, { useState, useEffect } from 'react'
import { Input } from 'antd'

function Duration(props) {

    const [value, setValue] = useState();

    useEffect(() => {
        setValue(props.defaultValue);
    }, [])


    const onDuration = (value) => {
        setValue(value);
        const row = props.row;
        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.duration = value;
        props.onSaveData(dataSource);
    }

    return (
        <Input
            // ref={props.defaultValue === 0 ? 0 : props.defaultValue}
            value={value}
            type='number'
            defaultValue={props.row.defaultValue}
            onChange={(e) => onDuration(e.target.value)}
            onKeyDown={(evt) => {
                evt.key === 'e' && evt.preventDefault();
                evt.key === '-' && evt.preventDefault();
            }}
            max={24}
            disabled={props.row.status.toLowerCase() === 'leave' || props.row.status.toLowerCase() === 'holiday' ? true : false}
        />
    )
}

export default Duration
