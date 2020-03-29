// /*
// Notes: To help you follow through, please note that
// accounts[1] ----> Registered patient 
// accounts[2] ----> Registered user
// accounts[3] ----> Non-registered patient
// accounts[4] ----> Non-registeed user
// */





// const DataAccessRecordManagement = artifacts.require("DataAccessRecordManagement");
// require('chai')
// .use(require('chai-as-promised'))
// .should();

// contract(DataAccessRecordManagement,(accounts)=>{
//     let medicalRecordManagement;
//     before(async () =>{
//         medicalRecordManagement = await DataAccessRecordManagement.deployed();
//     });

//     it('The smart contract deployment should be done successfully',async() =>{
//         const address = await medicalRecordManagement.address;
//         assert.notEqual(address,0x0);
//         assert.notEqual(address,'');
//         assert.notEqual(address,null);
//         assert.notEqual(address,undefined);
//     });

//     it ('Registering a patient should be failed if either no name, age, or city is provided', async ()=>{
//         //The patient must have a name
//         await medicalRecordManagement.registerPatient('',18,'Vienna',{from: accounts[1]}).should.be.rejected;
//         //The patient's age must be greater than 0
//         await medicalRecordManagement.registerPatient('Mohamed',0,'Vienna',{from: accounts[1]}).should.be.rejected;
//         //The patient must have a city
//         await medicalRecordManagement.registerPatient('Mohamed',18,'',{from: accounts[1]}).should.be.rejected;
//     });

//     it ('Registering a patient should be successful if all are correct', async ()=>{
//         // A patient registers successfully
//         await medicalRecordManagement.registerPatient('Mohamed',18,'Vienna',{from: accounts[1]});
//         const _patient =  await medicalRecordManagement.patients(accounts[1]);
//         assert.equal (_patient.ID, accounts[1]);
//         assert.equal (_patient.name,'Mohamed');
//         assert.equal (_patient.age,18);
//         assert.equal (_patient.city,'Vienna');
//         assert.equal (_patient.isRegistered,true);
//     });

//     it ('An exisitng patient cannot register again !', async ()=>{
//         await medicalRecordManagement.registerPatient('Mohamed',18,'Vienna',{from: accounts[1]}).should.be.rejected;
//     });


//     it ('Registering a user should be failed if either no name, age, or city is provided', async ()=>{
//         //The user must have a name
//         await medicalRecordManagement.registerUser('',40,'Vienna',{from: accounts[2]}).should.be.rejected;
//         //The user's age must be greater than 0
//         await medicalRecordManagement.registerUser('Thomas',0,'Vienna',{from: accounts[2]}).should.be.rejected;
//         //The user must have a city
//         await medicalRecordManagement.registerUser('Thomas',40,'',{from: accounts[2]}).should.be.rejected;
//     });

//     it ('Registering a user should be successful if all are correct', async ()=>{
//         // A user registers successfully
//         await medicalRecordManagement.registerUser('Thomas',40,'Vienna',{from: accounts[2]});
//         const _user =  await medicalRecordManagement.users(accounts[2]);
//         assert.equal (_user.ID, accounts[2]);
//         assert.equal (_user.name,'Thomas');
//         assert.equal (_user.age,40);
//         assert.equal (_user.city,'Vienna');
//         assert.equal (_user.isRegistered,true);
//     });


//     it ('An exisitng user cannot register again !', async ()=>{
//         await medicalRecordManagement.registerUser('Thomas',40,'Vienna',{from: accounts[2]}).should.be.rejected;
//     });


//     it ('A non-registered patient cannot add a document !', async ()=>{
//         await medicalRecordManagement.addDocument( "Eye Laser Surgey", "Eye", "The patient needs to undergo an eye laser surgey to correct his vision","1234", {from: accounts[3]}).should.be.rejected;
//     });


//     it ('Adding a document should be failed if either no name, type, content, or secret is provided', async ()=>{
//         // The document must have a name
//         await medicalRecordManagement.addDocument( "", "Cells", "The patient requires chemotherapy to treat cancer","0987", {from: accounts[1]}).should.be.rejected;
//         // The document must have a type
//         await medicalRecordManagement.addDocument( "Chemotherapy", "", "The patient requires chemotherapy to treat cancer","0987", {from: accounts[1]}).should.be.rejected;
//         // The document must have a content
//         await medicalRecordManagement.addDocument( "Chemotherapy", "Cells", "","0987", {from: accounts[1]}).should.be.rejected;
//         // The document must have a secret
//         await medicalRecordManagement.addDocument( "Chemotherapy", "Cells", "The patient requires chemotherapy to treat cancer","", {from: accounts[1]}).should.be.rejected;
//     });

//     it ('A registered patient can add a document ', async ()=>{
//         await medicalRecordManagement.addDocument( "Chemotherapy", "Cells", "The patient requires chemotherapy to treat cancer","0987", {from: accounts[1]});
//         const _patient_documents  = await medicalRecordManagement.getPatientDocuments(accounts[1], {from:accounts[1]});
//         assert.equal (_patient_documents[0].name , 'Chemotherapy');
//         assert.equal (_patient_documents[0].type_, 'Cells' );
//         assert.equal (_patient_documents[0].content, 'The patient requires chemotherapy to treat cancer' );
//         assert.equal (_patient_documents[0].secret, '0987');
//     });

//     it (' Granting access to a user should be failed if either the patient or the user is not registered', async ()=>{
//         // A non-registered patient cannot grant access to a registered user
//         await medicalRecordManagement.grantAccessToUser(accounts[2],{from:accounts[3]}).should.be.rejected;
//         // A registered patient cannot grant access to a non-registered user
//         await medicalRecordManagement.grantAccessToUser(accounts[4] , {from:accounts[1]}).should.be.rejected;
//     });

//     it (' Granting access to a user should be failed if the passed _userID is 0x0', async ()=>{
//         await medicalRecordManagement.grantAccessToUser('0x0',{from:accounts[1]}).should.be.rejected; 
//     });

//     it (' Granting access to a user should be successful if all are correct', async ()=>{
//         await medicalRecordManagement.grantAccessToUser(accounts[2],{from:accounts[1]}); 
//         // Checking that the patient (i.e. accounts [1]) has given the user (i.e. accounts[2]) an access to his/her meidcal documents.
//         const has_user_access= await medicalRecordManagement.user_to_patient_access_permission(accounts[2], accounts[1]);
//         assert.equal(has_user_access, true);
//         // Checking that the user was added to the patient's list of users.
//         const _patient_list_of_users= await medicalRecordManagement.getPatientListOfUsers(accounts[1], {from:accounts[1]});
//         assert.equal(_patient_list_of_users[0], accounts[2]);
//         // Checking that the patient was added to the users's list of patients.
//         const _user_list_of_patients= await medicalRecordManagement.getUserListOfPatients(accounts[2], {from:accounts[2]});
//         assert.equal(_user_list_of_patients[0], accounts[1]);
//     });

//     it (' A user accessing a patient documents should be failed if the passed _patientID is 0x0', async ()=>{
//         await medicalRecordManagement.accessDocument('0x0',{from:accounts[2]}).should.be.rejected; 
//     });

//     it (' A user who has no permission to access a patient documents should not be able to do so', async ()=>{
//         await medicalRecordManagement.accessDocument( accounts[1],{from:accounts[4]}).should.be.rejected; 
//     });


//     it (' A user who has a permission to access a patient documents should  be able successfull to do so', async ()=>{
//         const _patient_documents_ = await medicalRecordManagement.accessDocument( accounts[1],{from:accounts[2]});
//         assert.equal (_patient_documents_[0].name , 'Chemotherapy');
//         assert.equal (_patient_documents_[0].type_, 'Cells' );
//         assert.equal (_patient_documents_[0].content, 'The patient requires chemotherapy to treat cancer' );
//         assert.equal (_patient_documents_[0].secret, '0987');
//     });




//     it ('Revoking an access should be failed  if either the patient or the user is not already registered', async ()=>{
//         // A non-registered patient cannot revoke an access to a registered user.
//         await medicalRecordManagement.revokeAccessFromUser(accounts[2],{from:accounts[3]}).should.be.rejected;
//         // A registered patient cannot revoke an access to a non-registered user
//         await medicalRecordManagement.revokeAccessFromUser(accounts[4] , {from:accounts[1]}).should.be.rejected;
//     });

  
//     it (' You cannot revoke a non-existing access', async ()=>{
//        // There is currently one exiting access related to the pair of accounts: accounts[1] and accounts[2]
//        //  This means that a ny other pair of accounts is not currently possible.
//         await medicalRecordManagement.revokeAccessFromUser(accounts[2],{from:accounts[3]}).should.be.rejected;
//         await medicalRecordManagement.revokeAccessFromUser(accounts[4] , {from:accounts[1]}).should.be.rejected;
//     });

//     it (' Revoking an access to a user should be failed if the passed _userID is 0x0', async ()=>{
//         await medicalRecordManagement.revokeAccessFromUser('0x0',{from:accounts[1]}).should.be.rejected; 
//     });

    
//     it (' Revoking an access of a user to the documents of patient should be successfull if all are correct ', async ()=>{
//         // Revoking the access
//         await medicalRecordManagement.revokeAccessFromUser(accounts[2] , {from:accounts[1]});
        
//         // Checking that the patient (i.e. accounts [1]) has revoked the access of the user (i.e. accounts[2]) to his/her meidcal documents.
//         const has_user_access= await medicalRecordManagement.user_to_patient_access_permission(accounts[2], accounts[1]);
//         assert.equal(has_user_access, false);

//         // Checking that the user was deleted from the patient's list of users.
//         const _patient_list_of_users= await medicalRecordManagement.getPatientListOfUsers(accounts[1], {from:accounts[1]});
//         assert.equal(_patient_list_of_users[0], 0x0000000000000000000000000000000000000000);

//         // Checking that the patient was deleted from the users's list of patients.
//         const _user_list_of_patients= await medicalRecordManagement.getUserListOfPatients(accounts[2], {from:accounts[2]});
//         assert.equal(_user_list_of_patients[0], 0x0000000000000000000000000000000000000000);
        
//     });

    








    

// });
