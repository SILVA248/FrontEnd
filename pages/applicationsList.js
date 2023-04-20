import { Typography, Box } from "@mui/material";
import { AppSection, AppHeader } from "components/common";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Api } from "../utils/api.js";

export default function ApplicationsList() {
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState();
  const [applications, setApplications] = useState({ rows: [] });
  const columns = [
    {
      field: "full_name",
      headerName: "Name",
      width: 200,
      valueGetter: (params) =>
        params.row.first_name + " " + params.row.last_name,
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "linkedinURL", headerName: "Linkedin", width: 150 },
    { field: "salaryExp", headerName: "SalaryExp", width: 150 },
  ];

  function fetchApplications() {
    console.log(localStorage.getItem("token"));
    Api.get(`applications?page=${page}&perPage=${perPage}`)
      .then((response) => {
        setApplications((prevState) => ({
          ...prevState,
          rows: response.data.data,
        }));
        setRowCount(response.data.total);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, [page]);

  useEffect(() => {
    console.log("teste");
  }, []);

  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Applications List</Typography>
      </AppHeader>
      <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}></Box>
      <Box sx={{ height: 400, width: 850, margin: "auto" }}>
        <DataGrid
          auto-height
          rowSelection="false"
          rows={applications.rows}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          page={page}
          pageSize={perPage}
          rowCount={rowCount}
          rowsPerPageOptions={[20, 5, 10]}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
          onPageSizeChange={(newPageSize) => {
            setPerPage(newPageSize);
          }}
          getRowId={(row) => row.application_id}
        />
      </Box>
    </AppSection>
  );
}
