**CRUD API
**

**Description**

Task is to implement simple CRUD API using in-memory database underneath.

**Initialize Project Install all dependency**

npm i

**Run Project**

We have 3 ways to run project 

1-**Development mode**
2-**Production mode**
3-**Multi Port mode (Cluster load balancing method)**

1- **Development mode**

npm run start:dev


2- **Production mode**

npm run start:prod


3- **Multi mode or load balancing mode**

npm run start:multi


**CRUD Oprtaion On Development Mode using npm run start:dev**

**1-Create USER**

http://localhost:4001/api/users

Data we passed in body we set defult _id value through UUID method some random and unique value assigned
**POST CALL**

{
    "username":"Abhishek",
    "age":"27",
    "hobbies":["music","Cricket"]
}

Get Result 
<img width="1432" alt="Screenshot 2024-02-23 at 11 21 02 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/11f45570-dc77-48f5-987f-94f1676dcb3f">



**2- GetUser By ID which we stored in _id through genrate UUID method**

**GET CALL**

http://localhost:4001/api/users/1df64e7e-495b-4c33-93bb-c194317ba9fd  **<= this is the unique UUID which we stored in _id**

**Get Result**

<img width="1432" alt="Screenshot 2024-02-23 at 11 21 28 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/780730a9-e63c-4b78-9656-9130e65db997">


**3-Update user data using specific UserID**

**PUT CALL**

http://localhost:4001/api/users/1df64e7e-495b-4c33-93bb-c194317ba9fd

Data we passed in body to update data of this user

{
    "username":"Abhishek Kumar",
    "age":"27",
    "hobbies":["music","cricket", "Movies"]
}

**Get Result**

<img width="1432" alt="Screenshot 2024-02-23 at 11 22 01 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/e17552d6-44f5-4707-ad94-986730caab1d">


**4- Delete data of user which we passed USERID
**

**DELETE CALL**

http://localhost:4001/api/users/1df64e7e-495b-4c33-93bb-c194317ba9fd

**Get Result**

<img width="1432" alt="Screenshot 2024-02-23 at 11 22 14 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/9a67a9ab-77d5-4bcd-96d1-1a999884bc2e">


**CRUD Oprtaion On Production Mode using npm run start:prod**

using tsc method we need to build the project the diretory dist folder and assign directory name in tsconfig.json file

<img width="1432" alt="Screenshot 2024-02-23 at 11 31 23 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/e47433e4-a8d2-4679-bb11-4dd4404b7d70">

"start:prod": "NODE_ENV=production npm run build && node ./dist/index.js",
"build": "npx tsc",

<img width="1432" alt="Screenshot 2024-02-23 at 11 33 11 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/2914fb12-17ac-42a7-941a-0f7664d7a1dd">

**CRUD Oprtaion On Multi Mode using npm run start:multi**

Handle Load balancing using Cluster to utilize all CPU to balance load and manage concurrent access reqest

<img width="1432" alt="Screenshot 2024-02-23 at 12 35 18 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/fdf9b719-b82f-4ca7-b0f5-668e94ce883c">

Show CPU utilize and load balance on all CPU 

In my case 8 core CPU and utlized all Core CPU while using Cluster method through Load balancing (Round Robin) method

<img width="1432" alt="Screenshot 2024-02-23 at 11 36 24 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/60efe2f5-b623-42ed-bb2e-2e4228a78cd2">


Note:-

If Someone request on PORT 4000 which is base PORT then load balancer transfering request to working port according to round robin

<img width="1432" alt="Screenshot 2024-02-23 at 11 40 46 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/4060fd30-a91b-4b30-a7e6-f8ff4b91d36e">

Then we will perform CRUD oprations on PORT 4001 to 4007

GET USER ON PORT 4001

<img width="1432" alt="Screenshot 2024-02-23 at 12 33 52 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/4e2b6441-1381-40d5-9877-115c5b908731">

CREATE USER ON PORT 4002

<img width="1432" alt="Screenshot 2024-02-23 at 12 34 01 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/de644f24-1093-42f9-bc64-c23509f4114e">

GET USER USING USERID

<img width="1432" alt="Screenshot 2024-02-23 at 12 34 10 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/57992e9d-d6f6-4062-9174-0d41e1537cd8">

UPDATE USER USING USERID

<img width="1432" alt="Screenshot 2024-02-23 at 12 34 21 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/f3ef7c8c-7282-408f-952e-bb0364fc0f7e">

DELETE USER USING USERID

<img width="1432" alt="Screenshot 2024-02-23 at 12 34 30 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/ae85760c-ef83-4a8e-ac81-6d764400d50b">

**We used some ERROR HAndling method on APP lavel**

handled Error 

400

<img width="1432" alt="Screenshot 2024-02-23 at 11 49 10 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/517db047-ad74-4da4-91d2-048051bfb6af">

404

<img width="1432" alt="Screenshot 2024-02-23 at 12 34 30 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/ece823a6-a7a3-476f-862c-280c564e9e3d">

500

<img width="1361" alt="Screenshot 2024-02-23 at 12 13 57 PM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/045bb2e4-69fe-48d0-82c2-f172a6f510e1">


Implemeted Logger method to log error which occured in app 

we used Winston library

<img width="1140" alt="Screenshot 2024-02-23 at 11 54 00 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/b247d26b-c844-4411-b807-ed4117c5cf34">

How to Use to store error in log file which we define dir Log

<img width="1320" alt="Screenshot 2024-02-23 at 11 56 09 AM" src="https://github.com/Harshitsriv007/CRUD-API/assets/44220728/e53a8ad0-dc6f-4202-a399-73efc451db8b">















