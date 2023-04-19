import {
  Typography,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Drawer,
  TextField,
} from "@mui/material";
import { AppSection, AppHeader } from "components/common";
import { useState, useEffect } from "react";
import { Api } from "../utils/api.js";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function JobDetails(props) {
  const [isCreating, setIsCreating] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_id: "",
    linkedinURL: "",
    salaryExp: "",
  });

  const { job } = props;

  function handleChange(e) {
    const { name, value } = e.target;

    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  function sendData() {
    const info = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      job_id: job.job_id,
      linkedinURL: data.linkedinURL,
      salaryExp: data.salaryExp,
    };
    setIsCreating(true);
    Api.post(`applicants`, info)
      .then((response) => {
        console.log(response);
        setData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          job_id: "",
          linkedinURL: "",
          salaryExp: "",
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsCreating(false);
      });
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 800,
          minWidth: 800,
          mb: 3,
          borderRadius: 2,
          height: "auto",
          m: 1,
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            {job.company_name}
          </Typography>
          <Typography variant="body2">{job.job_position}</Typography>
          <Typography variant="body2">{job.description}</Typography>
        </CardContent>
      </Card>
      <div>
        <TextField
          id="outlined-basic"
          label="First Name"
          variant="outlined"
          sx={{ m: 1 }}
          name="first_name"
          value={data.first_name}
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          sx={{ m: 1 }}
          label="Last Name"
          variant="outlined"
          name="last_name"
          value={data.last_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          sx={{ m: 1 }}
          name="email"
          value={data.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          id="outlined-basic"
          sx={{ m: 1 }}
          label="Phone"
          variant="outlined"
          name="phone"
          value={data.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          id="outlined-basic"
          label="Linkedin URL"
          variant="outlined"
          sx={{ m: 1 }}
          name="linkedinURL"
          value={data.linkedinURL}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          id="outlined-basic"
          sx={{ m: 1 }}
          label="Salary Expected"
          variant="outlined"
          name="salaryExp"
          value={data.salaryExp}
          onChange={handleChange}
        />
      </div>
      <Button
        variant="contained"
        disabled={
          data.first_name === "" ||
          data.last_name === "" ||
          data.email === "" ||
          data.phone === "" ||
          data.linkedinURL === "" ||
          data.salaryExp === "" ||
          isCreating
        }
        onClick={sendData}
        endIcon={isCreating ? <HourglassBottomIcon /> : null}
      >
        Create
      </Button>
    </>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState({ rows: [] });
  const [selectedJob, setSelectedJob] = useState(null);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0)

  function fetchJobs() {
    Api.get(`client?page=${page - 1}&perPage=${perPage}`)
      .then((response) => {
        setJobs((prevState) => ({ ...prevState, rows: response.data.data }));
        setRowCount(Math.ceil(response.data.total / perPage))
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        console.log(jobs);
      });
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Jobs Availables</Typography>
      </AppHeader>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {jobs.rows.map((job) => (
          <Card
            key={job.id}
            variant="outlined"
            sx={{ maxWidth: 600, borderRadius: 2, height: "auto", m: 3 }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                {job.company_name}
              </Typography>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
              >
                {job.job_position}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {job.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelectedJob(job)}>
                Apply
              </Button>
            </CardActions>
          </Card>
        ))}
        <Stack spacing={2}>
          <Pagination 
              count={rowCount}
              page ={page}
              onChange={(event, value) => {
                setPage(value);
              }}
              shape="rounded"
              justify="center" />
        </Stack>
      </Box>
      <Drawer
        anchor="right"
        open={selectedJob != null}
        onClose={() => setSelectedJob(null)}
      >
        <Box sx={{ Width: 350, borderRadius: 2, height: 500, m: 3 }}>
          {selectedJob != null && <JobDetails job={selectedJob} />}
        </Box>
      </Drawer>
    </AppSection>
  );
}