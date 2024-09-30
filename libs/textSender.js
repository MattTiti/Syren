import axios from "axios";

const MAX_MESSAGE_LENGTH = 600; // Maximum length for a single text message
const MAX_TEXTS = 2; // Maximum number of texts to send

export async function sendText(phoneNumber, message) {
  const messages = splitMessage(message);
  let allMessagesSent = true;
  let truncated = false;

  for (let i = 0; i < Math.min(messages.length, MAX_TEXTS); i++) {
    let fullMessage = messages[i];

    if (i === MAX_TEXTS - 1 && messages.length > MAX_TEXTS) {
      const remainingChars = MAX_MESSAGE_LENGTH - fullMessage.length;
      const viewMoreMessage =
        "\n\nView the rest of your message at https://goodmornin.app/custom";

      if (remainingChars >= viewMoreMessage.length) {
        fullMessage += viewMoreMessage;
      } else {
        fullMessage =
          fullMessage.slice(0, MAX_MESSAGE_LENGTH - viewMoreMessage.length) +
          viewMoreMessage;
      }
      truncated = true;
    }

    const prefix =
      messages.length > 1
        ? `(${i + 1}/${Math.min(messages.length, MAX_TEXTS)}) `
        : "";
    fullMessage = prefix + fullMessage;

    try {
      const response = await axios.post("https://goodmornin.app/api/send", {
        phoneNumber,
        message: fullMessage,
      });
      console.log(
        `Text part ${i + 1}/${Math.min(
          messages.length,
          MAX_TEXTS
        )} sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error sending text part ${i + 1}/${Math.min(
          messages.length,
          MAX_TEXTS
        )}:`,
        error
      );
      allMessagesSent = false;
    }
  }

  return { allMessagesSent, truncated };
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

function canBeEncodedAsGSM7(text) {
  const gsm7Chars =
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
  const extendedGsm7Chars = "^{}\\[~]|€";

  for (let char of text) {
    if (!gsm7Chars.includes(char) && !extendedGsm7Chars.includes(char)) {
      return false;
    }
  }
  return true;
}
