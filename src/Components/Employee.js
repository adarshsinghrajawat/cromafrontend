import { Avatar, Button, TextField } from "@mui/material"
import { useState } from "react"
import { postData } from "../services/FetchNodeServices"
import Swal from "sweetalert2"
import Heading from "../services/Heading"
import categoryicon from "../Assets/electronics.jpg"
import logo1 from "../Assets/logo1.png"
export default function Employee(){
    const validation=()=>{
        var error=false
        if(employeeName.length==0)
        {
            error=true
            handleError("Plz input Employee...!","categoryname")
        }
        if(img.filename.length==0)
        {
            error=true
            handleError("Plz select image...!", 'image')
        }
        return error
    }
    const handleReset=()=>{
        setEmployeeName("")
        setImg({bytes:"", filename:""})
    }
    const handleSubmit=async()=>{
        var error=validation()
        console.log(errors)
        if(error==false)
        {
        var formData= new FormData()
        formData.append("employeename", employeeName)
        formData.append("image", img.bytes)
        var response=await postData("category/submit_employee", formData)
        if(response.status)
    {
        Swal.fire({
            toast:true,
            icon: 'success',
            title: 'Category',
            text: response.message,
          })
    }
    else{
        Swal.fire({
            toast:true,
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          })
    }
}
    }
    const [employeeName, setEmployeeName]=useState("")
    const [img, setImg]=useState({bytes:"", filename:""})
    const [errors, seterror]=useState({})
    
    const handleError=(error, label)=>{
     seterror((prev)=>({...prev,[label]:error}))
    }
    const handleImg=(event)=>{
        setImg({bytes:event.target.files[0], filename:URL.createObjectURL(event.target.files[0])})
    }
    return(
    <div style={{padding:10, display:"flex", flexDirection:"column", width:"30%", borderRadius:10, alignItems:"center", background:"#ece6ff"}}>
    <Heading image={logo1} caption="New Employees" link="/dashboard/displayallemployees"/>    
    <TextField value={employeeName}  error={errors.categoryname} onFocus={()=>handleError(null,"categoryname")} helperText={errors.categoryname} onChange={(event)=>setEmployeeName(event.target.value)} style={{marginBottom:20, marginTop:40,}} size="small" fullWidth label="Employee Name"/>
    <div style={{display:"flex", marginBottom:20, flexDirection:"row", width:"80%", justifyContent:"space-between", alignItems:"center"}}>
    <Button onFocus={()=>handleError(null, "image")} component="label" size="small" style={{color:"#00b22c"}} variant="outlined">
     <input onChange={handleImg} hidden type="file" accept="images/*" multiple/>
     Employee Image
     </Button>
     <div style={{fontSize:13, color:"red"}}>{errors.image}</div>
     <Avatar src={img.filename} alt="Category" variant="circle"/>
    </div>
    <div style={{display:"flex", flexDirection:"row", width:"100%", justifyContent:"space-between"}}>
    <Button onClick={handleSubmit} size="small" style={{width:"30%", color:"#00b22c"}} variant="outlined">Submit</Button>
    <Button onClick={handleReset} size="small" style={{width:"30%", color:"#00b22c"}} variant="outlined">Reset</Button>
    </div>
    </div>
    )
} 