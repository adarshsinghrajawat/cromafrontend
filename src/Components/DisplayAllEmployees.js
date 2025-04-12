import { makeStyles } from "@mui/styles";
import MaterialTable from "@material-table/core";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Button, Avatar } from "@mui/material";
import Swal from "sweetalert2";
import { getData, postData, serverURL } from "../services/FetchNodeServices";
import { useNavigate } from "react-router-dom";
import logo1 from "../Assets/logo1.png"
const useStyles = makeStyles({
    employeeroot: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    employeebox: {
        height: 'auto',
        width: '70%',
        background: '#f2f2f2',
        marginTop: 10
    },
});

function DisplayAllEmployees() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [profilePicture, setProfilePicture] = useState({ bytes: '', filename: '' });

    const fetchAllEmployees = async () => {
        const response = await getData('productdetails/fetch_all_employees');
        setEmployees(response.data);
    };

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    const handleOpen = (rowData) => {
        setOpen(true);
        setEmployeeId(rowData.employeeid);
        setEmployeeName(rowData.employeename);
        setDesignation(rowData.designation);
        setDepartment(rowData.department);
        setProfilePicture({ bytes: '', filename: `${serverURL}/images/${rowData.picture}` });
    };

    const handleCloseDialogue = () => {
        setOpen(false);
    };

    const handleDelete = (rowData) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await postData('employee/delete_employee', { employeeid: rowData.employeeid });
                if (response.status) {
                    Swal.fire('Deleted!', 'Employee record has been deleted.', 'success');
                    fetchAllEmployees();
                } else {
                    Swal.fire('Failed!', 'Employee record was not deleted.', 'error');
                }
            }
        });
    };

    const showEmployeeDialogue = () => (
        <Dialog open={open}>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Employee Name" value={employeeName} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Designation" value={designation} disabled />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Department" value={department} disabled />
                    </Grid> */}
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar src={profilePicture.filename} style={{ width: 80, height: 80 }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialogue}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    function DisplayEmployeeTable() {
        return (
            <MaterialTable
            title={<div style={{display:"flex", flexDirection:"row", margin:20, justifyContent:"space-between", width:"100%"}}>
            <div>
                <img src={logo1} width={120} height={50}/>
                <div style={{fontFamily: 'Kalam', fontWeight:"bold"}}>
                Employees List
            </div>
            </div></div>}
                columns={[
                    { title: 'Employee ID', field: 'employeeid', filtering: true },
                    { title: 'Name', field: 'employeename', filtering: true },

                    // {
                    //     title: 'Designation',
                    //     field: 'designation',
                    //     filtering: true,
                    //     lookup: employees.reduce((acc, emp) => ({ ...acc, [emp.designation]: emp.designation }), {})
                    // },
                    // {
                    //     title: 'Department',
                    //     field: 'department',
                    //     filtering: true,
                    //     lookup: employees.reduce((acc, emp) => ({ ...acc, [emp.department]: emp.department }), {})
                    // },

                    { title: 'Picture', render: (rowData) => <Avatar src={`${serverURL}/images/${rowData.image}`} ></Avatar> }
                ]}
                data={employees}
                options={{
                    filtering: true,
                    search: true,
                    paging: true,
                    exportButton: true,
                    sorting: true,
                    pageSize: 5,
                    maxBodyHeight: '60vh',
                    actionsColumnIndex: -1,
                }}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit Employee',
                        onClick: (event, rowData) => handleOpen(rowData)
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete Employee',
                        onClick: (event, rowData) => handleDelete(rowData)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Add Employee',
                        isFreeAction: true,
                        onClick: () => navigate("/dashboard/employee")
                    }
                ]}
            />
        );
    }

    return (
        <div className={classes.employeeroot}>
            <div className={classes.employeebox}>
                {DisplayEmployeeTable()}
                {showEmployeeDialogue()}
            </div>
        </div>
    );
}

export default DisplayAllEmployees;
