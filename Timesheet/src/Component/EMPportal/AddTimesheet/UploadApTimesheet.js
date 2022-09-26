import React, { useState, Component } from "react";
import { message } from "antd";
import axios from "axios";

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

class UploadApTimesheet extends Component {

    state = {
        selectedFile: null
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    fileUploadHandler = () => {
        console.log();
        debugger;
        const fd = new FormData();
        fd.append('Images', this.state.selectedFile, this.state.selectedFile.name);
        fd.append('Employee_Id', Number(sessionStorage.getItem("id")));
        fd.append('Fiscal_Year_Id', new Date().getMonth());
        fd.append('year', 2022);
        debugger;
        const img = axios.post("https://timesheetjy.azurewebsites.net/api/UploadfileAzure/UploadApprovedImage", fd)
            .then(res => {
                setMessage(res.status, " Uploaded Successfully");
            })
        const timout1 = setTimeout(() => {
            window.location.reload(false);
        }, 1150);
        return () => clearTimeout(timout1);
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.fileSelectedHandler}></input><br />
                <button onClick={this.fileUploadHandler}>Upload</button>
            </div>
        )
    }
}
export default UploadApTimesheet;
