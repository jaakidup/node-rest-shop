
# Node REST API back-end 
For a simple web shop



Create a file in the root directory named 'nodemon.json'
and paste this inside, change fields to suite deployment

```json


{
    "env": {
        "MONGO_ATLAS_PW": "mongo atlas cluster password",
        "HOSTNAME": "127.0.0.1",
        "PORT": "3030",
        "JWT_KEY": "secret"
    }
}

```