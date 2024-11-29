# Northcoders News API

# Hosted version: 

https://nc-news-b3v0.onrender.com/api/


# Summary: 

This API is built for the purpose of accessing appilcation data programmatically. It is intended to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

It has many different features at its core, it allows users to get topics, articles, comments and users from the database. It will also allow users to add comments to articles, delete comments, update articles and sort/filter data according to different parameters.


# How to clone, install dependencies, seed local database, and run tests.

Cloning:\
    - Go to [Github](https://github.com/martingrennan/NC-News)\
    - Click the Code arrow and copy the HTTPS link\
    - Go to your terminal and type 'git clone [pasted HTTPS link]'\
    - Open the newly created directory and type 'code .' to open VS Code

Install dependencies:\
    - Running 'npm install' in the terminal will install all dependecies required to run this program\

Seed local database:\
    - Type 'setup-dbs' in your terminal to initially seed the database

Run tests:\
    - Type 'npm run test' in your terminal to run all test suites\
    - If you only want to run a specific test suite, type 'npm run test [example: app.test.js]'


# Creating .env files.

In the root of the 'be-nc-news' folder, create:\
    1. '.env.development' - on line 1, type: 'PGDATABASE=nc_news'\
    2. '.env.test' - on line 1, type: 'PGDATABASE=nc_news_test'\

# Minimum versions required: 

    "dotenv": "^16.0.0",
    "express": "^4.21.1",
    "pg": "^8.7.3",
    "supertest": "^7.0.0"
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.15",
    "pg-format": "^1.0.4"

--- 

# This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)