import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { getData, serverURL } from "../services/FetchNodeServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Avatar, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx-js-style";
import logo1 from "../Assets/logo1.png"
const TotalReceived = () => {
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllInitialData();
  }, []);

  const fetchAllInitialData = async () => {
    const [receivedRes, categoryRes, productRes, employeeRes, brandRes] = await Promise.all([
      getData("productdetails/fetch_all_received"),
      getData("category/display_all_category"),
      getData("products/display_all_products"),
      getData("productdetails/fetch_all_employees"),
      getData("brands/display_all_brands"),
    ]);

    setCategoryList(categoryRes.data);
    setProductsList(productRes.data);
    setEmployeeList(employeeRes.data);
    setBrandList(brandRes.data);

    if (receivedRes.status) {
      const mapped = receivedRes.data.map((item) => ({
        ...item,
        employeeName: getEmployeeName(employeeRes.data, item.employeeid),
        productName: getProductName(productRes.data, item.productid),
        brandName: getBrandName(brandRes.data, item.brandid),
        cleanDescription: item.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
      }));
      setData(mapped);
    } else {
      Swal.fire("Error", receivedRes.message, "error");
    }
  };

  const getCategoryName = (list, id) => list.find(cat => cat.categoryid === id)?.categoryname || "Unknown";
  const getProductName = (list, id) => list.find(prod => prod.productid === id)?.productname || "Unknown";
  const getBrandName = (list, id) => list.find(br => br.brandid === id)?.brandname || "Unknown";
  const getEmployeeName = (list, id) => list.find(emp => emp.employeeid === id)?.employeename || "Unknown";

  const handleExportToExcel = () => {
    const formatDate = (rawDate) => {
      const dateObj = new Date(rawDate);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const formattedData = data.map(item => ({
      "Received ID": item.receivedid,
      "Employee Name": item.employeeName,
      "Product Name": item.productName,
      "Brand Name": item.brandName,
      "Item Code": item.itemcode,
      "Model No": item.modelno,
      "Color": item.color,
      "Price": item.price,
      "Description": item.cleanDescription,
      "Status": item.status,
      "Date of Return": formatDate(item.returndate),
      "Time of Received": item.time,
      "Total Stock": item.stock,
    }));
  
    const ws = XLSX.utils.json_to_sheet(formattedData);
  
    // Bold header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = { font: { bold: true } };
    }
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TotalReceived");
    XLSX.writeFile(wb, "TotalReceived.xlsx", { cellStyles: true });
  };
  

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2%",
    }}>
      <div style={{
        width: "1200px",
        height: "auto",
        padding: "1.5%",
        borderRadius: "10px",
        backgroundColor: "#fff"
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MaterialTable
                   title={<div style={{display:"flex", flexDirection:"row", margin:20, justifyContent:"space-between", width:"100%"}}>
                   <div>
                       <img src={logo1} width={120} height={50}/>
                       <div style={{fontFamily: 'Kalam', fontWeight:"bold"}}>
                      Total Returned Products 
                   </div>
                   </div></div>}
              columns={[
                { title: "Employee Name", field: "employeeName", filtering: true },
                { title: "Product Name", field: "productName", filtering: true },
                { title: "Brand Name", field: "brandName", filtering: true },
                { title: "Item Code", field: "itemcode", filtering: true },
                { title: "Model No", field: "modelno", filtering: true },
                { title: "Color", field: "color", filtering: true },
                { title: "Price", field: "price", type: "numeric" },
                { title: "Description", field: "cleanDescription", filtering: true },
                { title: "Status", field: "status", filtering: true },
                { title: "Date of Received", field: "returndate", type: "date" },
                { title: "Time of Received", field: "time" },
                { title: "Total Stock", field: "stock", type: "numeric" },
                {
                  title: "Picture",
                  render: (rowData) => <Avatar src={`${serverURL}/images/${rowData.picture}`} />
                },
                {
                  title: "Signature",
                  render: (rowData) =>
                    rowData.signature ? (
                      <img src={rowData.signature} alt="signature" width={400} height={120} />
                    ) : (
                      "No Signature"
                    ),
                },
              ]}
              data={data}
              options={{
                maxBodyHeight: "500px",
                pageSize: 10,
                search: true,
                filtering: true,
                actionsColumnIndex: -1,
              }}
              actions={[
                {
                  icon: () => <IconButton><AddIcon /></IconButton>,
                  tooltip: "Add New Product",
                  isFreeAction: true,
                  onClick: () => navigate("/dashboard/received"),
                },
                {
                  icon: "save_alt",
                  tooltip: "Export to Excel",
                  isFreeAction: true,
                  onClick: handleExportToExcel,
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TotalReceived;
