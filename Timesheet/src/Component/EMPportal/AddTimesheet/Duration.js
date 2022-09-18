import React, { useState, useEffect } from 'react'
import { Input } from 'antd'

function Duration(props) {

    const [value, setValue] = useState();

    useEffect(() => {
        setValue(props.defaultValue);
    }, [])


    const onDuration = (value) => {
        const row = props.row;
        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.duration = value;
        props.onSaveData(dataSource);
    }

    const maxLengthCheck = (e) => {
        console.log(e);
        if (Number(e.targer.value) > Number(e.targer.max)) {
            e.target.value = e.targer.value.splice(0, e.target.value-1);
        }
    }

    return (
        <Input
            type='number'
            defaultValue={props.row.defaultValue}
            onChange={(e) => onDuration(e.target.value)}
            onInput={maxLengthCheck}
            onKeyDown={(evt) => {
                evt.key === 'e' && evt.preventDefault();
                evt.key === '-' && evt.preventDefault();
            }}
            max={'24'}
            min={0}
            disabled={props.row.status.toLowerCase() === 'leave' || props.row.status.toLowerCase() === 'holiday' ? true : false}
        />
    )
}

export default Duration