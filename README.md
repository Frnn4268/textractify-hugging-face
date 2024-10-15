# Textractify Hugging Face

Textractify Hugging Face is an innovative project designed to automate text extraction from images using pre-trained models from the Hugging Face platform. This application leverages advanced Natural Language Processing (NLP) techniques to help children learn English by extracting text from images and providing pronunciation assistance. The goal is to make language learning more intuitive and engaging for children, encouraging them to interact with the world around them in a new way.

## Features

- Text Extraction from Images: Automatically extracts text from images and generates audio for pronunciation, helping children learn English.
- NLP Models from Hugging Face: Uses pre-trained NLP models for text recognition and language processing.
- Interactive Learning: Designed to make learning more engaging by combining visual and auditory elements.
- Responsive Interface: Built with a user-friendly, responsive design to ensure easy interaction across devices.

## Technologies Used

- MERN Stack: The project is developed using MongoDB, Express, React, and Node.js for a full-stack, scalable solution.
- Hugging Face API: Integration with Hugging Face's pre-trained models for advanced text recognition.
- Docker: The application is containerized using Docker, making it easy to set up and deploy across environments.
- Render: Both the frontend and backend are deployed on Render for seamless scalability and reliability.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/Frnn4268/textractify-hugging-face.git
cd textractify-hugging-face
```

2. Install dependencies for both backend and frontend:

```
cd server
npm install

cd ../client
npm install

cd ../textractify-client
npm install
```

3. Set up environment variables:

Create a `.env` file in both the server, client and textractify-client directories and add the required environment variables, such as API keys for Hugging Face, database credentials, and Render settings.

##### Server `.env` file:

```
HG_ACCESS_TOKEN = "your_hugging_face_access_token"

PORT = "your_server_port"

MONGODB_URI = "your_mongodb_uri"

FIREBASE_PROJECT_ID = "your_firebase_project_id"

FIREBASE_CLIENT_EMAIL = "your_firebase_client_email"
```

##### Client `.env` file:

```
VITE_API_BACKEND_URL = http://localhost:"your_server_port"/api
```

##### Textractify Client `.env` file:

```
VITE_API_BACKEND_URL = http://localhost:"your_server_port"/api
```

### Run the project using Docker:

```
docker-compose up --build -d
```

4. Access the application:
Once the containers are up and running, you can access the client at http://localhost:5173 and the textractify-client at http://localhost:5174.

## Usage
Textractify is designed to allow users to upload images containing text. The app will extract the text, process it, and provide audio pronunciations in English. This feature is particularly beneficial for children who want to learn how to pronounce words they encounter in their surroundings.

## Future Improvements
- Support for multiple languages to extend beyond English.
- Enhanced text-to-speech models for more accurate pronunciation.
- Additional interactive features for a richer learning experience.

## Contributing
If you'd like to contribute to the project, feel free to submit a pull request. Please make sure to follow the code style and include tests where appropriate.

## Acknowledgements
- Thanks to Hugging Face for providing powerful NLP models.
- Docker and Render for simplifying the deployment process.
- All contributors who helped make this project possible.

------------

> Project created by **Ema322** and **Frnn4268**
