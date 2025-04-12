import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Paper, Typography, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { getData } from "../services/FetchNodeServices";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6680", "#85C1E9", "#FF5733"];

const ProductQuantityCharts = () => {
  const [chartData, setChartData] = useState({ received: [], issued: [] });
  const [showReceived, setShowReceived] = useState(true);
  const [showIssued, setShowIssued] = useState(false);
  const [showPieChart, setShowPieChart] = useState(true);
  const [showBarChart, setShowBarChart] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let receivedResult = await getData("productdetails/fetch_all_received");
      let issuedResult = await getData("productdetails/fetch_all_issued");
      let productDetailsResponse = await getData("productdetails/fetch_product_details");

      let productDetails = productDetailsResponse.data;
      let productMap = {};
      productDetails.forEach((item) => {
        productMap[item.productid] = item.productname;
      });

      const processData = (data) => {
        let count = {};
        data.forEach((item) => {
          count[item.productid] = (count[item.productid] || 0) + parseInt(item.stock);
        });
        return Object.keys(count).map((productid) => ({
          name: productMap[productid] || "Unknown",
          value: count[productid],
        }));
      };

      setChartData({
        received: processData(receivedResult.data),
        issued: processData(issuedResult.data),
      });
    };

    fetchData();
  }, []);

  const dataToShow = showReceived ? chartData.received : showIssued ? chartData.issued : [];

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={showReceived} onChange={() => setShowReceived(!showReceived)} />}
          label="Show Received Inventory"
        />
        <FormControlLabel
          control={<Checkbox checked={showIssued} onChange={() => setShowIssued(!showIssued)} />}
          label="Show Issued Inventory"
        />
        <FormControlLabel
          control={<Checkbox checked={showPieChart} onChange={() => setShowPieChart(!showPieChart)} />}
          label="Show Pie Chart"
        />
        <FormControlLabel
          control={<Checkbox checked={showBarChart} onChange={() => setShowBarChart(!showBarChart)} />}
          label="Show Bar Chart"
        />
      </Grid>

      {showBarChart && (
        <Grid item xs={12} md={6}>
          <Paper elevation={6} style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Inventory - Bar Chart
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dataToShow} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.3)" }} />
                <Legend />
                <Bar dataKey="value" fill="#4CAF50" barSize={60} animationDuration={1200} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}

      {showPieChart && (
        <Grid item xs={12} md={6}>
          <Paper elevation={6} style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Inventory - Pie Chart
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dataToShow}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {dataToShow?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductQuantityCharts;
