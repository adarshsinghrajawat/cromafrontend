import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, Button, Avatar } from "@mui/material";
 
import { makeStyles } from "@mui/styles";
import { useState, useEffect,useRef } from "react";
import { getData, postData } from "../services/FetchNodeServices";
import Swal from 'sweetalert2'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SignatureCanvas from "react-signature-canvas";
import { useMemo } from "react";
import { DropzoneArea } from 'material-ui-dropzone'
import logo1 from "../Assets/logo1.png"
import Heading from "../services/Heading"

import categoryicon from "../Assets/electronics.jpg"

var useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: '80%',
        height: 'auto',
        padding: '1.5%',
        borderRadius: '10px',
        background: '#f1f2f6',
        marginTop: '1%'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default function Issued() {
    const useStyle = useStyles()

    const [productId, setProductId] = useState('')
    const [brandId, setBrandId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [modelno, setModelno] = useState('')
    const [color, setColor] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')
    const [stock, setStock] = useState('')
    const [status, setStatus] = useState('')
    const [itemCode, setItemCode] = useState('')
    const [picture, setPicture] = useState({ bytes: '', filename: '' })
    const [getErrors, setErrors] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [brandsList, setBrandsList] = useState([])
    const [employeeId, setEmployeeId] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [productsList, setProductsList] = useState([])
    const [files, setFiles] = useState([])
    const [signature, setSignature] = useState(null);
    const [date, setDate] = useState('') // Added new date state
    const [time, setTime] = useState(''); 
    const sigCanvas = useRef(null); 
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['image', "link", 'video'],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],

        },
    }), [])

    const handleQuill = (newValue) => {
        setDescription(newValue)
        if (newValue.trim() !== '') {
            handleError('', 'description');
        }
    }

    const fetchAllCategory = async () => {
        var result = await getData('category/display_all_category')
        setCategoryList(result.data)
    }

    useEffect(function () {
        fetchAllCategory()
    }, [])

    const fillAllCategory = () => {
        return categoryList.map((item) => {
            return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
        })
    }


    
    const saveSignature = () => {
        setSignature(sigCanvas.current.toDataURL("image/png"));
      };

    const fetchBrandByCategory = async (cid) => {
        var body = { 'categoryid': cid }
        var result = await postData('brands/fetch_brands_by_category', body)
        setBrandsList(result.data)
    }

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value)
        fetchBrandByCategory(event.target.value)
    }

    const fillBrands = () => {
        return brandsList.map((item) => {
            return <MenuItem value={item.brandid}>{item.brandname}</MenuItem>
        })
    }

    const fetchProductsByBrands = async (bid) => {
        var body = { 'brandid': bid, categoryid: categoryId }
        var result = await postData('products/fetch_products_by_brands', body)
        
        // Log the response to check if data is coming correctly
        console.log("Fetched Products Data:", result.data);
    
        setProductsList(result.data);
    }
    
    
    const fillProducts = () => {
        console.log("Products List:", productsList);  // Log productsList
    
        return productsList.map((item) => {
            return (
                <MenuItem value={item.productid} key={item.productid}>
                    {item.productname} - {item.modelno} {/* Display product name and modelno */}
                </MenuItem>
            );
        });
    };


    


    

    const handleBrandChange = (event) => {
        setBrandId(event.target.value)
        fetchProductsByBrands(event.target.value)
    }



    const handleReset = () => {
        setCategoryId('')
        setBrandsList([])
        setBrandId('')
        setProductsList([])
        setProductId('')
        setStock('')
        setStatus('')
        setColor('')
        setPrice('')
        setOfferPrice('')
        setItemCode('')
        setModelno('')
        setDescription('')
        setPicture({ bytes: '', filename: '' })
        setDate('') // Reset the date field as well
    }

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }


    const fetchEmployeeList = async () => {
        console.log('Fetching employee list...'); // Add this line to check when the function is called
        const result = await getData('productdetails/fetch_all_employees');
        console.log('Fetched Employee Data:', result.data); // Check what data is being returned
        setEmployeeList(result.data);
    };

    useEffect(() => {
       // alert("data");
        fetchEmployeeList(); // Trigger the employee data fetch
    }, []);


    const fillEmployeeList = () => {
        console.log("Employee List Data:", employeeList); // Log the employeeList data to the console
       // alert("Employee List Length: " + employeeList.length); // Alert the number of employees
    
        return employeeList.map((item) => {
            console.log("Employee Item:", item); // Log each employee item
            return <MenuItem key={item.employeeid} value={item.employeeid}>{item.employeename}</MenuItem>;
        });
    };


    const handleEmployeeChange = (event) => {
        setEmployeeId(event.target.value);
        setErrors((prev) => ({ ...prev, employeeId: '' })); // Reset error on change
    };

    const validation = () => {
        var error = false
        if (brandId.length === 0) {
            error = true
            handleError('Please choose brand', 'brandId')
        }
        if (productId.length === 0) {
            error = true
            handleError('Please choose product', 'productId')
        }
        if (categoryId.length === 0) {
            error = true
            handleError('Please choose category', 'categoryId')
        }
        if (modelno.length === 0) {
            error = true
            handleError('Please enter Model no', 'modelno')
        }
        if (stock.length === 0) {
            error = true
            handleError('Please enter stock', 'stock')
        }
        if (color.length === 0) {
            error = true
            handleError('Please enter color', 'color')
        }
        if (status.length === 0) {
            error = true
            handleError('Please choose status', 'status')
        }
        if (price.length === 0) {
            error = true
            handleError('Please enter price', 'price')
        }
        if (itemCode.length === 0) {
            error = true
            handleError('Please enter hsn code', 'itemCode')
        }
        // if (offerPrice.length === 0) {
        //     error = true
        //     handleError('Please enter offer price', 'offerPrice')
        // }
        if (description.length === 0) {
            error = true
            handleError('Please enter description', 'description')
        }
        if (files.length === 0) {
            error = true
            handleError('Please select picture', 'picture')
        }
        if (date.length === 0) {  // Validate the new date field
            error = true
            handleError('Please select a date', 'date')
        }
        if (time.length === 0) {
            error = true;
            handleError('Please select a time', 'time');
        }
        return error
    }

    const handleSumit = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('categoryid', categoryId)
            formData.append('brandid', brandId)
            formData.append('productid', productId)
            formData.append('employeeid', employeeId)
            formData.append('description', description)
            formData.append('modelno', modelno)
            formData.append('color', color)
            formData.append('price', price)
            // formData.append('offerprice', offerPrice)
            formData.append('stock', stock)
            formData.append('status', status)
            formData.append('itemcode', itemCode)
            formData.append('date', date) // Send the date in the form data
            formData.append('time', time)
            formData.append("signature", signature);
            files.map((file, index) => {
                formData.append('picture' + index, file)
            })


            var response = await postData('productdetails/submit_issued', formData)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product Details added successfully!',
                    showConfirmButton: true
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Product Details not added!',
                    showConfirmButton: true
                })
            }
        }
    }


    return (
        <div className={useStyle.root}>
            <div className={useStyle.box}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Heading image={logo1} caption="Issue Form" link='/dashboard/totalissued' />
                    </Grid>


                    <Grid item xs={7}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={categoryId}
                                        onFocus={() => handleError('', 'categoryId')}
                                        error={getErrors.categoryId}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                    >
                                        {fillAllCategory()}
                                    </Select>
                                </FormControl>
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.categoryId}</p>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Brands</InputLabel>
                                    <Select
                                        value={brandId}
                                        onFocus={() => handleError('', 'brandId')}
                                        error={getErrors.brandId}
                                        label="Category"
                                        onChange={handleBrandChange}
                                    >
                                        {fillBrands()}
                                    </Select>
                                </FormControl>
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.brandId}</p>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Product</InputLabel>
                                    <Select
                                        value={productId}
                                        onFocus={() => handleError('', 'productId')}
                                        error={getErrors.productId}
                                        label="Product"
                                        onChange={(event) => setProductId(event.target.value)}
                                    >
                                        {fillProducts()}
                                    </Select>
                                </FormControl>
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.productId}</p>
                            </Grid>

                            
                            <Grid item xs={4}>
    <FormControl fullWidth>
        <InputLabel>Employee</InputLabel>
        <Select
            value={employeeId}
            onFocus={() => handleError('', 'employeeId')} // Reset error on focus
            error={getErrors.employeeId}
            label="Employee"
            onChange={(event) => setEmployeeId(event.target.value)}
        >
            {fillEmployeeList()}
        </Select>
    </FormControl>
    <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>
        {getErrors.employeeId}
    </p>
</Grid>




                            <Grid item xs={4}>
                                <TextField
                                    value={modelno}
                                    error={getErrors.modelno}
                                    helperText={getErrors.modelno}
                                    onChange={(event) => setModelno(event.target.value)}
                                    onFocus={() => handleError('', 'modelno')}
                                    label="Model No."
                                    fullWidth />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={color}
                                    error={getErrors.color}
                                    helperText={getErrors.color}
                                    onChange={(event) => setColor(event.target.value)}
                                    onFocus={() => handleError('', 'color')}
                                    label="Color"
                                    fullWidth />
                            </Grid>


                            <Grid item xs={4}>
                                <TextField
                                    value={stock}
                                    error={getErrors.stock}
                                    helperText={getErrors.stock}
                                    onChange={(event) => setStock(event.target.value)}
                                    onFocus={() => handleError('', 'stock')}
                                    label="Stock"
                                    fullWidth />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={price}
                                    error={getErrors.price}
                                    helperText={getErrors.price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    onFocus={() => handleError('', 'price')}
                                    label="Price"
                                    fullWidth />
                            </Grid>

                            {/* <Grid item xs={6}>
                                <TextField
                                    value={offerPrice}
                                    error={getErrors.offerPrice}
                                    helperText={getErrors.offerPrice}
                                    onChange={(event) => setOfferPrice(event.target.value)}
                                    onFocus={() => handleError('', 'offerPrice')}
                                    label="Discount Price"
                                    fullWidth />
                            </Grid> */}

                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        label="Status"
                                        onChange={(event) => setStatus(event.target.value)}
                                    >
                                          <MenuItem value={'New'}>New</MenuItem>
                                          <MenuItem value={'Old'}>Old</MenuItem>
                                          <MenuItem value={'Refer Based'}>Refer Based</MenuItem>
                                        <MenuItem value={'Offer'}>Offer</MenuItem>
                                        <MenuItem value={'Deal of the day'}>Deal of the day</MenuItem>
                                        <MenuItem value={'Festive Deals'}>Festive Deals</MenuItem>
                                        <MenuItem value={'Sale'}>Sale</MenuItem>
                                        <MenuItem value={'Trending'}>Trending</MenuItem>
                                        <MenuItem value={'New Arrival'}>New Arrival</MenuItem>
                                        <MenuItem value={'Discontinue'}>Discontinue</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={itemCode}
                                    error={getErrors.itemCode}
                                    helperText={getErrors.itemCode}
                                    onChange={(event) => setItemCode(event.target.value)}
                                    onFocus={() => handleError('', 'itemCode')}
                                    label="Item Code"
                                    fullWidth />
                            </Grid>

                           

                            {/* Date Field */}
                            <Grid item xs={4}>
                                <TextField
                                    value={date}
                                    error={getErrors.date}
                                    helperText={getErrors.date}
                                    onChange={(event) => setDate(event.target.value)}
                                    onFocus={() => handleError('', 'date')}
                                    label="Date of Issue"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>


                                <Grid item xs={4}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={time}
                                        onChange={(newTime) => setTime(newTime)}
                                        renderInput={(params) => <TextField {...params} fullWidth label="Time Of Issue"
                                        error={getErrors.time}  // Add error handling here
                                       helperText={getErrors.time} 
                                        />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <ReactQuill modules={modules} theme="snow" value={description} onChange={handleQuill} />
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.description}</p>
                            </Grid>
  

                            

                            <Grid item xs={6} className={useStyle.center}>
                                <Button onClick={handleSumit} variant="contained" fullWidth style={{ background: '#004cef', padding: '5% 0', fontWeight: '500' }}>Add</Button>
                            </Grid>
                            <Grid item xs={6} className={useStyle.center}>
                                <Button onClick={handleReset} variant="contained" fullWidth style={{ background: '#004cef', padding: '5% 0', fontWeight: '500' }}>Reset</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={5}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className={useStyle.center}>
                                <div style={{ width: '100%' }}>
                                    <DropzoneArea
                                        acceptedFiles={['image/*']}
                                        dropzoneText={"Drag and drop an image here or click"}
                                        onChange={(files) => setFiles(files)}
                                        filesLimit={7}
                                        fullWidth
                                    />

<div style={{ 
    display: "flex", 
    justifyContent: "space-evenly", 
    alignItems: "center", 
    width: "100%", 
    marginTop: '3%' 
}}>
    {/* Receiver's Signature */}
    <div style={{ 
        width: "80%", 
        border: "2px dashed #007BFF", 
        borderRadius: 10, 
        padding: 15, 
        backgroundColor: "#F8F9FA", 
        textAlign: "center"
    }}>
        <label style={{ 
            fontSize: 16, 
            fontWeight: "bold", 
            color: "#007BFF", 
            display: "block", 
            marginBottom: 10 
        }}>
            Receiver's Signature
        </label>
        <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            onEnd={saveSignature} 
            canvasProps={{ width: 300, height: 150, className: "sigCanvas" }}
            style={{ border: "1px solid #007BFF", borderRadius: 5, backgroundColor: "#fff" }}
        />
        <div style={{ fontSize: 13, color: "red", marginTop: 5 }}>{getErrors.signature}</div>
    </div>
    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.picture}</p>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        </div>
    )
}
