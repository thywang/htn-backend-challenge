# Hack the North 2023 Backend Challenge

A basic REST API server to store and work with hackathon participants' data. Created with Express.js.

## Run Locally

Clone the project

```bash
  git clone https://github.com/thywang/htn-backend-challenge.git
```

Go to the project directory

```bash
  cd htn-backend-challenge
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## API Reference

#### All Users Endpoint

Get a list of all user data from the database in a JSON format.

```http
  GET localhost:3000/users/
```

#### User Information Endpoint

Get data for a specific user by user id.

```http
  GET localhost:3000/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      |   `int`  | **Required**. Id of user to fetch |

#### Update User Data Endpoint

Updates a given user's data by accepting data in a JSON format and return the updated user data as the response. Partial updating is supported.

```http
  PUT localhost:3000/users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      |   `int`  | **Required**. Id of user to update |

#### Example:

User with id `1` has following data in database:
```json
 {
    "name": "Breanna Dillon",
    "company": "Jackson Ltd",
    "email": "lorettabrown@example.net",
    "phone": "+1-924-116-7963",
    "skills":
        {
            "Swift": 4,
            "OpenCV": 1
    }
}
```
Submitting the following JSON:
```json
  {
    "phone": "+1 (555) 123 4568",
    "skills": {
      "Swift": 2,
      "NLTK": 2,
      "C#": 3
    }
  }
```
to the given URL: `PUT localhost:3000/users/1` should update their data to:

```json
 {
    "name": "Breanna Dillon",
    "company": "Jackson Ltd",
    "email": "lorettabrown@example.net",
    "phone": "+1 (555) 123 4568",
    "skills": {
        "Swift": 2,
        "OpenCV": 1,
        "NLTK": 2,
        "C#": 3
    }
}
```

#### Skills Endpoints

Get a list of skills and aggregate info about them. Frequency is the number of users with each skill.

```http
  GET localhost:3000/skills/?min_frequency=${min}&max_frequency=${max}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `min`      |   `int`  | Minimum frequency                |
| `max`      |   `int`  | Maximum frequency                |

