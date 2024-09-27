# Minecraft Server Management Tool PROLEAK

## Overview
The Minecraft Server Management Tool is a utility designed for managing Minecraft server version 1.21.303, specifically tailored for the Bedrock edition. This project, currently in version 1.02, offers essential features such as starting and stopping the server, along with the capability to download the server files directly from the official Minecraft website.

## Features
- **Start and Stop Server**: Easily manage the server state with simple commands.
- **Download Minecraft Bedrock Server**: Automatically fetch the server files from the official Minecraft site.
- **User Authentication**: Integrates a MySQL database for secure user login and token verification.
- **CORS Support**: Allows cross-origin requests for seamless integration with web applications.
- **Rate Limiting**: Protects the server from brute force attacks during the login process.
- **Security Enhancements**: Utilizes Helmet.js to secure HTTP headers and mitigate web vulnerabilities.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure that Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **MySQL**: Install and set up a MySQL server. You can find the installation guide at [MySQL Downloads](https://dev.mysql.com/downloads/).

### Installation
1. **Clone the Repository**: Clone this project to your local machine using Git:
   ```bash
   git clone https://github.com/nomadsdev/minecraft-server-manage-proleak.git
   cd minecraft-server-manage-proleak
   ```

2. **Install Dependencies**:
   - **Client Installation**:
     Navigate to the `ui` directory and install the required packages:
     ```bash
     cd ui
     npm install
     ```

   - **Server Installation**:
     After setting up the client, navigate to the `server` directory and install the required packages:
     ```bash
     cd ../server
     npm install
     ```

3. **Download the Minecraft Server**:
   - Go to the [Minecraft Official Download](https://www.minecraft.net/en-us/download/server/bedrock) page and download the Bedrock server files.
   - Extract the downloaded files into a designated folder on your system.

4. **Database Setup**:
   - Navigate to `server/database` and set up your MySQL database for user authentication.
   - Ensure the necessary tables and structure are created based on your requirements.

5. **Configuration**:
   - Create a `.env` file in the root directory of the project by copying the `.env.example` file:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your MySQL database credentials and other relevant configurations.


6. **Command Prompt Configuration**:
   - Open Command Prompt (CMD) and run the following command to allow your application to loop back:
     ```bash
     CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-xxxx-xxxxx-xxxx
     ```
   - Ensure that the output indicates "OK".
  
### Running the Server

1. **Run the Application**: To start the Express server, use the `run.bat` file located in the `server` directory. Simply double-click the `run.bat` file, or execute it from the command line:
   ```bash
   cd server
   run.bat
   ```

2. **Access the Application**: Once the server is running, you can access it at [http://localhost:5173](http://localhost:5173).

## Usage
- **Start Server**: Use the designated API endpoint to start the Minecraft server.
- **Stop Server**: Similarly, use the corresponding endpoint to stop the server.
- **Authentication**: Users can authenticate using tokens managed within the MySQL database.

![Image 1](https://api.images.jmmentertainment.com/storage/1727426852392-677100765.png)
![Image 2](https://api.images.jmmentertainment.com/storage/1727426852394-897899591.png)
![Image 3](https://api.images.jmmentertainment.com/storage/1727426852394-157769964.png)

## Contact Information
For any inquiries or further assistance, please reach out to:
- Email: [proleak@jmmentertainment.com](mailto:proleak@jmmentertainment.com)
- Facebook: [Kxerzx](https://www.facebook.com/kxerzx)

## Future Updates
This project will be continuously updated with new features and improvements. Upcoming enhancements may include:
- Additional server management features.
- Enhanced user interface for easier management.
- Detailed logging and monitoring functionalities.

Your feedback and suggestions are valuable for the ongoing development of this project!
