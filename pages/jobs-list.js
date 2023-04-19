import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  TextField,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import { AppSection, AppHeader } from "components/common.js";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ComputerIcon from "@mui/icons-material/Computer";
import { Api } from "../utils/api.js";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

export default function JobsList() {
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  //State to open and close the Dialog
  const [open, setOpen] = React.useState(false);
  //State to edit jobs and send to backend
  const [isDeleting, setIsDeleting] = useState(false);
  //State to selectRow and put in the Dialog to edit
  const [selectedRowIndex, setSelectedRowIndex] = useState();
  const [jobs, setJobs] = useState({ rows: [] });
  //The main state, save all the info here basically
  const [data, setData] = useState();
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState();

  const columns = [
    { field: "company_name", headerName: "Company", width: 300 },
    { field: "job_position", headerName: "Job Position", width: 300 },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() =>
              handleOpen(
                params.row.job_id,
                params.row.company_name,
                params.row.job_position,
                params.row.description
              )
            }
          >
            <EditIcon fontSize="small" variant="outlined" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.job_id)}
            disabled={isDeleting}
            style={{ cursor: isDeleting ? "wait" : "pointer" }}
          >
            {isDeleting ? (
              <HourglassBottomIcon color="error" fontSize="small" />
            ) : (
              <DeleteIcon fontSize="small" color="secondary" />
            )}
          </IconButton>
          <Link href={`/applicants/${params.row.job_id}`}>
            <IconButton>
              <ComputerIcon color="success" fontSize="small" />
            </IconButton>
          </Link>
        </>
      ),
    },
  ];
  //Save the info edited
  function handleChange(e) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }
  //save the info in data and preview in the Dialog to edit
  function handleOpen(
    rowIndex,
    rowCompanyName,
    rowJobPosition,
    rowDescription
  ) {
    const dados = {
      job_id: rowIndex,
      company_name: rowCompanyName,
      job_position: rowJobPosition,
      description: rowDescription,
    };
    setData(dados);
    setOpen(true);
  }

  //Save the row you want to delete
  function handleDelete(rowDelete) {
    setIsDeleting(true);
    Api.delete(`jobs/${rowDelete}`, {headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }})
      .then((response) => {
        console.log(response);
        setData({ company_name: "", job_position: "", description: "" });
        fetchJobs();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  function fetchJobs() {
    Api.get(`jobs?page=${page}&perPage=${perPage}`)
      .then((response) => {
        setJobs((prevState) => ({ ...prevState, rows: response.data.data }));
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
  //only to print the data
  useEffect(() => {
    console.log(data);
  }, [data]);
  //Close the DialogForm
  const handleClose = () => {
    setSelectedRowIndex(null);
    setOpen(false);
    console.log("handleClose");
  };
  //Close the Dialog and confirm data to update(this const is called when you click on subscrive)
  const handleUpdate = () => {
    setIsUpdating(true);
    Api.put(`jobs/${data.job_id}`, data , {headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }})
      .then((response) => {
        console.log(response);
        fetchJobs();
        setData({ company_name: "", job_position: "", description: "" });
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };
  //useEffect to Load the data on table
  useEffect(() => {
    setLoading(true);
    fetchJobs();
  }, [page]);

  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Active Jobs</Typography>
      </AppHeader>
      <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}></Box>
      <Box sx={{ height: 400, width: 750, margin: "auto" }}>
        <DataGrid
          auto-height
          rowSelection="false"
          rows={jobs.rows}
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
          getRowId={(row) => row.job_id}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={false}
        fullWidth={true}
      >
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            margin="normal"
            variant="outlined"
            label="Company Name"
            name="company_name"
            value={data?.company_name || ""}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            margin="normal"
            variant="outlined"
            label="Job Position"
            name="job_position"
            value={data?.job_position || ""}
            onChange={handleChange}
          />

          <TextField
            id="outlined-basic"
            margin="normal"
            multiline={true}
            minRows="10"
            maxRows="25"
            variant="outlined"
            fullWidth={true}
            label="Description"
            name="description"
            value={data?.description || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            endIcon={isUpdating ? <HourglassBottomIcon /> : null}
          >
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </AppSection>
  );
}
