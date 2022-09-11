import React, { useState, Component } from "react";
import { message } from "antd";
// import ReactDOM from "react-dom";
// import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
// import { render } from "@testing-library/react";

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

class UploadedImage extends Component {

    state = {
        selectedFile: null
    }

    fileSelectedHandler = event => {
        // console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    fileUploadHandler = () => {

        const fd = new FormData();
        fd.append('Images', this.state.selectedFile, this.state.selectedFile.name);
        fd.append('Employee_Id', 92);
        fd.append('Fiscal_Year_Id', 9);
        fd.append('year', 2022);

        const img = axios.post("https://timesheetjy.azurewebsites.net/api/UploadfileAzure/UploadApprovedImage", fd)
            .then(res => {
                console.log(res);
                setMessage(res.status, res.data);
            })

    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.fileSelectedHandler}></input> <br />
                <button onClick={this.fileUploadHandler}>Upload</button>
            </div>
        )
    }
}
export default UploadedImage;