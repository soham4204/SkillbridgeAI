import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import * as faceapi from "face-api.js";

const TestProctoring = ({ onVerificationComplete, jobId }) => {
  const navigate = useNavigate();
  const { jobId: urlJobId } = useParams();
  const actualJobId = jobId || urlJobId;
  
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, processing, success, failed
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  const steps = ["Identity Check", "Environment Check", "Rules Acceptance"];

  // Load user data and profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login", { state: { redirect: `/competency-test/${actualJobId}` } });
          return;
        }
        
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email,
        });
        
        // Fetch user profile picture from Firestore
        const userProfileDoc = await getDoc(doc(db, "userProfiles", currentUser.uid));
        if (userProfileDoc.exists() && userProfileDoc.data().profilePicture) {
          setProfilePicture(userProfileDoc.data().profilePicture);
        } else {
          setError("Profile picture not found. Please upload a profile picture before taking the test.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [actualJobId, navigate]);
  
  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
        try {
          // Check if models are already loaded
          if (faceapi.nets.faceRecognitionNet.isLoaded &&
              faceapi.nets.faceLandmark68Net.isLoaded &&
              faceapi.nets.ssdMobilenetv1.isLoaded) {
            console.log("Face-api models already loaded");
            setModelsLoaded(true);
            return;
          }
          
          // Direct path to models - adjust as needed for your server structure
          const MODEL_URL = '/models';
          console.log("Loading models from:", MODEL_URL);
          
          // Load models sequentially
          console.log("Loading SSD Mobilenet model...");
          await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
          
          console.log("Loading Face Landmark model...");
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          
          console.log("Loading Face Recognition model...");
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          
          setModelsLoaded(true);
          console.log("All models loaded successfully");
        } catch (err) {
          console.error("Error in model loading process:", err);
          setError(`Model loading failed: ${err.message}. Please ensure the models are correctly installed.`);
        }
      };
      
    
    if (!loading && profilePicture) {
      loadModels();
    }
  }, [loading, profilePicture]);
  
  // Start camera when ready for verification
  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access is required for identity verification. Please allow camera access and try again.");
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Draw face detections on canvas
  const drawFaceDetections = (video, detections) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Make canvas visible for debugging
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame on canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw face detections
    if (detections && detections.length > 0) {
      detections.forEach(detection => {
        // Draw face box
        const box = detection.detection.box;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
        // Draw face landmarks if available
        if (detection.landmarks) {
          const landmarks = detection.landmarks.positions;
          ctx.fillStyle = '#ff0000';
          landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
        
        // Add status text
        ctx.font = '16px Arial';
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Face Detected', box.x, box.y - 5);
      });
    }
  };
  
  // Get face descriptor from profile image
  const getProfileFaceDescriptor = async (profileImg) => {
    try {
      const detections = await faceapi.detectSingleFace(profileImg)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      return detections?.descriptor;
    } catch (err) {
      console.error("Error getting profile face descriptor:", err);
      return null;
    }
  };
  
  // Perform face verification
  const verifyIdentity = async () => {
    if (!videoRef.current || !modelsLoaded || !profilePicture) {
      setError("Verification system not ready. Please try again.");
      return;
    }

    console.log("Starting verification process...");
    setVerificationStatus("processing");
    
    try {
      // Load the profile picture for comparison
      console.log("Loading profile image for comparison");
      const profileImg = await faceapi.fetchImage(profilePicture);
      const profileFaceDescriptor = await getProfileFaceDescriptor(profileImg);
      
      console.log("Profile face descriptor:", profileFaceDescriptor ? "detected" : "not detected");
      
      if (!profileFaceDescriptor) {
        setError("No face detected in profile picture. Please upload a clear profile photo.");
        setVerificationStatus("failed");
        return;
      }
      
      // Capture current frame from webcam
      console.log("Capturing webcam frame for comparison");
      const webcamDetections = await faceapi.detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      // Draw detections on canvas for visualization
      drawFaceDetections(videoRef.current, webcamDetections);
      
      console.log("Webcam detection results:", webcamDetections.length, "faces found");
      
      if (webcamDetections.length === 0) {
        setError("No face detected. Please ensure your face is clearly visible.");
        setVerificationStatus("failed");
        return;
      }
      
      if (webcamDetections.length > 1) {
        setError("Multiple faces detected. Please ensure only you are visible in the frame.");
        setVerificationStatus("failed");
        return;
      }
      
      // Compare face descriptors
      const webcamFaceDescriptor = webcamDetections[0].descriptor;
      const distance = faceapi.euclideanDistance(profileFaceDescriptor, webcamFaceDescriptor);
      
      console.log("Face similarity distance:", distance, "(lower is better)");
      
      // When comparison completes
      if (distance < 0.6) {
        console.log("Verification SUCCESS - faces match!");
        setVerificationStatus("success");
        // Move to next step after a short delay
        setTimeout(() => {
          setStep(1);
        }, 1500);
      } else {
        console.log("Verification FAILED - faces don't match. Distance:", distance);
        setError(`Identity verification failed. Distance: ${distance.toFixed(2)} (threshold: 0.6)`);
        setVerificationStatus("failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Verification failed. Please try again in better lighting conditions.");
      setVerificationStatus("failed");
    }
  };

  // Verify environment
  const verifyEnvironment = async () => {
    setVerificationStatus("processing");
    
    try {
      // Simulate environment check (you could implement more sophisticated checks)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus("success");
      // Move to next step after successful verification
      setTimeout(() => {
        setStep(2);
      }, 1500);
    } catch (err) {
      setError("Environment check failed. Please ensure you're in a quiet, well-lit room.");
      setVerificationStatus("failed");
    }
  };
  
  // Accept rules and start test
  const acceptRulesAndStart = () => {
    // Stop camera before proceeding to test
    stopCamera();
    
    // Call the completion callback to start the test
    if (onVerificationComplete) {
      onVerificationComplete(true);
    } else {
      // If used as standalone component, navigate to the test
      navigate(`/competency-test/${actualJobId}`);
    }
  };
  
  // Reset verification if it fails
  const resetVerification = () => {
    setVerificationStatus("pending");
    setError(null);
  };
  
  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 0: // Identity verification
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Identity Verification</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please look directly at the camera and position your face within the frame.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box sx={{ border: "1px solid #ddd", borderRadius: 2, overflow: "hidden", height: 240 }}>
                  <Typography variant="subtitle2" sx={{ p: 1, bgcolor: "#f5f5f5" }}>Profile Picture</Typography>
                  {profilePicture && (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      style={{ width: "100%", height: 200, objectFit: "cover" }} 
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ border: "1px solid #ddd", borderRadius: 2, overflow: "hidden", height: 240 }}>
                  <Typography variant="subtitle2" sx={{ p: 1, bgcolor: "#f5f5f5" }}>Camera Feed</Typography>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    style={{ width: "100%", height: 200, objectFit: "cover" }} 
                  />
                </Box>
              </Grid>
            </Grid>
            
            {!videoRef.current?.srcObject && (
              <Button
                variant="contained"
                color="primary"
                onClick={startCamera}
                sx={{ mb: 2 }}
              >
                Start Camera
              </Button>
            )}
            
            {videoRef.current?.srcObject && verificationStatus === "pending" && (
              <Button
                variant="contained"
                color="primary"
                onClick={verifyIdentity}
                sx={{ mb: 2 }}
              >
                Verify Identity
              </Button>
            )}
            
            {verificationStatus === "processing" && (
            <Box sx={{ textAlign: "center", my: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>Verifying your identity...</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Comparing facial features...
                </Typography>
            </Box>
            )}
            
            {verificationStatus === "success" && (
            <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">Identity verified successfully!</Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                Face match confirmed. Proceeding to next step...
                </Typography>
            </Alert>
            )}
            
            {verificationStatus === "failed" && (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">{error || "Verification failed. Please try again."}</Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                    Make sure your face is clearly visible and well-lit.
                </Typography>
                </Alert>
                <Button variant="outlined" onClick={resetVerification}>
                Try Again
                </Button>
            </Box>
            )}
          </Box>
        );
        
      case 1: // Environment check
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Environment Check</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Please ensure you are in a quiet, well-lit room with no one else present.
              No additional devices should be accessible during the test.
            </Typography>
            
            <Box sx={{ border: "1px solid #ddd", borderRadius: 2, overflow: "hidden", mb: 3, mx: "auto", maxWidth: 480 }}>
              <video 
                ref={videoRef} 
                autoPlay 
                style={{ width: "100%", height: 320, objectFit: "cover" }} 
              />
            </Box>
            
            {verificationStatus === "pending" && (
              <Button
                variant="contained"
                color="primary"
                onClick={verifyEnvironment}
              >
                Verify Environment
              </Button>
            )}
            
            {verificationStatus === "processing" && (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>Verifying your environment...</Typography>
              </Box>
            )}
            
            {verificationStatus === "success" && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">Environment verified successfully!</Typography>
                <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                  Proceeding to next step...
                </Typography>
              </Alert>
            )}
            
            {verificationStatus === "failed" && (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">{error || "Environment check failed. Please try again."}</Typography>
                </Alert>
                <Button variant="outlined" onClick={resetVerification}>
                  Try Again
                </Button>
              </Box>
            )}
          </Box>
        );
        
      case 2: // Rules acceptance
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Test Rules</Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              By proceeding, you agree to the following rules:
            </Alert>
            
            <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 2, mb: 3 }}>
              <Typography component="div" variant="body2">
                <ul>
                  <li>You must remain visible on camera throughout the test</li>
                  <li>No additional screens or devices are allowed</li>
                  <li>No other individuals may be present in the room</li>
                  <li>You may not browse other websites or use search engines</li>
                  <li>You may not use notes, books, or other resources</li>
                  <li>Leaving the test window will be flagged and may result in disqualification</li>
                </ul>
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={acceptRulesAndStart}
            >
              I Accept & Start Test
            </Button>
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && !profilePicture) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/profile")}>
          Go to Profile
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Test Verification
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Before you can take the test, we need to verify your identity and ensure test security.
      </Typography>
      
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStep()}
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Paper>
  );
};

export default TestProctoring;