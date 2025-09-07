const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static videos from /videos folder
app.use("/videos", express.static("videos"));

// Serve static files (PDF, Word) from /files folder
app.use("/files", express.static("files"));

// Dummy chat endpoint
app.post("/chat", (req, res) => {
  const userMessage = req.body.message?.toLowerCase();

  let botReply = "Sorry, I didn’t understand that. Try again.";

  if (userMessage.includes("hello")) {
    botReply = "Hello! How can I help you today?";
  } else if (userMessage.includes("math")) {
    botReply = "Great choice! Do you want to watch a video lesson?";
  } else if (userMessage.includes("video")) {
    // Return a video link
    botReply =
      "Here’s your lesson video: http://10.0.2.2:5000/videos/lesson1.mp4";
  } else if (userMessage.includes("pdf")) {
    // Return a PDF link (from /files folder)
    botReply =
      "Here’s your PDF: http://10.0.2.2:5000/files/sample.pdf";
  } else if (userMessage.includes("word")) {
    // Return a Word file link (from /files folder)
    botReply =
      "Here’s your Word file: http://10.0.2.2:5000/files/sample.docx";
  } else if (userMessage.includes("bye")) {
    botReply = "Goodbye! Have a nice day!";
  }

  res.json({ reply: botReply });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Dummy backend running at http://localhost:${PORT}`);
});
