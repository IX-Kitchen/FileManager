# FileManager

Remote file manager

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org)

### Deployment

```
git clone https://github.com/IX-Kitchen/FileManager.git
cd FileManager/
npm install
```
2. Set the directory

Change the **DIR** variable in the file *.env.example* file and change its name to *.env*
(Default variables are for local deployment)
```
mv .env.example .env
```

3. Start the application

Start backend server (Default port: 8080):
```
npm start
```
The console should show the following message

```
Server listening at port 8080
```

Now you can access the application at:
http://localhost:8080/