import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, IconButton } from "@mui/material";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { makeStyles } from "@mui/styles";
import { getData,postData } from "../services/FetchNodeServices";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import "../App.css";
import logo1 from "../Assets/logo1.png"
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
});

export default function DisplayAllProductDetails() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [productDetailsList, setProductDetailsList] = useState([]);
  const [issuedItemsList, setIssuedItemsList] = useState([]);
  const [receivedItemsList, setReceivedItemsList] = useState([]);

  const fetchAllProductDetails = async () => {
    let result = await getData("productdetails/fetch_product_details");
    let aggregatedData = {};
    result.data.forEach((item) => {
      if (aggregatedData[item.productid]) {
        aggregatedData[item.productid].stock += parseInt(item.stock);
      } else {
        aggregatedData[item.productid] = { ...item, stock: parseInt(item.stock) };
      }
    });
    setProductDetailsList(Object.values(aggregatedData));
  };



  const handleImportFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      // Optional: Validate data format before sending
      const result = await postData("productdetails/import_from_excel", { data: jsonData });
  
      if (result.status) {
        Swal.fire("✅ Success!", "Products imported successfully.", "success");
        fetchAllProductDetails();
        fetchAllIssuedItems();
        fetchAllReceivedItems();
      } else {
        Swal.fire("❌ Error", "Failed to import products.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };
  

  const fetchAllIssuedItems = async () => {
    let result = await getData("productdetails/fetch_all_issued");
    let aggregatedData = {};
    result.data.forEach((item) => {
      if (aggregatedData[item.productid]) {
        aggregatedData[item.productid].totalIssued += parseInt(item.stock);
      } else {
        aggregatedData[item.productid] = { ...item, totalIssued: parseInt(item.stock) };
      }
    });
    setIssuedItemsList(Object.values(aggregatedData));
  };

  const fetchAllReceivedItems = async () => {
    let result = await getData("productdetails/fetch_all_received");
    let aggregatedData = {};
    result.data.forEach((item) => {
      if (aggregatedData[item.productid]) {
        aggregatedData[item.productid].totalReceived += parseInt(item.stock);
      } else {
        aggregatedData[item.productid] = { ...item, totalReceived: parseInt(item.stock) };
      }
    });
    setReceivedItemsList(Object.values(aggregatedData));
  };

  useEffect(() => {
    fetchAllProductDetails();
    fetchAllIssuedItems();
    fetchAllReceivedItems();
  }, []);

  const checkStockLevels = (products) => {
    const lowStockItems = products.filter((item) => item.remainingStock < 15 && item.remainingStock > 0);
    const outOfStockItems = products.filter((item) => item.remainingStock === 0);

    if (lowStockItems.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Low Stock Alert! ⚠️",
        html: `<ul>${lowStockItems.map(item => `<li><b>${item.productname}</b>: ${item.remainingStock}</li>`).join('')}</ul>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#ff9800",
      }).then(() => {
        if (outOfStockItems.length > 0) {
          Swal.fire({
            icon: "error",
            title: "❌ Out of Stock Alert! ❌",
            html: `<ul>${outOfStockItems.map(item => `<li><b>${item.productname}</b>: ${item.remainingStock}</li>`).join('')}</ul>`,
            confirmButtonText: "Restock Now",
            confirmButtonColor: "#d32f2f",
          });
        }
      });
    } else if (outOfStockItems.length > 0) {
      Swal.fire({
        icon: "error",
        title: "❌ Out of Stock Alert! ❌",
        html: `<ul>${outOfStockItems.map(item => `<li><b>${item.productname}</b>: ${item.remainingStock}</li>`).join('')}</ul>`,
        confirmButtonText: "Restock Now",
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  const handleExportToExcel = (mergedData) => {
    const formattedData = mergedData.map(item => ({
      "Product ID": item.productid,
      "Product Name": item.productname,
      "Stock": item.stock,
      "Total Issued": item.totalIssued,
      "Total Received": item.totalReceived,
      "Remaining Stock": item.remainingStock,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "ProductInventoryOverview.xlsx");
  };

  const displayProductsWithIssuedAndReceived = () => {
    const mergedData = productDetailsList.map((product) => {
      const issuedItem = issuedItemsList.find((item) => item.productid === product.productid);
      const receivedItem = receivedItemsList.find((item) => item.productid === product.productid);

      const totalIssued = issuedItem ? issuedItem.totalIssued : 0;
      const totalReceived = receivedItem ? receivedItem.totalReceived : 0;
      const remainingStock = product.stock - totalIssued + totalReceived;

      return {
        ...product,
        totalIssued,
        totalReceived,
        remainingStock,
      };
    });

    checkStockLevels(mergedData);

    return (
      <MaterialTable
      title={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
        <img src={logo1} alt="Box" style={{ height: '44px' }} />
        <span style={{marginTop:'2%',marginBottom:'3%'}}>📦 Product Inventory Overview 📦</span>
      </div>
      
      }
      // ...other props
    
        columns={[
          { title: "Product ID", field: "productid", filtering: true },
          { title: "Product Name", field: "productname", filtering: true },
          { title: "Stock", field: "stock", type: "numeric", filtering: true },
          { title: "Total Issued", field: "totalIssued", type: "numeric", filtering: true },
          { title: "Total Received", field: "totalReceived", type: "numeric", filtering: true },
          { title: "Remaining Stock", field: "remainingStock", type: "numeric", filtering: true },
        ]}
        data={mergedData}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#ff9800",
            color: "#fff",
            fontSize: "16px",
          },
          rowStyle: (rowData) => ({
            backgroundColor:
              rowData.remainingStock === 0
                ? "#ffcccc"
                : rowData.remainingStock < 150
                ? "#fff3cd"
                : "#ffffff",
            fontSize: "14px",
          }),
        }}
        actions={[
          {
            icon: () => <SaveAltIcon />,
            tooltip: "Export to Excel",
            isFreeAction: true,
            onClick: () => handleExportToExcel(mergedData),
          },
        ]}
      />
      
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.displaybox}>{displayProductsWithIssuedAndReceived()}</div>
    </div>
  );
}
