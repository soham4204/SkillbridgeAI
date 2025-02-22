import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import Home from "./routes/Home";
import LoginPage from "./routes/Login";
import SignupPage from "./routes/Signup";
import ContactUs from "./routes/ContactUs";
import ResumeBuilder from "./routes/ResumeBuilder";
import ResumeUpload from "./routes/ResumeUpload"; // Import the Jobseekers component
import AboutUs from "./routes/AboutUs";
import Jobseekers from "./routes/Dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dashboard } from "@mui/icons-material";
import InstructionalVideosPage from "./routes/InstructionalVideosPage";
import ResumeViewer from "./components/ResumeViewer";
import JobseekerDashboard from "./routes/Jobseeker-dashboard";
import ForgotPasswordPage from "./routes/forgotPassword";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobseeker-dashboard" element={<JobseekerDashboard />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/resume-viewer" element={<ResumeViewer />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/jobseekers" element={<Jobseekers />} /> 
            <Route path="/aboutus" element={<AboutUs />} /> 
            <Route path="/videos" element={<InstructionalVideosPage/>} />
            <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
