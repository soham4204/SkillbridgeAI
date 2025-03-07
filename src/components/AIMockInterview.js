import React, { useState, useEffect } from "react";


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


    useEffect(() => {
      if (audio) {
          audio.play().catch(err => console.error("Playback failed:", err));
          return () => {
              audio.pause();
              audio.currentTime = 0;
          };
      }
  }, [audio]);
 
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
 
          const response = await fetch("http://127.0.0.1:8000/generate_question");
          const data = await response.json();
          setQuestion(data.question);
         
          const countdownInterval = setInterval(() => {
              setCountdown(prev => {
                  if (prev === 1) {
                      clearInterval(countdownInterval);
                      recordAudio();
                  }
                  return prev - 1;
              });
          }, 1000);
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
 
      setInterviewActive(false);
      try {
          const response = await fetch("http://127.0.0.1:8000/final_analysis", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ responses })
          });
          const result = await response.json();
          setFinalAnalysis(result.analysis);
      } catch (error) {
          console.error("Error fetching final analysis:", error);
      }
  };
 
    const startInterview = async () => {
        setInterviewActive(true);
        await generateQuestion();
    };


    const recordAudio = async () => {
        setIsRecording(true);
        setShowMicPopup(true);
        setRecordingTimer(0);
       
        const recordingInterval = setInterval(() => {
            setRecordingTimer(prev => {
                if (prev === 15) {
                    clearInterval(recordingInterval);
                }
                return prev + 1;
            });
        }, 1000);


        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];


            mediaRecorder.ondataavailable = event => chunks.push(event.data);
            mediaRecorder.onstop = async () => {
                setShowMicPopup(false);
                setLoading(true);
                const blob = new Blob(chunks, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("file", blob, "response.wav");
               
                try {
                    const response = await fetch("http://127.0.0.1:8000/upload_audio/", {
                        method: "POST",
                        body: formData
                    });
                    const result = await response.json();


                    setTranscription("Transcription: " + result.transcription);
                    setFeedback("Feedback: " + result.feedback);
                    setResponses(prev => [...prev, { question, response: result.transcription, feedback: result.feedback }]);
                   
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
            setTimeout(() => mediaRecorder.stop(), 15000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsRecording(false);
            setShowMicPopup(false);
        }
    };


    return (
        <div style={styles.container}>
            <h1>AI Mock Interview</h1>
            {!interviewActive ? (
                <button onClick={startInterview} style={styles.button}>Start Interview</button>
            ) : (
                <>
                    <p>{question}</p>
                    {countdown > 0 && <p>Prepare: {countdown}</p>}
                    {showMicPopup && (
                        <div style={styles.micPopup}>
                            <p>Recording... Speak Now! {recordingTimer}s elapsed</p>
                            <span role="img" aria-label="microphone" style={{ fontSize: "50px" }}>🎤</span>
                        </div>
                    )}
                    {loading && <p>Processing response...</p>}
                    {transcription && <p>{transcription}</p>}
                    {feedback && <p>{feedback}</p>}
                    <button onClick={generateQuestion} style={styles.button}>Next Question</button>
                    <button onClick={endInterview} style={styles.button}>End Interview</button>
                </>
            )}
            {finalAnalysis && <p><strong>Final Analysis:</strong> {finalAnalysis}</p>}
        </div>
    );
};


const styles = {
    container: {
        maxWidth: "600px",
        margin: "50px auto",
        background: "white",
        padding: "20px",
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
        padding: "10px 15px",
        margin: "10px",
        cursor: "pointer",
        borderRadius: "5px",
    },
    micPopup: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "bold",
    }
};


export default AIMockInterview;
