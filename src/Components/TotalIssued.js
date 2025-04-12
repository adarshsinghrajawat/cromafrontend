import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import { getData, postData,serverURL } from "../services/FetchNodeServices";
// import * as XLSX from "xlsx";
import logo1 from "../Assets/logo1.png"
import * as XLSX from "xlsx-js-style";

import MenuItem from "@mui/material/MenuItem";
import "../App.css";

// Styles
const useStyles = makeStyles({
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
  box: {
    width: "700px",
    height: "auto",
    padding: "1.5%",
    borderRadius: "10px",
  },
});

export default function TotalIssued() {
  const classes = useStyles();
  const navigate = useNavigate();

  // State Management
  const [issuedItemsList, setIssuedItemsList] = useState([]);
  const [productDetailsList, setProductDetailsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

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
  const [categoryId, setCategoryId] = useState("");
  const [modelno, setModelno] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [files, setFiles] = useState([]);
  const [issue, setIssue] = useState("");

  // Fetch Functions
  const fetchAllIssuedItems = async () => {
    let result = await getData("productdetails/fetch_all_issued");
    let productDetailsResponse = await getData("productdetails/fetch_product_details");
    let employeeResponse = await getData("productdetails/fetch_all_employees");
    let brandsResponse = await getData("brands/display_all_brands");

    let productDetails = productDetailsResponse.data;
    let employees = employeeResponse.data;
    let brands = brandsResponse.data;

    let productMap = {};
    productDetails.forEach((item) => {
      productMap[item.productid] = item.productname;
    });

    let employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp.employeeid] = emp.employeename;
    });

    let brandMap = {};
    brands.forEach((brand) => {
      brandMap[brand.brandid] = brand.brandname;
    });

    let issuedMap = {};
    result.data.forEach((item) => {
      issuedMap[item.productid] = (issuedMap[item.productid] || 0) + 1;
    });

    let issuedData = result.data.map((item) => ({
      ...item,
      productname: productMap[item.productid] || "Unknown",
      employeename: employeeMap[item.employeeid] || "Unknown",
      brandname: brandMap[item.brandid] || "Unknown",
      totalIssued: parseInt(item.stock),
      status: issuedMap[item.productid] === 1 ? "New" : "Old",
      description: item.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
    }));

    setIssuedItemsList(issuedData);
  };

  const fetchAllProductDetails = async () => {
    var result = await getData("productdetails/fetch_product_details");
    setProductDetailsList(result.data);
  };

  const fetchAllProducts = async () => {
    var result = await getData("products/display_all_products");
    setProductsList(result.data);
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

  const fetchBrand = async () => {
    try {
      const result = await getData("brands/display_all_brands");
      if (result && result.data) {
        console.log("Fetched Brands: ", result.data);
        setBrandsList(result.data);
      } else {
        console.error("fetchBrand: No data received", result);
      }
    } catch (error) {
      console.error("fetchBrand: Error fetching brands", error);
    }
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    fetchBrandByCategory(event.target.value);
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

  useEffect(() => {
    fetchAllCategory();
    fetchAllProducts();
    fetchAllProductDetails();
    fetchBrand();
  }, []);

  useEffect(() => {
    fetchAllIssuedItems();
  }, []);

const handleExportToExcel = () => {
  const columnOrder = [
    "S.No.",
    "employeename",
    "productname",
    "brandname",
    "itemcode",
    "modelno",
    "color",
    "price",
    "description",
    "date",
    "time",
    "totalIssued",
    "status"
  ];

  const formatDate = (rawDate) => {
    const dateObj = new Date(rawDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredData = issuedItemsList.map((item, index) => {
    const newItem = {
      "S.No.": index + 1,
    };
    columnOrder.slice(1).forEach((key) => {
      newItem[key] = key === "date" ? formatDate(item[key]) : item[key];
    });
    return newItem;
  });

  const wsData = [columnOrder, ...filteredData.map(obj => columnOrder.map(key => obj[key]))];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Bold only the first row (header row)
  for (let C = 0; C < columnOrder.length; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true }
      };
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Issued Items");
  XLSX.writeFile(wb, "IssuedItems.xlsx");
};

  
  
  
  
  
  const handleDelete = async (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let body = { issueditemid: rowData.issueditemid };
        await postData("issueditems/delete_issued_item", body);
        fetchAllIssuedItems();
        Swal.fire("Deleted!", "Issued Item has been deleted.", "success");
      }
    });
  };

  const displayIssuedItems = () => {
    return (
      <MaterialTable
      title={<div style={{display:"flex", flexDirection:"row", margin:20, justifyContent:"space-between", width:"100%"}}>
      <div>
          <img src={logo1} width={120} height={50}/>
          <div style={{fontFamily: 'Kalam', fontWeight:"bold"}}>
          Issued Item List
      </div>
      </div></div>}
        columns={[
          { title: "Employee Name", field: "employeename", filtering: true },
          { title: "Product Name", field: "productname", filtering: true },
          { title: "Brand Name", field: "brandname", filtering: true },
          { title: "Item Code", field: "itemcode", filtering: true },
          { title: "Model No.", field: "modelno", filtering: true },
          { title: "Color", field: "color", filtering: true },
          { title: "Price", field: "price", filtering: true },
          { title: "Description", field: "description", filtering: true },
          { title: "Date of Issued", field: "date", filtering: true, type: "date" },
          { title: "Time of Issued", field: "time", filtering: true },
          { title: "Total Issued", field: "totalIssued", filtering: true, type: "numeric" },
          { title: "Status", field: "status", filtering: true },
          
          { title: 'Picture', render: (rowData) => <Avatar src={`${serverURL}/images/${rowData.picture}`} ></Avatar> },


          {
            title: "Signature",
            field: "signature",
            filtering: false,
            render: (rowData) =>
              rowData.signature ? (
                <img src={rowData.signature} alt="signature" width={500} height={80} />
              ) : (
                "No Signature"
              ),
          },

          
        ]}
        data={issuedItemsList}
        options={{
          maxBodyHeight: "500px",
          pageSize: 10,
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Issued Item",
            onClick: (event, rowData) => console.log("Edit", rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Issued Item",
            onClick: (event, rowData) => handleDelete(rowData),
          },
          {
            icon: "add",
            tooltip: "Add Issued Item",
            isFreeAction: true,
            onClick: () => navigate("/dashboard/issued"),
          },
          {
            icon: "save_alt",
            tooltip: "Export to Excel",
            isFreeAction: true,
            onClick: () => handleExportToExcel(),
          },
        ]}
      />
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.displaybox}>
        <Grid container spacing={3}>
          <Grid item xs={12}>{displayIssuedItems()}</Grid>
        </Grid>
      </div>
    </div>
  );
}
