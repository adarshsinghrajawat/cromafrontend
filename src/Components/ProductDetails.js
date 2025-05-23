import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, Button, Avatar } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useState, useEffect, useRef } from "react";
import { getData, postData } from "../services/FetchNodeServices";
import Swal from 'sweetalert2'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react";
import { DropzoneArea } from 'material-ui-dropzone'
import SignatureCanvas from "react-signature-canvas";
import Heading from "../services/Heading"
import logo1 from "../Assets/logo1.png"
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

export default function ProductDetails() {
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
    const [hsnCode, setHsnCode] = useState('')
    const [picture, setPicture] = useState({ bytes: '', filename: '' })
    const [getErrors, setErrors] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [brandsList, setBrandsList] = useState([])
    const [productsList, setProductsList] = useState([])
    const [warrantyYears, setWarrantyYears] = useState('');
    const [shopkeeperName, setShopKeeperName] = useState('');
    const [receivingDate, setReceivingDate] = useState('')
    const [returnDate, setReturnDate] = useState('NA')
    const [files, setFiles] = useState([])
    const [date, setDate] = useState('') // Added new date state
    const [pdf, setPdf] = useState({ bytes: "", filename: "" })
    const [errors, setError] = useState({});
    const sigCanvas = useRef(null); // Reference for signature pad
    const sigCanvass = useRef(null);
    const [signature, setSignature] = useState(null);
    const [signatures, setSignatures] = useState(null);
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

    const handlePdf = (event) => {
        setPdf({ bytes: event.target.files[0], filename: event.target.files[0].name })
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

    const saveSignature = () => {
        setSignature(sigCanvas.current.toDataURL("image/png"));
    };


    const saveSignatures = () => {
        setSignatures(sigCanvass.current.toDataURL("image/png"));
    };

    const fetchProductsByBrands = async (bid) => {
        var body = { 'brandid': bid, categoryid: categoryId }
        var result = await postData('products/fetch_products_by_brands', body)
        setProductsList(result.data)
    }

    const handleBrandChange = (event) => {
        setBrandId(event.target.value)
        fetchProductsByBrands(event.target.value)
    }

    const fillProducts = () => {
        return productsList.map((item) => {
            return <MenuItem value={item.productid}>{item.productname}</MenuItem>
        })
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
        setHsnCode('')
        setModelno('')
        setDescription('')
        setShopKeeperName('')
        setPicture({ bytes: '', filename: '' })
        setReceivingDate('')
        setReceivingDate('')
        setPdf('')
        setDate('') // Reset the date field as well
    }

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

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
        if (hsnCode.length === 0) {
            error = true
            handleError('Please enter hsn code', 'hsnCode')
        }
        if (offerPrice.length === 0) {
            error = true
            handleError('Please enter offer price', 'offerPrice')
        }
        if (description.length === 0) {
            error = true
            handleError('Please enter description', 'description')
        }
        if (shopkeeperName.length === 0) {
            error = true;
            handleError('Please enter Shopkeeper Name', 'shopkeeperName'); // Corrected key
        }

        if (files.length === 0) {
            error = true
            handleError('Please select picture', 'picture')
        }
        if (date.length === 0) {  // Validate the new date field
            error = true
            handleError('Please select a date', 'date')
        }
        if (receivingDate.length === 0) {  // Validate the new date field
            error = true
            handleError('Please select a date', 'receivingDate')
        }
        if (warrantyYears.length === 0) {
            error = true;
            handleError('Please enter warranty years', 'warrantyYears');
        }
        if (pdf.length === 0) {
            error = true;
            handleError('Please Upload PDF', 'pdf');
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
            formData.append('description', description)
            formData.append('modelno', modelno)
            formData.append('color', color)
            formData.append('price', price)
            formData.append('offerprice', offerPrice)
            formData.append('stock', stock)
            formData.append('status', status)
            formData.append('hsncode', hsnCode)
            formData.append('shopkeepername', shopkeeperName)
            formData.append('warrantyyears', warrantyYears);
            formData.append('date', date) // Send the date in the form data
            formData.append('receivingdate', receivingDate)
            formData.append("signature", signature);
            formData.append("signatures", signatures);
            formData.append('returndate', returnDate)
            formData.append("pdf", pdf.bytes)
            files.map((file, index) => {
                formData.append('picture' + index, file)
            })

            var response = await postData('productdetails/submit_product_details', formData)
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
                        <Heading image={logo1} caption="Product Details" link='/dashboard/displayallproductdetails' />
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

                            <Grid item xs={4}>
                                <TextField
                                    value={offerPrice}
                                    error={getErrors.offerPrice}
                                    helperText={getErrors.offerPrice}
                                    onChange={(event) => setOfferPrice(event.target.value)}
                                    onFocus={() => handleError('', 'offerPrice')}
                                    label="Serial No."
                                    fullWidth />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={shopkeeperName}
                                    error={getErrors.shopkeeperName} // Corrected key
                                    helperText={getErrors.shopkeeperName} // Corrected key
                                    onChange={(event) => setShopKeeperName(event.target.value)}
                                    onFocus={() => handleError('', 'shopkeeperName')} // Corrected key
                                    label="Shopkeeper Name"
                                    fullWidth
                                />
                            </Grid>


                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Condition</InputLabel>
                                    <Select
                                        value={status}
                                        label="Condition"
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
                                    value={hsnCode}
                                    error={getErrors.hsnCode}
                                    helperText={getErrors.hsnCode}
                                    onChange={(event) => setHsnCode(event.target.value)}
                                    onFocus={() => handleError('', 'hsnCode')}
                                    label="Item Code"
                                    fullWidth />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    value={warrantyYears}
                                    error={getErrors.warrantyYears}
                                    helperText={getErrors.warrantyYears}
                                    onChange={(event) => setWarrantyYears(event.target.value)}
                                    onFocus={() => handleError('', 'warrantyYears')}
                                    label="Warranty (Years)"
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ReactQuill modules={modules} theme="snow" value={description} onChange={handleQuill} />
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.description}</p>
                            </Grid>



                            {/* Date Field */}
                            <Grid item xs={4}>
                                <TextField
                                    value={date}
                                    error={getErrors.date}
                                    helperText={getErrors.date}
                                    onChange={(event) => setDate(event.target.value)}
                                    onFocus={() => handleError('', 'date')}
                                    label="Date of Purchased"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={receivingDate}
                                    error={getErrors.receivingDate}
                                    helperText={getErrors.receivingDate}
                                    onChange={(event) => setReceivingDate(event.target.value)}
                                    onFocus={() => handleError('', 'receivingDate')}
                                    label="Date of Receiving"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    value={returnDate === 'NA' ? '' : returnDate}
                                    error={getErrors.returnDate}
                                    helperText={getErrors.returnDate}
                                    onChange={(event) => setReturnDate(event.target.value || 'NA')}
                                    onFocus={() => handleError('', 'returnDate')}
                                    label="Date of Return"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
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

                                </div>

                            </Grid>
                            <div style={{ display: "flex", marginBottom: 20, flexDirection: "row", width: "80%", justifyContent: "space-between", alignItems: "center", background: "#f8f8f8", padding: 10, borderRadius: 5, boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", marginTop: '3%', marginLeft: '5.5%' }}>
                                <Button component="label" size="small" style={{ color: "#00b22c" }} variant="outlined">
                                    <input onChange={(e)=>handlePdf(e)} hidden type="file" accept="application/pdf" />
                                    Upload Bill
                                </Button>
                                <Avatar src="/Assets/pdf-icon.png" alt="PDF" variant="square" style={{ width: 40, height: 40, marginLeft: 10 }} />
                                <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>{pdf.filename}</span>
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                width: "100%",
                                marginTop: '3%'
                            }}>
                                {/* Receiver's Signature */}
                                <div style={{
                                    width: "40%",
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
                                        canvasProps={{ width: 300, height: 80, className: "sigCanvas" }}
                                        style={{ border: "1px solid #007BFF", borderRadius: 5, backgroundColor: "#fff" }}
                                    />
                                    <div style={{ fontSize: 13, color: "red", marginTop: 5 }}>{errors.signature}</div>
                                </div>

                                {/* Authority's Signature */}
                                <div style={{
                                    width: "40%",
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
                                        Authority's Signature
                                    </label>
                                    <SignatureCanvas
                                        ref={sigCanvass}
                                        penColor="black"
                                        onEnd={saveSignatures}
                                        canvasProps={{ width: 300, height: 80, className: "sigCanvas" }}
                                        style={{ border: "1px solid #007BFF", borderRadius: 5, backgroundColor: "#fff" }}
                                    />
                                    <div style={{ fontSize: 13, color: "red", marginTop: 5 }}>{errors.authoritysignature}</div>
                                </div>
                            </div>



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
