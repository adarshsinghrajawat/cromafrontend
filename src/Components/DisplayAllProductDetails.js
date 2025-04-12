import * as React from "react";

import { Grid, TextField, Button, Avatar } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { getData, serverURL, postData } from "../services/FetchNodeServices";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DropzoneArea, DropzoneAreaBase } from "material-ui-dropzone";
import Heading from "../services/Heading";
import logo1 from "../Assets/logo1.png"
import categoryicon from "../../src/Assets/electronics.jpg";
import dayjs from "dayjs";
import moment from "moment/moment"
import "../App.css";


var useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  displaybox: {
    width: "1200px",
    height: "auto",
    padding: "1.5%",
    borderRadius: "10px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
  },
  right: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
  },
  box: {
    width: "700px",
    height: "auto",
    padding: "1.5%",
    borderRadius: "10px",
  },
});

export default function DisplayAllProductDetails() {
  const useStyle = useStyles();
  var navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [open, setOpen] = useState(false);
  const [openPicture, setOpenPicture] = useState(false);
  const [productId, setProductId] = useState("");
  const [productDetailsId, setProductDetailsId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [picture, setPicture] = useState({ bytes: "", filename: "" });
  const [getErrors, setErrors] = useState({});

  const [getOldPicture, setOldPicture] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [brandsList, setBrandsList] = useState([]);
  const [modelno, setModelno] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [shopkeeperName, setShopKeeperName] = useState('');
  const [warrantyYears, setWarrantyYears] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [productDetailsList, setProductDetailsList] = useState([]);
  const [files, setFiles] = useState([]);
  const [issue, setIssue] = useState("");
  const [receivingDate, setReceivingDate] = useState('')
  const [returnDate, setReturnDate] = useState('NA')

  const [date, setDate] = useState('') //

  const handleQuill = (newValue) => {
    setDescription(newValue);
    if (description.trim() !== "") {
      handleError("", "description");
    }
  };

  const [value, setValue] = useState("");

  const fetchAllProductDetails = async () => {
    var result = await getData("productdetails/fetch_product_details");
    console.log("Fetched Productsdetail:", result.data); // ✅ Log the data
    setProductDetailsList(result.data);
  };

  const fetchAllissue = async () => {
    try {
      var result = await getData("productdetails/fetch_all_issued");
      console.log("Fetched issued data:", result.data); // Console log to check the fetched data
      setIssue(result.data);
    } catch (error) {
      console.error("Error fetching issued data:", error); // Log any errors that occur
    }
  };


  const fetchAllProducts = async () => {
    try {
      const result = await getData("products/display_all_products");
      console.log("Fetched Products:", result.data); // ✅ Log the data
      setProductsList(result.data);
    } catch (error) {
      console.error("Error fetching products:", error); // ❌ Handle errors
    }
  };

  const fetchAllCategory = async () => {
    var response = await getData("category/display_all_category");
    setCategoryList(response.data);
  };

  const fillAllCategory = () => {
    return categoryList.map((item, i) => {
      return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>;
    });
  };

  const fetchBrandByCategory = async (cid) => {
    var body = { categoryid: cid };
    var result = await postData("brands/fetch_brands_by_category", body);
    setBrandsList(result.data);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    fetchBrandByCategory(event.target.value);
  };

  const fillBrands = () => {
    return brandsList.map((item) => {
      return <MenuItem value={item.brandid}>{item.brandname}</MenuItem>;
    });
  };

  const fetchProductsByBrands = async (cid, bid) => {
    var body = { brandid: bid, categoryid: cid };
    var result = await postData("products/fetch_products_by_brands", body);
    setProductsList(result.data);
  };

  const handleBrandChange = (event) => {
    setBrandId(event.target.value);
    fetchProductsByBrands(event.target.value);
  };

  const fillProducts = () => {
    return productsList.map((item) => {
      return <MenuItem value={item.productid}>{item.productname}</MenuItem>;
    });
  };

  useEffect(function () {
    fetchAllCategory();
    fetchAllProducts();
    fetchAllProductDetails();
  }, []);

  const handleError = (error, label) => {
    setErrors((prev) => ({ ...prev, [label]: error }));
  };

  const validation = () => {
    var error = false;
    if (brandId.length === 0) {
      error = true;
      handleError("Please choose brand", "brandId");
    }
    if (productId.length === 0) {
      error = true;
      handleError("Please choose product", "productId");
    }
    if (categoryId.length === 0) {
      error = true;
      handleError("Please choose category", "categoryId");
    }
    if (modelno.length === 0) {
      error = true;
      handleError("Please enter Model no", "modelno");
    }
    if (stock.length === 0) {
      error = true;
      handleError("Please enter stock", "stock");
    }
    if (color.length === 0) {
      error = true;
      handleError("Please enter color", "color");
    }
    if (status.length === 0) {
      error = true;
      handleError("Please choose status", "status");
    }
    if (price.length === 0) {
      error = true;
      handleError("Please enter price", "price");
    }
    if (hsnCode.length === 0) {
      error = true;
      handleError("Please enter hsn code", "hsnCode");
    }
    if (offerPrice.length === 0) {
      error = true;
      handleError("Please enter offer price", "offerPrice");
    }
    if (description.length === 0) {
      error = true;
      handleError("Please enter description", "description");
    }
    if (picture.filename.length === 0) {
      error = true;
      handleError("Please select picture", "picture");
    }
    return error;
  };

  const handlePicture = (event) => {
    setPicture({
      bytes: event.target.files[0],
      filename: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleDataUpdate = async () => {
    var error = validation();
    if (error === false) {
      var body = {
        productdetailsid: productDetailsId,
        brandid: brandId,
        categoryid: categoryId,
        productid: productId,
        description: description,
        modelno: modelno,
        color: color,
        stock: stock,
        price: price,
        offerprice: offerPrice,
        status: status,
        hsncode: hsnCode,
        shopkeepername: shopkeeperName,
        warrantyyears: warrantyYears,
        date: date,
        receivingdate: receivingDate,
        returndate: returnDate
      };
      var response = await postData(
        "productdetails/update_productdetails_data",
        body
      );
      if (response.status === true) {
        fetchAllProductDetails();
        Swal.fire({
          icon: "success",
          title: "Product Details updated sucessfully!",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Product Details not updated!",
          showConfirmButton: true,
        });
      }
    }
  };

  const handlePictureUpdate = async () => {
    /*var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('productdetailsid', productDetailsId)
            formData.append('picture', picture.bytes)
            var response = await postData('productdetails/update_product_details_picture', formData)
            if (response.status === true) {
               
                fetchAllProductDetails()
                Swal.fire({
                    icon: 'success',
                    title: 'Picture updated sucessfully!',
                    showConfirmButton: true
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Picture not updated!',
                    showConfirmButton: true
                })
            }
        }*/
    alert(files.length);
  };

  const handlePictureCancel = () => {
    setPicture({ filename: getOldPicture, bytes: "" });
  };
  const handleOpenPicture = (rowData) => {
    setProductDetailsId(rowData.productdetailsid);
    var pictures = rowData.picture.split(",").map((item) => {
      return `${serverURL}/images/${item}`;
    });
    console.log("PPPPPP", pictures);
    console.log("LLLEENNNGGTTHH:", pictures.length);
    setFiles(pictures);
    setOpenPicture(true);
  };
  const handlePictureClose = () => {
    setOpenPicture(false);
  };
  const handleOpen = (rowData) => {
    fetchBrandByCategory(rowData.categoryid);
    fetchProductsByBrands(rowData.categoryid, rowData.brandid);
    setModelno(rowData.modelno);
    setColor(rowData.color);
    setDescription(rowData.description);
    setPrice(rowData.price);
    setOfferPrice(rowData.offerprice);
    setStock(rowData.stock);
    setStatus(rowData.status);
    setHsnCode(rowData.hsncode);
    setProductDetailsId(rowData.productdetailsid);
    setProductId(rowData.productid);
    setBrandId(rowData.brandid);
    setCategoryId(rowData.categoryid);
    setProductName(rowData.productname);
    setShopKeeperName(rowData.shopkeepername)
    setWarrantyYears(rowData.warrantyyears)
    setDate(rowData.date?.substring(0, 10));
    console.log("Receiving Date:", rowData.receivingdate);
    var dater = moment(rowData.receivingdate).format("YYYY-MM-DD")
    setReceivingDate(dater);
    setReturnDate(rowData.returndate?.substring(0, 10) || "NA");
    setOpen(true);
  };

  const formatDateString = (dateString) => {
    // If the date is in 'YYYY-MM-DD' format already, return it as is
    if (dateString) {
      return dateString.split('T')[0]; // Extracts the date part only
    }
    return '';
  };


  const editProduct = () => {
    return (
      <div className={useStyle.root}>
        <div className={useStyle.box}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Heading
                image={logo1}
                caption="Edit Product Details"
                link=""
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId}
                  onFocus={() => handleError("", "categoryId")}
                  error={getErrors.categoryId}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  {fillAllCategory()}
                </Select>
              </FormControl>
              <p
                style={{
                  color: "#FF0000",
                  fontSize: "12.3px",
                  marginLeft: "15px",
                  marginTop: "0",
                }}
              >
                {getErrors.categoryId}
              </p>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Brands</InputLabel>
                <Select
                  value={brandId}
                  onFocus={() => handleError("", "brandId")}
                  error={getErrors.brandId}
                  label="Brand"
                  onChange={handleBrandChange}
                >
                  {fillBrands()}
                </Select>
              </FormControl>
              <p
                style={{
                  color: "#FF0000",
                  fontSize: "12.3px",
                  marginLeft: "15px",
                  marginTop: "0",
                }}
              >
                {getErrors.brandId}
              </p>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  value={productId}
                  onFocus={() => handleError("", "productId")}
                  error={getErrors.productId}
                  label="Product"
                  onChange={(event) => setProductId(event.target.value)}
                >
                  {fillProducts()}
                </Select>
              </FormControl>
              <p
                style={{
                  color: "#FF0000",
                  fontSize: "12.3px",
                  marginLeft: "15px",
                  marginTop: "0",
                }}
              >
                {getErrors.brandId}
              </p>
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={modelno}
                error={getErrors.modelno}
                helperText={getErrors.modelno}
                onChange={(event) => setModelno(event.target.value)}
                onFocus={() => handleError("", "modelno")}
                label="Model No."
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={color}
                error={getErrors.color}
                helperText={getErrors.color}
                onChange={(event) => setColor(event.target.value)}
                onFocus={() => handleError("", "color")}
                label="Color"
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={stock}
                error={getErrors.stock}
                helperText={getErrors.stock}
                onChange={(event) => setStock(event.target.value)}
                onFocus={() => handleError("", "stock")}
                label="Stock"
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={price}
                error={getErrors.price}
                helperText={getErrors.price}
                onChange={(event) => setPrice(event.target.value)}
                onFocus={() => handleError("", "price")}
                label="Price"
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={offerPrice}
                error={getErrors.offerPrice}
                helperText={getErrors.offerPrice}
                onChange={(event) => setOfferPrice(event.target.value)}
                onFocus={() => handleError("", "offerPrice")}
                label="Serial No."
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={shopkeeperName}
                error={getErrors.shopkeeperName}
                helperText={getErrors.shopkeeperName}
                onChange={(event) => setShopKeeperName(event.target.value)}
                onFocus={() => handleError('', 'shopkeeperName')}
                label="Shopkeeper Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  row
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <FormControlLabel
                    value="New"
                    control={<Radio />}
                    label="New"
                  />
                  <FormControlLabel
                    value="Old"
                    control={<Radio />}
                    label="Old"
                  />
                  <FormControlLabel
                    value="Refer Based"
                    control={<Radio />}
                    label="Refer Based"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                value={hsnCode}
                error={getErrors.hsnCode}
                helperText={getErrors.hsnCode}
                onChange={(event) => setHsnCode(event.target.value)}
                onFocus={() => handleError("", "hsnCode")}
                label="Item Code"
                fullWidth
              />
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


            <Grid item xs={12}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleQuill}
              />
              <p
                style={{
                  color: "#FF0000",
                  fontSize: "12.3px",
                  marginLeft: "15px",
                  marginTop: "0",
                }}
              >
                {getErrors.description}
              </p>
            </Grid>


          </Grid>
        </div>
      </div>
    );
  };

  const handleDelete = (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004cef",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var body = { productdetailsid: rowData.productdetailsid };
        var response = await postData(
          "productdetails/delete_product_details",
          body
        );
        fetchAllProductDetails();
        Swal.fire("Deleted!", "Product Details has been deleted.", "success");
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editPictureDialog = () => {
    return (
      <div>
        <Dialog open={openPicture} maxWidth={"lg"} onClose={handleClose}>
          <DialogContent>
            {JSON.stringify(files, null, 2)}
            <DropzoneArea
              acceptedFiles={["image/*"]}
              dropzoneText={"Drag and drop an image here or click"}
              //   onChange={(files) => setFiles(files)}
              filesLimit={7}
              initialFiles={files.reduce((acc, item) => {
                if (acc.indexOf(item) == -1) acc.push(item);
                return acc;
              }, [])}
              clearOnUnmount={true}
            //   fileObjects={[...files]}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePictureUpdate}>Update</Button>
            <Button onClick={handlePictureClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const editProductDialog = () => {
    return (
      <div>
        <Dialog open={open} maxWidth={"lg"} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>{editProduct()}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDataUpdate}>Update</Button>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const displayProducts = () => {
    return (
      <MaterialTable
        style={{
          marginTop: "3%",
        }} title={<div style={{ display: "flex", flexDirection: "row", margin: 20, justifyContent: "space-between", width: "100%" }}>
          <div>
            <img src={logo1} width={120} height={50} />
            <div style={{ fontFamily: 'Kalam', fontWeight: "bold" }}>
              Product Details List
            </div>
          </div></div>}

        columns={[
          { title: "Product Id", field: "productid" },
          { title: "Product Name", field: "productname" },
          {
            title: "Category",
            render: (rowData) => (
              <div>
                {/* {rowData.categoryid}/ */}
                {rowData.categoryname}
              </div>
            ),
          },
          {
            title: "Brand",
            render: (rowData) => (
              <div>
                {/* {rowData.brandid}/ */}
                {rowData.brandname}
              </div>
            ),
          },
          {
            title: "Model No./Item Code/Color/Condition",
            render: (rowData) => (
              <div>
                {rowData.productdetailsid}{rowData.modelno}/{rowData.hsncode}/{rowData.color}/{rowData.status}
              </div>
            ),
          },
          {
            title: "Stock/Price",
            render: (rowData) => (
              <div>
                {rowData.productdetailsid}{rowData.stock}/{rowData.price}Rs
              </div>
            ),
          },
          {
            title: "Shopkeeper Name",
            render: (rowData) => (
              <div>
                {rowData.productdetailsid}
                {rowData.shopkeepername}
              </div>
            ),
          },
          {
            title: "Date Of Purchasing/Date of Receiving/Date of Return",
            render: (rowData) => (
              <div>
                {rowData.productdetailsid}
                {rowData.date}/{rowData.receivingdate}/{rowData.receivingdate}/{rowData.returndate}
              </div>
            ),
          },
          { title: 'Picture', render: (rowData) => <Avatar src={`${serverURL}/images/${rowData.picture}`} ></Avatar> },

          {
            title: "Receiver's Signature",
            field: "signature",
            filtering: false,
            render: (rowData) =>
              rowData.signature ? (
                <img src={rowData.signature} alt="signature" width={500} height={80} />
              ) : (
                "No Signature"
              ),
          },

          {
            title: "Bill",
            render: (rowData) => (
              rowData.pdf ? (
                <a
                  href={`${serverURL}/images/${rowData.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    background: "#007BFF",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                >
                  View PDF
                </a>
              ) : (
                <span style={{ color: "red" }}>No PDF Available</span>
              )
            ),
          },



          {
            title: "Authority's Signature",
            field: "signatures",
            filtering: false,
            render: (rowData) =>
              rowData.signature ? (
                <img src={rowData.signatures} alt="signature" width={500} height={80} />
              ) : (
                "No Signature"
              ),
          },




          {
            title: "Warranty Years",
            render: (rowData) => (
              <div>
                {rowData.productdetailsid}
                {rowData.warrantyyears}
              </div>
            ),
          },
        ]}
        data={productDetailsList}
        actions={[
          {
            icon: "photooutlined",
            tooltip: "Edit Picture",
            onClick: (event, rowData) => handleOpenPicture(rowData),
          },

          {
            icon: "edit",
            tooltip: "Edit Product",
            onClick: (event, rowData) => handleOpen(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Product",
            onClick: (event, rowData) => handleDelete(rowData),
          },
          {
            icon: "add",
            tooltip: "Add Product",
            isFreeAction: true,
            onClick: (event) => navigate("/dashboard/productdetails"),
          },
        ]}
      />
    );
  };

  return (
    <div className={useStyle.root}>
      <div className={useStyle.displaybox}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            style={{
              borderRadius: "20px",
              width: "100%",
            }}
          >
            {displayProducts()}
            {editProductDialog()}

            {editPictureDialog()}
          </Grid>
        </Grid>
        <div></div>
      </div>
    </div>
  );
}