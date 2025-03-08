import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const AIMockInterview = () => {
    const [question, setQuestion] = useState("Press the button to get a question.");
    const [transcription, setTranscription] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audio, setAudio] = useState(null);
    const [interviewActive, setInterviewActive] = useState(false);
    const [finalAnalysis, setFinalAnalysis] = useState("");
    const [responses, setResponses] = useState([]);
    const [showMicPopup, setShowMicPopup] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [recordingTimer, setRecordingTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [timerInterval, setTimerInterval] = useState(null);

    // Fetch user skills from Firestore on component mount
    useEffect(() => {
        const fetchUserSkills = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;
                
                if (currentUser) {
                    const db = getFirestore();
                    const userProfileRef = doc(db, "userProfiles", currentUser.uid);
                    const userProfileSnap = await getDoc(userProfileRef);
                    
                    if (userProfileSnap.exists()) {
                        const userData = userProfileSnap.data();
                        if (userData.skills.technical && Array.isArray(userData.skills.technical)) {
                            setSkills(userData.skills.technical);
                        }
                    } else {
                        console.log("No user profile found");
                    }
                }
            } catch (error) {
                console.error("Error fetching user skills:", error);
            }
        };
        
        fetchUserSkills();
    }, []);

    useEffect(() => {
        if (audio) {
            audio.play().catch(err => console.error("Playback failed:", err));
            return () => {
                audio.pause();
                audio.currentTime = 0;
            };
        }
    }, [audio]);
 
    // Clear all intervals when component unmounts
    useEffect(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerInterval]);

    const generateQuestion = async () => {
        try {
            setTranscription("");
            setFeedback("");
           
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                setAudio(null);
            }
   
            setCountdown(5);
            setRecordingTimer(0);
            
            // Include skills in the request to generate targeted questions
            const response = await fetch("http://127.0.0.1:8000/generate_question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills: skills.join(",") })
            });
            
            const data = await response.json();
            setQuestion(data.question);
           
            // Clear any existing interval
            if (timerInterval) clearInterval(timerInterval);
            
            // Set countdown interval with proper cleanup
            const countdownInt = setInterval(() => {
                setCountdown((currentCount) => {
                    if (currentCount <= 1) {
                        clearInterval(countdownInt);
                        recordAudio();
                        return 0;
                    }
                    return currentCount - 1;
                });
            }, 1000);
            
            setTimerInterval(countdownInt);
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };
 
    const endInterview = async () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setAudio(null);
        }
        
        // Clear any active timers
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
   
        setInterviewActive(false);
        try {
            const response = await fetch("http://127.0.0.1:8000/final_analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    responses,
                    skills: skills.join(",") 
                })
            });
            const result = await response.json();
            setFinalAnalysis(result.analysis);
        } catch (error) {
            console.error("Error fetching final analysis:", error);
        }
    };
 
    const startInterview = async () => {
        setInterviewActive(true);
        setResponses([]);
        await generateQuestion();
    };

    const recordAudio = async () => {
        setIsRecording(true);
        setShowMicPopup(true);
        setRecordingTimer(0);
        
        // Clear any existing interval
        if (timerInterval) {
            clearInterval(timerInterval);
        }
       
        // Create a new recording timer interval
        const recordingInt = setInterval(() => {
            setRecordingTimer((currentTimer) => currentTimer + 1);
        }, 1000);
        
        setTimerInterval(recordingInt);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            mediaRecorder.ondataavailable = event => chunks.push(event.data);
            mediaRecorder.onstop = async () => {
                // Clear the recording timer
                if (timerInterval) {
                    clearInterval(timerInterval);
                    setTimerInterval(null);
                }
                
                setShowMicPopup(false);
                setLoading(true);
                const blob = new Blob(chunks, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("file", blob, "response.wav");
                formData.append("skills", skills.join(","));
                formData.append("question", question);
               
                try {
                    const response = await fetch("http://127.0.0.1:8000/upload_audio/", {
                        method: "POST",
                        body: formData
                    });
                    const result = await response.json();

                    setTranscription("Transcription: " + result.transcription);
                    setFeedback("Feedback: " + result.feedback);
                    setResponses(prev => [...prev, { 
                        question, 
                        response: result.transcription, 
                        feedback: result.feedback 
                    }]);
                   
                    setTimeout(() => {
                        const newAudio = new Audio("http://127.0.0.1:8000/static/feedback.mp3");
                        setAudio(newAudio);
                    }, 1000);
                } catch (error) {
                    console.error("Error uploading audio:", error);
                }
                setLoading(false);
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            
            // Automatically stop recording after 15 seconds
            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 15000);
            
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsRecording(false);
            setShowMicPopup(false);
            
            // Clear the interval if there's an error
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1>AI Mock Interview</h1>
            {!interviewActive ? (
                <div>
                    <p>Skills for interview: {skills.length > 0 ? skills.join(", ") : "No skills loaded yet"}</p>
                    <button onClick={startInterview} style={styles.button} disabled={skills.length === 0}>
                        Start Interview
                    </button>
                </div>
            ) : (
                <>
                    <p style={styles.question}>{question}</p>
                    {countdown > 0 && <p style={styles.timer}>Prepare: {countdown}s</p>}
                    {showMicPopup && (
                        <div style={styles.micPopup}>
                            <p>Recording... Speak Now!</p>
                            <p style={styles.timer}>{recordingTimer}s / 15s</p>
                            <span role="img" aria-label="microphone" style={{ fontSize: "50px" }}>🎤</span>
                        </div>
                    )}
                    {loading && <p>Processing response...</p>}
                    {transcription && <p style={styles.transcription}>{transcription}</p>}
                    {feedback && <p style={styles.feedback}>{feedback}</p>}
                    <div style={styles.buttonContainer}>
                        <button onClick={generateQuestion} style={styles.button} disabled={isRecording || loading}>
                            Next Question
                        </button>
                        <button onClick={endInterview} style={styles.button}>End Interview</button>
                    </div>
                </>
            )}
            {finalAnalysis && (
                <div style={styles.finalAnalysis}>
                    <h2>Final Analysis</h2>
                    <p>{finalAnalysis}</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "50px auto",
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4"
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 20px",
        margin: "10px",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background-color 0.3s"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "20px"
    },
    micPopup: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "bold",
        zIndex: 1000,
        width: "300px"
    },
    timer: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#d9534f"
    },
    question: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px"
    },
    transcription: {
        textAlign: "left",
        backgroundColor: "#e9f7fe",
        padding: "15px",
        borderRadius: "5px",
        marginTop: "20px"
    },
    feedback: {
        textAlign: "left",
        backgroundColor: "#f8f9fa",
        padding: "15px",
        borderRadius: "5px",
        marginTop: "10px",
        borderLeft: "5px solid #007bff"
    },
    finalAnalysis: {
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f0f8ff",
        borderRadius: "8px",
        textAlign: "left",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
    }
};

export default AIMockInterview;