import { SessionsClient } from '@google-cloud/dialogflow';  // Import SessionsClient

const sessionClient = new SessionsClient(); // Initialize client

// const sessionClient = new dialogflow.SessionsClient();
const projectId = 'your-dialogflow-project-id'; // Your Dialogflow project ID
const sessionId = 'random-session-id'; // Unique session ID for the conversation
const languageCode = 'en';

export const detectIntent = async (query) => {
    console.log("jfaldsj") 
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult.fulfillmentText;
};