import axios from "axios";

const MAX_MESSAGE_LENGTH = 500; // Maximum length for a single text message

export async function sendText(phoneNumber, message) {
  const messages = splitMessage(message);
  let allMessagesSent = true;

  for (const [index, msg] of messages.entries()) {
    try {
      const response = await axios.post("https://goodmornin.app/api/send", {
        phoneNumber,
        message: msg,
        part: index + 1,
        total: messages.length,
      });
      console.log(
        `Text part ${index + 1}/${messages.length} sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error sending text part ${index + 1}/${messages.length}:`,
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
    if (currentPart.length + line.length + 1 > MAX_MESSAGE_LENGTH) {
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = "";
      }
      if (line.length > MAX_MESSAGE_LENGTH) {
        const subParts = line.match(
          new RegExp(`.{1,${MAX_MESSAGE_LENGTH}}`, "g")
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
