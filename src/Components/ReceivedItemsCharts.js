import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { getData } from "../services/FetchNodeServices";
import { Typography, Paper, Grid } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6680", "#85C1E9", "#FF5733"];

const ReceivedItemsCharts = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchReceivedData = async () => {
      let result = await getData("productdetails/fetch_all_received");
      let productDetailsResponse = await getData("productdetails/fetch_product_details");
      
      let productDetails = productDetailsResponse.data;
      let productMap = {};
      
      productDetails.forEach((item) => {
        productMap[item.productid] = item.productname;
      });

      let receivedCount = {};
      result.data.forEach((item) => {
        receivedCount[item.productid] = (receivedCount[item.productid] || 0) + parseInt(item.stock);
      });

      let formattedData = Object.keys(receivedCount).map((productid) => ({
        name: productMap[productid] || "Unknown",
        value: receivedCount[productid],
      }));

      setChartData(formattedData);
    };

    fetchReceivedData();
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center">
      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Paper elevation={6} style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Stock Overview - Bar Chart
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.3)" }} />
              <Legend />
              <Bar dataKey="value" name="Stock" barSize={50} fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Paper elevation={6} style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Stock Distribution - Pie Chart
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReceivedItemsCharts;