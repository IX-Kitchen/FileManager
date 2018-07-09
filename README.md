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
2. Set the environment variables

Change the **DIR** variable in the file *.env.example* with the absolute path of the directory you want to control, and the **PORT** variable with the port you want the server to listen at. Change the file's name to *.env*
```
mv .env.example .env
```
Set the same port in **REACT_APP_BACK_PORT** variable in the file *ui/.env.example* and change its name to *.env*

3. Start the application

At the root of the project, start the server:
```
npm start
```
The console should show the following message

```
Server listening at port 8080
```

Now you can access the application at:
http://localhost:8080/