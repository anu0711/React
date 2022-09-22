import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Button } from 'antd';
import axios from 'axios';

const { Dragger } = Upload;

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

const ImageUpload = () => {
    const [files, setFiles] = useState([]);
    const props = {
        name: 'file',
        multiple: true,
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

        // onclick() {
        //     this.action
        // },

        onChange(info) {
            setFiles(info.fileList);
            debugger;
            const { status } = info.file;

            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }

            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },

        onDrop(e) {
            debugger;
            // setFiles(e.tar)
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const uploadImage = () => {
        debugger;
        files.forEach(element => {
            const fd = new FormData();
            fd.append('Images', element, element.name);
            fd.append('Employee_Id', Number(sessionStorage.getItem("id")));
            fd.append('Fiscal_Year_Id', new Date().getMonth());
            fd.append('year', 2022);
            debugger

            const img = axios.post("https://timesheetjy.azurewebsites.net/api/UploadfileAzure/UploadApprovedImage", fd)
                .then(res => {
                    console.log(res);
                    setMessage(res.status, res.data);
                })
        });
    }

    return (
        <React.Fragment>
            <div style={{ paddingTop: '1rem' }}>

                <Dragger
                    {...props}
                    beforeUpload={(files) => {
                        return false;
                    }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>
                <div style={{ paddingTop: '1rem' }}>
                    <center>
                        <Button onClick={uploadImage}>Upload</Button>
                    </center>
                </div>
            </div>
        </React.Fragment>
    )
};

export default ImageUpload;