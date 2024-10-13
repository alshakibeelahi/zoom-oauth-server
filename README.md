# Zoom Meeting Scheduler API

A robust Node.js and Express.js API for scheduling Zoom meetings programmatically using Zoom's Server-to-Server OAuth. Developed as an efficient solution for seamless Zoom meeting scheduling with customizable meeting details and secure authentication.

## 🚀 Project Overview

The Zoom Meeting Scheduler API provides a streamlined interface to programmatically create Zoom meetings with options to customize the meeting topic, agenda, date, time, and duration. It leverages Zoom's Server-to-Server OAuth for secure communication and adheres to best practices for backend development.

By default, if the date and time are not specified, the API schedules the meeting for the current date at 12:00 PM. This solution is ideal for applications that require automated meeting management for remote teams, webinars, or other use cases.

## 🔧 Key Features

- Secure integration with Zoom APIs using Server-to-Server OAuth for authentication and authorization.
- Create Zoom meetings with customizable parameters such as topic, agenda, start date, time, and duration.
- Automatically defaults to the current date and time (12:00 PM) if not provided by the user.
- Comprehensive error handling and API request validation.
- Rate limit of 100 meeting creation requests per day (enforced by Zoom).

## ⚙️ Installation & Setup

Follow the steps below to set up and run the Zoom Meeting Scheduler API locally:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/zoom-oauth-server.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd zoom-meeting-scheduler
    ```

3. **Install required dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file in the project root and configure your Zoom API credentials:**

    ```bash
    ZOOM_CLIENT_ID=your_zoom_client_id
    ZOOM_CLIENT_SECRET=your_zoom_client_secret
    ZOOM_ACCOUNT_ID=your_zoom_account_id
    ZOOM_BASE_URL=https://zoom.us
    ```

5. **Start the server:**

    ```bash
    node server.js
    ```

The API will be running at `http://localhost:3000`.

## 📚 Usage

### Creating a Meeting

Make a `POST` request to the `/create-meeting` endpoint with the following JSON payload in the request body:

#### Request Body Parameters:

- **topic** *(optional)*: The meeting topic (default: "Online Meeting").
- **agenda** *(optional)*: The meeting agenda (default: empty).
- **date** *(optional)*: The meeting date in `YYYY-MM-DD` format (default: current date).
- **time** *(optional)*: The meeting time in `hh:mm AM/PM` format (default: `12:00 PM`).
- **duration** *(optional)*: The duration of the meeting in minutes (default: 60).

#### Example Request:

```json
{
  "topic": "Team Sync",
  "agenda": "Discussing project milestones",
  "date": "2024-10-14",
  "time": "2:30 PM",
  "duration": 45
}
```
## ⚠️ Rate Limit Information
Zoom enforces a daily rate limit of **100 meeting creation requests per day** for the Server-to-Server OAuth API. Once this limit is exceeded, no more meetings can be created until the next reset cycle.

To avoid disruptions, it is important to handle rate-limited requests gracefully in your application.

## 🔗 Resources

- [Zoom Developer Portal](https://marketplace.zoom.us/)
- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/introduction)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime for building scalable backend services.
- **Express.js** - Minimal and flexible Node.js web application framework.
- **Zoom Server-to-Server OAuth API** - For secure communication with Zoom's API.

