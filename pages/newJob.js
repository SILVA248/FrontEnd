import { Button, TextField, Typography, Box } from "@mui/material";
import { AppSection, AppHeader } from "components/common";
import React, { useState } from "react";
import axios from "axios";
import { Api } from "../utils/api.js";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

export default function NewJob() {
  const [isCreating, setIsCreating] = useState(false);
  const [data, setData] = useState({
    company_name: "",
    job_position: "",
    description: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    console.log(e);
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  function sendData() {
    const info = {
      company_name: data.company_name,
      job_position: data.job_position,
      description: data.description,
    };
    setIsCreating(true);
    Api.post(`newJob`, info)
      .then((response) => {
        console.log(response);
        setData({ company_name: "", job_position: "", description: "" });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsCreating(false);
      });
  }

  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Create a New Job</Typography>
      </AppHeader>
      <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}></Box>
      <div>
        <TextField
          id="outlined-basic"
          label="Company Name"
          variant="outlined"
          name="company_name"
          value={data.company_name}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          label="Job Position"
          variant="outlined"
          name="job_position"
          value={data.job_position}
          onChange={handleChange}
        />

        <TextField
          id="outlined-basic"
          margin="normal"
          label="Job Details"
          multiline={true}
          minRows="10"
          maxRows="25"
          variant="outlined"
          fullWidth={true}
          name="description"
          value={data.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Button
          variant="contained"
          disabled={
            data.company_name === "" ||
            data.job_position === "" ||
            data.description === "" ||
            isCreating
          }
          onClick={sendData}
          endIcon={isCreating ? <HourglassBottomIcon /> : null}
        >
          Create
        </Button>
      </div>
    </AppSection>
  );
}
