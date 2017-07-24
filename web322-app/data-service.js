const Sequelize = require('sequelize');
var sequelize = new Sequelize('d8se1tdd2rhtfm', 'ggxdqgzzdzmtrd', '4c1865a14d92a8ba0c1901fbd2fb6a038ec4d91ae91fc6e952bb9a812699f70e', {
host: 'ec2-184-73-167-43.compute-1.amazonaws.com',
dialect: 'postgres',
port: 5432,
dialectOptions: {ssl: true}
});

var Employee = sequelize.define('Employee', {
    employeeNum : {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email : Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    departmentName: Sequelize.STRING,
});

module.exports.addEmployee = function(empdata)
{
   
    return new Promise(function (resolve, reject) {
        
    for(var i in empdata)
        {
            if(empdata[i] == "")
            {
                empdata[i] == null;
            }
        }

         empdata.isManager = (empdata.isManager) ? true : false;

         sequelize.sync().then(function () {
        Employee.create({
            employeeNum: empdata.employeeNum,
            firstName: empdata.firstName,
            last_name: empdata.last_name,
            email : empdata.email,
            SSN: empdata. SSN,
            addressStreet: empdata.addressStreet,
             addresCity: empdata.addresCity,
    addressState: empdata. addressState,
    addressPostal: empdata.addressPostal,
    maritalStatus: empdata.maritalStatus,
    isManager: empdata.isManager,
    employeeManagerNum:empdata.employeeManagerNum,
    status: empdata.status,
    department: empdata.department,
    hireDate: empdata.hireDate
        })
        .then(function(){
                 resolve();
             })
        .catch(function (error) {reject("unable to create employee")});
         });
});

}

module.exports.updateEmployee = function (empdata) {

    
    return new Promise(function (resolve, reject) {
         empdata.isManager = (empdata.isManager) ? true : false;
    for(var i in empdata)
        {
            if(empdata[i].employeeManagerNum == "")
            {
                empdata[i].employeeManagerNum == null;
            }
        }
        sequelize.sync().then(function () {
       Employee.update({
            employeeNum: empdata.employeeNum,
            firstName: empdata.firstName,
            last_name: empdata.last_name,
            email : empdata.email,
            SSN: empdata. SSN,
    addressStreet: empdata.addressStreet,
    addresCity: empdata.addresCity,
    addressState: empdata. addressState,
    addressPostal: empdata.addressPostal,
    maritalStatus: empdata.maritalStatus,
    isManager: empdata.isManager,
    employeeManagerNum:empdata.employeeManagerNum,
    status: empdata.status,
    department: empdata.department,
    hireDate: empdata.hireDate
       },{
        where: { employeeNum : empdata.employeeNum}
    })
    .then(function(){
                 resolve();
             })
    .catch(function(){reject("unable to update employee")});
 });
});

};

module.exports.addDepartment = function (departmentData){


        sequelize.sync().then(function () {
            return new Promise(function (resolve, reject) {
          for (var i in departmentData) 
            if(i == "") departmentData.i = null;
        Department.create({
            departmentId: departmentData.departmentId,
             departmentName: departmentData.departmentName
        })
        .then(function(){
                 resolve();
             })
        .catch(function (error) {
        
                reject("unable to create department");
        }); });
});
}
module.exports.getDepartmentById = function(id)
 {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () { 
        Department.findAll({
            where: {
                departmentId : id
            }
         })
             .then(function(data){
                 resolve(data[0]);
             })
            .catch(function (error) {reject("No results returned")}); });
});
 }
module.exports.updateDepartment = function (departmentData) {

    return new Promise(function (resolve, reject) {
        for(var i in departmentData)
        {
            if(i == "")
            {
                departmentData.i == null;
            }
        }
            sequelize.sync().then(function () { 
             Department.update(
            {
            departmentId: departmentData.departmentId,
             departmentName: departmentData.departmentName
             },{
        where: { departmentId :departmentData.departmentId}
    }) .then(function(data){
                 resolve(data);
             })
    .catch(function(err){reject("unable to update department")
    });
}); 
});

}


 module.exports.initialize = function()
 {
      return new Promise(function (resolve, reject) {
        if(sequelize.sync())
        {
            resolve("Connected to the database!");
        }
        else
        reject("Unable to sync the database");
});

}

 module.exports.getAllEmployees = function()
 {
      return new Promise( (resolve, reject) =>
    {
    sequelize.sync().then(function () { 
        Employee.findAll({ 
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
             reject("no results returned");
            });
        });
      });
 }

 module.exports.getEmployeesByStatus = function(status)
 {
     return new Promise(function (resolve, reject) {
       sequelize.sync().then(function () { 
        Employee.findAll({
            where: {
                status : status
            }
         })
             .then(function(data){
                 resolve(data);
             })
            .catch(reject("No results returned"));
             });
});

 }

 module.exports.getEmployeesByDepartment = function(department)
 {
    return new Promise(function (resolve, reject) {
         sequelize.sync().then(function () {
         Employee.findAll({
            where: {
                department : department
            }
         })
             .then(function(data){
                 resolve(data);
             })
            .catch(function (error) {reject("No results returned")
         });
});
});
 }

module.exports.getEmployeesByManager = function(empNum)
 {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
        Employee.findAll({
            where: {
                employeeManagerNum : empNum
            }
         })
             .then(function(data){
                 resolve(data);
             })
            .catch(reject("No results returned")); });
});
  
 }

module.exports.getEmployeeByNum = function(num)
 {
     console.log(num);
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {

        Employee.findAll({
            where: {
                employeeNum : num
            }
         }).then(function(data){
             
                 resolve(data[0]);
             })
            .catch(function (error) {reject("No results returned")}); });
});

 }

module.exports.getManagers = function()
 {
     return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
        Employee.findAll({
            where: {
                isManager : true
            }
         }).then(function(data){
                 resolve(data);
             })
            .catch(reject("No results returned")); });
});

 }

module.exports.getDepartments = function()
 {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
        Department.findAll({})
             .then(function(data){
                 resolve(data);
             })
            .catch(function (error) {reject("No results returned")}); });
});
 
 }
module.exports.deleteEmployeeByNum = (empNum) =>
{
    return new Promise( (resolve, reject) =>
    {
        sequelize.sync().then(function () {
            Employee.destroy({
                where: {
                     employeeNum: empNum 
                    } 
            }).then(function () { 
                resolve();
            }).catch(function (error) {
                reject("unable to remove employee");
            });
        });
    });
}
 