# ```the matrix.```

## ```description.```
Remove the human element of 3D printing, and give into the robot revolution.

## ```tech stack.```
In this website application, there are two parts to it: the <b>front-end (client)</b> and the <b>back-end (server)</b>. 

The front-end essentially renders everything the users see, and all of its components are available to be interacted with by the user. This includes buttons, forms, and basic formatting needs. The back-end has everything the users don't get to see or should be kept secure. Things like database access, authentication, and most data processing should happen in the back-end. 

The front-end and back-end communicate via requests. There are four primary types of requests and each have their own purposes:
* Create (POST): Used to create something new; in our case, it's also typically stored to a database as well. Similar to the "write" operation in a lot of applications.
* Read (GET): Used for any data that doesn't need to be manipulated. Similar to the "read-only" operation in a lot of applications.
* Update (PUT): Used to change features in an already existing item. Similar to the "write" or "append" operation in a lot of applications.
* Delete (DELETE): Used to delete an already existing item, including the database. Similar to the "delete" or "remove" operation in a lot of applications.

There's more jargon related to the front-end/back-end like endpoints, schemas, routers, etc. If you want to know more, try looking up keywords like:
* CRUD (the operations above)
* REST API
* MERN Stack

### ```front end.```
The primary framework for the client-facing side of the website is <b>React Native</b> with <b>TypeScript</b> as the programming language. The styling library for the basic components is <b>Ant Design</b>.

### ```back end.```
The backend is run using <b>Express.js</b> and <b>Node.js</b> using JavaScript as the programming language. The database for storage is <b>MongoDB (Community Server)</b> and the authentication service is <b>Passport.js</b> (for now, this may change in the future).


## ```installation.```
To install the website application on your local machine for development, do the following steps:

First, clone this repository somewhere on your computer (I recommend the ```Documents``` folder) with the following command in a terminal:

```
git clone https://github.com/draw-n/the-matrix.git
```

Once installed, open the repository in VSCode or some other IDE to see everything as a project. Go into the terminal in the IDE and make sure the current directory is the root of the repository (it should have a path that ends with the name of the repository). Run the following commands to install dependencies for the front-end:

```
cd client
npm install

```

After it takes a second to load, a new folder called ```node_modules``` should appear under the ```client``` folder. These are all external libraries that we're using in this website application. Don't edit anything in this folder - any changes you do to this folder won't get updated in the website application anyway.

While still having ```client``` as the current directory, run the following commands to install the dependencies for the back-end:

```
cd ../server
npm install
```

Same thing should happen - a ```node_modules``` folder should appear.

For the final step, you'll have to reach out to Helen Wu or someone else who already has the repository on their local machine. The website application uses something called Environmental Variables which hold secret items like authentication strings and database connection information that <b><u>should never be leaked nor saved into this GitHub repository</b></u>. Always use ```git status``` or your IDE's version control tab to ensure files named ```.env``` are NEVER being pushed to GitHub. 

## ```testing.```
After installation, you can locally run the website application! Open up two separate terminals (most IDEs support multiple terminals for the same project). For one of them, do the following commands:
```
cd client
npm run dev
```
This should give you a link that will say something like ```http://localhost:5173``` or a similar number.

Switch to the other terminal. Again, type the following commands:

```
cd server
npm start
```

This should say something like ```Successfully connected to MongoDB. Server listening on port 3001```. Now if you open the localhost link from the front-end in a browser, you should see the website running!