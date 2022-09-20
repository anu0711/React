import axios from "axios";

var dummyProject = [];
const toke = sessionStorage.getItem("token");
const response = axios.get("https://timesheetjy.azurewebsites.net/api/Employee/GetAllProjects", {
    headers: {
        'Authorization': `Bearer ${toke}`
    }
})
// .then(r => setProject(r.data));
response.data.forEach(element => {
    dummyProject.push({
        value: element.project_Id,
        label: element.project_Name
    })
});

export default dummyProject;