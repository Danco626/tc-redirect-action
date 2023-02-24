# Terms and conditions redirect application
This app is used to prompt users for updated T&C during the authentication flow.

## Requirements
* node

## Configuring the application
1. Create a new login action and copy the contents of ./login-action/consent-redirect.js  
2. Add a secret to the new action with the key *consentCycle* and the value set to the consent cycle name  
    - This can be done manually in the Auth0 dashboard OR via the [mgmt API](https://auth0.com/docs/api/management/v2#!/Actions/patch_action)
3. In the application, update the following .env variables
    - ISSUER_URL: the Auth0 tenant domain
    - PORT: set to 3001. If changed, the following locations should be updated
        - line 23 in ./login-action/consent-redirect 
        - If running in docker, update the port in the Dockerfile and the docker run command 

### Run Locally
Navigate to the project root directory and run the following commands
- *npm install*
- *npm start*

### Run in Docker
Navigate to the project root directory and run the following commands

#### Build
*docker build -t tc-redirect .*

#### Run
*docker run --name tc-redirect -p 3001:3001 -d tc-redirect*