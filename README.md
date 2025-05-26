# seekitnu

This website encourages college students, particularly those affected by myopia to step outside and seek a given task. The user should take a picture of the description in the prompt given and upload it before the task resets.

## Features

- Users can like each others images to decide on the best image of the day.
- At the end of the day a winner is determined and changes are reflected by the leaderboard.
- Tasks are generated daily by OpenAI GPT-4o.

## Screenshots

Here are some screenshots of a single user interface flow:

<img width="300" alt="login" src="https://github.com/user-attachments/assets/a6b017b7-437d-4af5-a5d8-4b3404827b09" />
<img width="300" alt="upload" src="https://github.com/user-attachments/assets/abc8ac41-fd78-4742-b178-f48537952a46" />
<img width="300" alt="home" src="https://github.com/user-attachments/assets/0e7c5ab5-eaf6-4a1d-be9c-b529989e0808" />
<img width="300" alt="account" src="https://github.com/user-attachments/assets/5e96766b-01b5-4709-a0ca-8a5317e4b9d6" />

## Technologies Used

- **Frontend**: React, TypeScript, CSS, Firebase, OpenAI
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL, Prisma
- **Containerization**: Docker
- **Hosting**: AWS (S3, RDS, ECR/ECS/EC2, Route 53/Certificate Manager, CloudWatch)

## Prerequisites

To run this app locally, you’ll need to have the following installed:

- [Node.js](https://nodejs.org) (version 14 or higher)
- [Docker](https://www.docker.com) (if running in containers)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker for database)

## Getting Started

Follow these steps to get a local development copy up and running.

### 1. Clone the Repository

```bash
git clone https://github.com/emirdur/seekitnu.git
cd seekitnu
```

### 2. Pull a PostgreSQL Docker Image

Find a PostgreSQL Docker image and download it. Set up the username, password, and database name according to your preference, or use the default configuration (postgres, postgres, postgres). Make sure to update the docker-compose.yml, the backend Dockerfile, and the environment variables accordingly. Additionally, generate an .env and .env.docker file in the backend with the necessary database environment variables, ensuring the database name points to localhost in .env and the database name points to database in .env.docker.

### 3. Integrate Firebase Authentication

Next, sign up for a Firebase account, as authentication is handled through this service provider. Once you've signed up, create a new project to obtain your configuration keys. Be sure to copy these keys and store them in an environment variable file within the frontend directory. Lastly, navigate to the Authentication section and enable the Email/Password sign-up method.

### 4. Bridge OpenAI

The way this application works is by relying on OpenAI to generate the tasks, and then falling back on a CSV file in case there's any fetch fails with the OpenAI API. Therefore, you must sign up for an OpenAI API account and add the configuration key to the .env file in the backend if you'd like to use this service. If you want to skip that part you can simply update the CSV file provided with some example tasks.

### 5. Containerize the application

To containerize the application you can call:

```bash
npm run docker:containerize:dev
```

This will generate and boot up the frontend, backend, and PostgreSQL images.

### 6. Run the frontend

You can start up the website by calling:

```bash
npm run dev:frontend
```

### 7. Run tests

You can run tests by simply calling:

```bash
npm test
```

### 8. Generate the documentation

Follow these steps to see an explanation of what each object does. First generate the documentation:

```bash
npm run docs:generate
npm run docs:serve
```

Then open the localhost outputted to view the documentation!
