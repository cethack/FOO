# FOO
Fleet Of One: Application to maintain and track personal assets such as receipts, documents, cars etc.

- User can use the application track receipts, documents and links for personal assets (furnaces, cars, ...)
- Support Expandable Asset Type - Everything can be optional if there is no additional business rule. User many even define 'Trip' as an asset type, create 1 trip as asset and add all documents related to the trip. If an asset needs to support additional rules, user needs to tag the required properties. For example, to support PM forecasting, the asset needs to have meter reading, user needs to tag the property as 'Meter Reading' before the system can do PM forecasting.
- User can publish new Asset Type for all user to use.
- We will use all FAR client technology (i.e. HTML5, CSS, Javascript, AngularJS 2, Bootstrap, Git, Ionic)
- We will use MongoDB as the backend database.
- The application will be hosted in the cloud (Digital Ocean, Azure). 
- Offline possibility

## Set up develop environment

You need to download Node.js and a couple of tools.

- [node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)
- [SourceTree](https://www.sourcetreeapp.com/download/)
- [Visual Studio Code](https://code.visualstudio.com/Download)  *optional

Those files have been downloaded and copied into Shared network drive 'Home' under 'FOO' folder.

#### Install npm packages

After installing Node.js you need to install some packages globally.

- npm install -g npm
- npm install -g gulp
- npm install -g typings
- npm install -g tslint
- npm install -g ts-node

#### Set up Git global variables

- git config --global user.name "YOUR NAME"
- git config --global user.email "YOUR EMAIL ADDRESS"
- git config --global credential.helper wincred
- git config --global pull.default current
- git config --global push.default current

#### Fork FOO repository into your GitHub

