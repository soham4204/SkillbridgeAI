import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Select, MenuItem, FormControl,
  InputLabel, Grid, Divider, Chip
} from "@mui/material";
import { Work, Category, Money, LocationOn, Build } from "@mui/icons-material";

const jobListings = [
  { title: "Software Engineer", category: "Software", type: "Full-time", salary: "₹12,00,000", skills: ["JavaScript", "React", "Node.js"] },
  { title: "Data Scientist", category: "Software", type: "Full-time", salary: "₹15,00,000", skills: ["Python", "TensorFlow", "SQL"] },
  { title: "Frontend Developer", category: "Software", type: "Remote", salary: "₹10,00,000", skills: ["HTML", "CSS", "JavaScript", "React"] },
  { title: "Backend Developer", category: "Software", type: "Full-time", salary: "₹13,00,000", skills: ["Node.js", "Express", "MongoDB"] },
  { title: "Machine Learning Engineer", category: "AI/ML", type: "Full-time", salary: "₹18,00,000", skills: ["Python", "PyTorch", "Scikit-Learn"] },
  { title: "DevOps Engineer", category: "Cloud/DevOps", type: "Full-time", salary: "₹14,00,000", skills: ["Docker", "Kubernetes", "AWS"] },
  { title: "Cybersecurity Analyst", category: "Security", type: "Part-time", salary: "₹11,00,000", skills: ["Network Security", "Penetration Testing", "SIEM"] },
];


const JobListings = () => {
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");

  // Filter jobs based on selected category and job type
  const filteredJobs = jobListings.filter(
    (job) =>
      (category === "" || job.category === category) &&
      (jobType === "" || job.type === jobType)
  );


  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 4, maxWidth: "1200px", margin: "auto" }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Job Listings
        </Typography>


        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="AI/ML">AI/ML</MenuItem>
              <MenuItem value="Cloud/DevOps">Cloud/DevOps</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </FormControl>


          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Job Type</InputLabel>
            <Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </Select>
          </FormControl>
        </Box>


        {/* Job Listings */}
        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    padding: 2,
                    background: "linear-gradient(135deg, #f5f7fa, #e6eef8)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardContent>
                    {/* Job Title */}
                    <Typography variant="h6" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Work color="primary" /> {job.title}
                    </Typography>
                   
                    <Divider sx={{ marginY: 1 }} />


                    {/* Job Details */}
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <Category fontSize="small" /> {job.category}
                    </Typography>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}>
                      <LocationOn fontSize="small" /> {job.type}
                    </Typography>
                    <Typography fontWeight="bold" color="secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Money fontSize="small" /> {job.salary} per year
                    </Typography>


                    <Divider sx={{ marginY: 2 }} />


                    {/* Required Skills */}
                    <Typography fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Build color="primary" /> Required Skills:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                      {job.skills.map((skill, i) => (
                        <Chip key={i} label={skill} sx={{ background: "#e0f2f1", fontWeight: "bold" }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No jobs found.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};


export default JobListings;