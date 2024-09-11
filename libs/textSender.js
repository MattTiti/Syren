import axios from "axios";

export async function sendText(phoneNumber, message) {
  try {
    const response = await axios.post("/api/send", {
      phoneNumber,
      message,
    });
    console.log("Text sent successfully:", response.data);
    return true;
  } catch (error) {
    console.error("Error sending text:", error);
    return false;
  }
}
