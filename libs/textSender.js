import axios from "axios";

const MAX_MESSAGE_LENGTH = 600; // Maximum length for a single text message

export async function sendText(phoneNumber, message) {
  const messages = splitMessage(message);
  let allMessagesSent = true;

  for (let i = 0; i < messages.length; i++) {
    const prefix = messages.length > 1 ? `(${i + 1}/${messages.length}) ` : "";
    const fullMessage = prefix + messages[i];

    try {
      const response = await axios.post("https://goodmornin.app/api/send", {
        phoneNumber,
        message: fullMessage,
      });
      console.log(
        `Text part ${i + 1}/${messages.length} sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error sending text part ${i + 1}/${messages.length}:`,
        error
      );
      allMessagesSent = false;
    }
  }

  return allMessagesSent;
}

function splitMessage(message) {
  if (message.length <= MAX_MESSAGE_LENGTH) {
    return [message];
  }

  const parts = [];
  let currentPart = "";

  message.split("\n").forEach((line) => {
    if (currentPart.length + line.length + 1 > MAX_MESSAGE_LENGTH - 7) {
      // Reserve 7 characters for " (x/y)"
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = "";
      }
      if (line.length > MAX_MESSAGE_LENGTH - 7) {
        const subParts = line.match(
          new RegExp(`.{1,${MAX_MESSAGE_LENGTH - 7}}`, "g")
        );
        parts.push(...subParts);
      } else {
        currentPart = line;
      }
    } else {
      currentPart += (currentPart ? "\n" : "") + line;
    }
  });

  if (currentPart) {
    parts.push(currentPart.trim());
  }

  return parts;
}
