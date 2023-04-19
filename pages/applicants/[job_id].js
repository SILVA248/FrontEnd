import { useRouter } from "next/router";
import { IconButton, Typography, Box, Button } from "@mui/material";
import { AppSection, AppHeader } from "components/common";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Api } from "../../utils/api.js";

export default function Applicants() {
  const router = useRouter();
  const { job_id } = router.query;

  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState();
  const [data, setData] = useState();
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
    {
      field: "Actions",
      headerNameName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton>
            <EditIcon fontSize="small" variant="outlined" />
          </IconButton>

          <IconButton>
            <DeleteIcon fontSize="small" color="secondary" />
          </IconButton>
        </>
      ),
    },
  ];

  function fetchApplications() {
    Api.get(`applicants?job_id=${job_id}&page=${page}&perPage=${perPage}`)
      .then((response) => {
        setApplications((prevState) => ({
          ...prevState,
          rows: response.data.data,
        }));
        setRowCount(response.data.totalCount);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!job_id) {
      return;
    }
    setLoading(true);
    fetchApplications();
  }, [page, job_id]);

  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Applications List</Typography>
      </AppHeader>
      <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}></Box>
      <Box sx={{ height: 400, width: "100%" }}>
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
