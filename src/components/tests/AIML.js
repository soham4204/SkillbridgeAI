// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   LinearProgress,
//   Divider,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import { auth, db } from "../../firebase-config";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const questions = [
//   {
//     question: "What is the primary function of a machine learning model?",
//     options: [
//       "Storing data",
//       "Making predictions",
//       "Rendering graphics",
//       "Managing databases",
//     ],
//     answer: "Making predictions",
//   },
//   {
//     question: "Which algorithm is commonly used for classification problems?",
//     options: ["Linear Regression", "K-Means Clustering", "Decision Trees", "Apriori"],
//     answer: "Decision Trees",
//   },
//   {
//     question: "Which programming language is most commonly used for AI/ML?",
//     options: ["Java", "Python", "C++", "JavaScript"],
//     answer: "Python",
//   },
//   {
//     question: "What does 'overfitting' mean in machine learning?",
//     options: [
//       "Model performs poorly on training data",
//       "Model performs well on training but poorly on new data",
//       "Model is too simple",
//       "Model ignores outliers",
//     ],
//     answer: "Model performs well on training but poorly on new data",
//   },
//   {
//     question: "Which of the following is a supervised learning algorithm?",
//     options: ["K-Means", "Random Forest", "PCA", "Apriori"],
//     answer: "Random Forest",
//   },
// ];

// const AI_ML_Test = () => {
//   const [user, setUser] = useState(null);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showError, setShowError] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setLoading(true);
//       const currentUser = auth.currentUser;
      
//       if (currentUser) {
//         try {
//           // Fetch user profile with retry mechanism
//           let userData = null;
//           let retryCount = 0;
//           const maxRetries = 3;
          
//           while (!userData && retryCount < maxRetries) {
//             try {
//               const userProfileRef = doc(db, "userProfiles", currentUser.uid);
//               const userProfileSnap = await getDoc(userProfileRef);
              
//               if (userProfileSnap.exists()) {
//                 userData = userProfileSnap.data();
//               }
//             } catch (fetchError) {
//               console.log(`Attempt ${retryCount + 1} failed: ${fetchError.message}`);
//               retryCount++;
//               // Wait before retrying
//               await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//           }
          
//           if (userData) {
//             setUser({
//               name: userData.fullName || userData.name || "User",
//               email: currentUser.email,
//               uid: currentUser.uid
//             });
//           } else {
//             // Fallback if we couldn't get profile after retries
//             setUser({
//               name: currentUser.displayName || "User",
//               email: currentUser.email,
//               uid: currentUser.uid
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching user profile:", error);
//           setUser({
//             name: currentUser.displayName || "User",
//             email: currentUser.email,
//             uid: currentUser.uid
//           });
//         }
//       }
//       setLoading(false);
//     };
    
//     fetchUserProfile();
//   }, []);

//   const handleAnswerChange = (index, value) => {
//     setUserAnswers({ ...userAnswers, [index]: value });
//   };

//   const handleSubmit = async () => {
//     // Calculate score regardless of database connection
//     let newScore = 0;
//     questions.forEach((q, index) => {
//       if (userAnswers[index] === q.answer) {
//         newScore++;
//       }
//     });
//     setScore(newScore);
//     setSubmitted(true);

//     if (user) {
//       try {
//         // Prepare test result data
//         const timestamp = new Date();
//         const testResultId = `test_${timestamp.getTime()}`;
//         const testData = {
//           testType: "AI-ML Engineer",
//           score: newScore,
//           totalQuestions: questions.length,
//           answers: userAnswers,
//           timestamp: timestamp,
//         };
        
//         // Use Promise.all to attempt both writes
//         await Promise.all([
//           // Store detailed test results
//           setDoc(doc(db, "userProfiles", user.uid, "testResults", testResultId), testData),
          
//           // Update latest test
//           setDoc(doc(db, "userProfiles", user.uid, "userTests", "latestTest"), {
//             name: user.name,
//             email: user.email,
//             testType: "AI-ML Engineer",
//             score: newScore,
//             totalQuestions: questions.length,
//             timestamp: timestamp,
//           }, { merge: true })
//         ]);
//       } catch (error) {
//         console.error("Error saving test results:", error);
//         // Set error message but don't interrupt the user experience
//         setError("Your test results were calculated, but there was an issue saving them to your profile. This may be due to network issues or an ad blocker. Your score is " + newScore + " out of " + questions.length + ".");
//         setShowError(true);
//       }
//     }
//   };

//   const handleCloseError = () => {
//     setShowError(false);
//   };

//   // Show loading state while fetching user data
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
//         <Paper sx={{ padding: 4, maxWidth: 700, width: "90%", borderRadius: 3, boxShadow: 3, backgroundColor: "#fff", textAlign: "center" }}>
//           <Typography variant="h5" color="primary">Loading test...</Typography>
//           <LinearProgress sx={{ mt: 2 }} />
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
//       <Paper sx={{ padding: 4, maxWidth: 700, width: "90%", borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
//         <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
//           AI-ML Engineer Test
//         </Typography>
//         {user && (
//           <>
//             <Typography variant="h6" color="textSecondary">Candidate: {user.name}</Typography>
//             <Typography variant="body1" color="textSecondary">Email: {user.email}</Typography>
//           </>
//         )}

//         {/* Progress Bar */}
//         <Box sx={{ mt: 3, mb: 2 }}>
//           <LinearProgress variant="determinate" value={(Object.keys(userAnswers).length / questions.length) * 100} />
//           <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 1 }}>
//             {Object.keys(userAnswers).length} / {questions.length} answered
//           </Typography>
//         </Box>

//         {/* Questions */}
//         {questions.map((q, index) => (
//           <Box key={index} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 1, backgroundColor: "#fafafa" }}>
//             <Typography variant="h6">{index + 1}. {q.question}</Typography>
//             <FormControl component="fieldset">
//               <RadioGroup value={userAnswers[index] || ""} onChange={(e) => handleAnswerChange(index, e.target.value)}>
//                 {q.options.map((option, i) => (
//                   <FormControlLabel
//                     key={i}
//                     value={option}
//                     control={<Radio />}
//                     label={option}
//                     sx={{ 
//                       color: submitted ? 
//                         (option === q.answer ? "green" : (userAnswers[index] === option ? "red" : "inherit")) 
//                         : "inherit" 
//                     }}
//                   />
//                 ))}
//               </RadioGroup>
//             </FormControl>
//             {submitted && (
//               <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold", color: userAnswers[index] === q.answer ? "green" : "red" }}>
//                 {userAnswers[index] === q.answer ? <CheckCircleIcon sx={{ verticalAlign: "middle", mr: 1, color: "green" }} /> : <CancelIcon sx={{ verticalAlign: "middle", mr: 1, color: "red" }} />}
//                 Correct Answer: {q.answer}
//               </Typography>
//             )}
//           </Box>
//         ))}

//         {/* Submit Button */}
//         <Divider sx={{ my: 3 }} />
//         <Button 
//           variant="contained" 
//           color="primary" 
//           fullWidth 
//           sx={{ py: 1.5, fontWeight: "bold", backgroundColor: "#007acc", "&:hover": { backgroundColor: "#005f99" } }} 
//           onClick={handleSubmit} 
//           disabled={submitted}
//         >
//           Submit Test
//         </Button>

//         {/* Score Display */}
//         {submitted && (
//           <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 3, textAlign: "center" }}>
//             Your Score: {score} / {questions.length}
//           </Typography>
//         )}
        
//         {/* Error Snackbar */}
//         <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
//           <Alert onClose={handleCloseError} severity="warning" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       </Paper>
//     </Box>
//   );
// };

// export default AI_ML_Test;

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const questions = [
  { question: "What is the primary function of a machine learning model?", options: ["Storing data", "Making predictions", "Rendering graphics", "Managing databases"], answer: "Making predictions" },
  { question: "Which algorithm is commonly used for classification problems?", options: ["Linear Regression", "K-Means Clustering", "Decision Trees", "Apriori"], answer: "Decision Trees" },
  { question: "Which programming language is most commonly used for AI/ML?", options: ["Java", "Python", "C++", "JavaScript"], answer: "Python" },
  { question: "What does 'overfitting' mean in machine learning?", options: ["Model performs poorly on training data", "Model performs well on training but poorly on new data", "Model is too simple", "Model ignores outliers"], answer: "Model performs well on training but poorly on new data" },
  { question: "Which of the following is a supervised learning algorithm?", options: ["K-Means", "Random Forest", "PCA", "Apriori"], answer: "Random Forest" },
];

const AI_ML_Test = () => {
  const [user, setUser] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.fullName || "User",
      });
    }
  }, []);

  const handleAnswerChange = (index, value) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  const handleSubmit = async () => {
    let newScore = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);

    if (user) {
      try {
        const testResultId = `test_${Date.now()}`;
        const testData = {
          testType: "AI-ML Engineer Test",
          userId: user.uid,
          userEmail: user.email,
          userName: user.name,
          totalQuestions: questions.length,
          score: newScore,
          percentage: ((newScore / questions.length) * 100).toFixed(2),
          pass: newScore >= (questions.length * 0.6),
          answers: userAnswers,
          timestamp: Timestamp.now(),
        };

        await setDoc(doc(db, "tests", testResultId), testData);
      } catch (error) {
        console.error("Error saving test results:", error);
        setError("Your test was submitted, but there was an issue saving the results. Try again later.");
        setShowError(true);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      <Paper sx={{ padding: 4, maxWidth: 700, width: "90%", borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">AI-ML Test</Typography>
        {user && <Typography variant="h6">Candidate: {user.name}</Typography>}
        <LinearProgress variant="determinate" value={(Object.keys(userAnswers).length / questions.length) * 100} sx={{ mt: 2 }} />
        {questions.map((q, index) => (
          <Box key={index} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 1, backgroundColor: "#fafafa" }}>
            <Typography variant="h6">{index + 1}. {q.question}</Typography>
            <FormControl component="fieldset">
              <RadioGroup value={userAnswers[index] || ""} onChange={(e) => handleAnswerChange(index, e.target.value)}>
                {q.options.map((option, i) => (
                  <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
        <Divider sx={{ my: 3 }} />
        <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5 }} onClick={handleSubmit} disabled={submitted}>Submit Test</Button>
        {submitted && <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 3, textAlign: "center" }}>Your Score: {score} / {questions.length}</Typography>}
        <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
          <Alert onClose={() => setShowError(false)} severity="warning" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AI_ML_Test;
