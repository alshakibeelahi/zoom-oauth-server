const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const ZOOM_BASE_URL = process.env.ZOOM_BASE_URL;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Function to get OAuth token
async function getZoomAccessToken() {
  const tokenUrl = `${ZOOM_BASE_URL}/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Zoom access token:', error.response.data);
    throw new Error('Failed to retrieve access token');
  }
}

// Utility to format the date and time into ISO 8601 format
function formatDateTime(date, time) {
  const currentDate = date ? new Date(date) : new Date(); // Use provided date or default to current date

  // Parse time (default to '12:00 PM' if time not provided)
  const [timePart, meridian] = time ? time.split(' ') : ['12:00', 'PM'];
  let [hours, minutes] = timePart.split(':').map(Number);

  // Adjust hours based on AM/PM
  if (meridian.toLowerCase() === 'pm' && hours < 12) {
    hours += 12;
  } else if (meridian.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  // Set the time on the currentDate
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);

  // Return the date in ISO 8601 format
  return currentDate.toISOString();
}

// Endpoint to create an online Zoom meeting
// Endpoint to create an online Zoom meeting
app.post('/create-meeting', async (req, res) => {
  const { topic, agenda, date, time, duration } = req.body; // Accept date, time, and duration

  try {
    const accessToken = await getZoomAccessToken();

    // Format the date and time into ISO 8601
    const startTime = formatDateTime(date, time); // Use default date and time if not provided

    // Create meeting options
    const meetingOptions = {
      topic: topic || 'Online Meeting', // Default topic if none provided
      agenda: agenda || '', // Set the agenda
      type: 2, // Scheduled meeting
      start_time: startTime, // Set the formatted start time
      duration: duration || 60, // Default duration is 60 minutes
      settings: {
        host_video: false, // Do not start with host video on
        participant_video: false, // Do not start with participant video on
        join_before_host: true, // Allow participants to join before host
        enforce_login: false, // Disable login enforcement (optional)
        waiting_room: false, // Disable waiting room so participants can join directly
      },
    };

    // Make a POST request to create the meeting
    const response = await axios.post(
      `${ZOOM_BASE_URL}/v2/users/me/meetings`,
      meetingOptions,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Calculate meeting end time based on start time and duration
    const endTime = new Date(new Date(startTime).getTime() + (duration || 60) * 60000);

    // Send back the created meeting details
    res.json({
      meeting_url: response.data.join_url,
      start_time: response.data.start_time,
      end_time: endTime.toISOString(), // Send the calculated end time
      agenda: response.data.agenda,
    });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response.data);
    res.status(500).send('Error creating meeting');
  }
});

// Endpoint to join the meeting
app.get('/join-meeting', async (req, res) => {
  const { meeting_url, end_time } = req.query;

  // Check if the meeting time has expired
  const currentTime = new Date();
  const meetingEndTime = new Date(end_time);

  if (currentTime > meetingEndTime) {
    return res.status(400).send('Meeting time has expired, you cannot join.');
  }

  // If within time limit, redirect to the Zoom meeting URL
  res.redirect(meeting_url);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});