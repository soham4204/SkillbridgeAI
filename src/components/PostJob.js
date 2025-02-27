import React, { useState } from "react";
import { 
  Box, Button, TextField, Typography, MenuItem, Select, 
  FormControl, InputLabel, Paper, Chip, Grid, Container, 
  Snackbar, Alert 
} from "@mui/material";
import { db } from "../firebase-config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

const jobCategories = {
  "Software Engineer": "Software Development",
  "Data Scientist": "Data Science & AI",
  "Frontend Developer": "Software Development",
  "Backend Developer": "Software Development",
  "Machine Learning Engineer": "Data Science & AI",
  "DevOps Engineer": "IT & Cloud",
  "Cybersecurity Analyst": "Cybersecurity"
};

const jobRoles = Object.keys(jobCategories);

const PostJob = ({ employerId }) => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleJobTitleChange = (e) => setJobTitle(e.target.value);
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const resetForm = () => {
    setJobTitle('');
    setJobDescription('');
    setSalary('');
    setJobType('');
    setSkills([]);
    setSkillInput('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the current user ID (assuming you're using Firebase Authentication)
    const userId = auth.currentUser?.uid;
    
    // Check if user is authenticated
    if (!userId) {
      setSnackbar({ 
        open: true, 
        message: 'Error: User not authenticated', 
        severity: 'error' 
      });
      return;
    }
    
    try {
      const jobData = {
        jobTitle,
        jobDescription,
        category: jobCategories[jobTitle] || '',
        salary,
        jobType,
        requiredSkills: skills,
        userId: userId,  // Store the current user's ID
        status: "active", // Set the status as active
        datePosted: new Date().toISOString()
      };
  
      // Add job document to Firestore
      const docRef = await addDoc(collection(db, "jobs"), jobData);
  
      // Update the job document with its own ID
      await updateDoc(doc(db, "jobs", docRef.id), {
        jobId: docRef.id
      });
  
      setSnackbar({ 
        open: true, 
        message: 'Job posted successfully!', 
        severity: 'success' 
      });
  
      resetForm();
      
    } catch (error) {
      console.error("Error posting job: ", error);
      setSnackbar({ 
        open: true, 
        message: `Error posting job: ${error.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Post a New Job
      </Typography>
      
      {/* Job Form */}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Job Title</InputLabel>
                <Select 
                  value={jobTitle} 
                  onChange={handleJobTitleChange} 
                  required
                  label="Job Title"
                >
                  {jobRoles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Category" 
                variant="outlined" 
                value={jobCategories[jobTitle] || ''} 
                disabled 
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Job Description" 
                variant="outlined" 
                multiline 
                rows={4} 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)} 
                required 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Salary (₹)" 
                type="number" 
                variant="outlined" 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
                required 
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select 
                  value={jobType} 
                  onChange={(e) => setJobType(e.target.value)} 
                  required
                  label="Job Type"
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField 
                  fullWidth 
                  label="Add Skills" 
                  variant="outlined" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} 
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddSkill}
                  sx={{ height: 56 }}
                >
                  Add
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {skills.map((skill) => (
                  <Chip 
                    key={skill} 
                    label={skill} 
                    onDelete={() => handleRemoveSkill(skill)} 
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  onClick={resetForm}
                >
                  Clear
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  Post Job
                </Button>
                <Button 
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/manage-jobs')}
                >
                  View My Jobs
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Success/Error Alerts */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostJob;