/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Harsh Patel Student ID: 131964157 Date: 24/5/2017
*
* Online (Heroku) Link: https://young-shore-77634.herokuapp.com/
*
********************************************************************************/

var express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var data = require("./data-service.js");

var app = express();

var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : true}));
app.engine(".hbs", exphbs({

extname: ".hbs",

defaultLayout: 'layout',

helpers: {

equal: function (lvalue, rvalue, options) {

if (arguments.length < 3)

throw new Error("Handlebars Helper equal needs 2 parameters");

if (lvalue != rvalue) {

return options.inverse(this);

} else {

return options.fn(this);
}}}}));
app.set("view engine", ".hbs");

var path = require("path");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
   res.render("home");
});

app.get("/about", function(req,res){
   res.render("about");
});

app.get("/employees", function(req,res){

  if(req.query.status){
   data.getEmployeesByStatus(req.query.status).then((dat) =>
    {
       res.render("employeeList", { data: dat, title: "Employees" });
    })
    .catch((err) =>
    {
       res.render("employeeList", { data: {}, title: "Employees" });
    });
  }else if(req.query.department){
    data.getEmployeesByDepartment(req.query.department).then((dat) =>
    {
       res.render("employeeList", { data: dat, title: "Employees" });
    })
    .catch((err) =>
    {
      res.render("employeeList", { data: {}, title: "Employees" });
    });
  }else if(req.query.manager){
    data.getEmployeesByManager(req.query.manager).then((data) =>
    {
       res.render("employeeList", { data: data, title: "Employees" });
    })
    .catch((err) =>
    {
       res.render("employeeList", { data: {}, title: "Employees" });
    });
  }else{
    data.getAllEmployees().then((dat) =>
    {
        res.render("employeeList", { data: dat, title: "Employees" });
    
    })

    .catch((err) =>
    {
       res.render("employeeList", { data: {}, title: "Employees" });
    });
  }
});

app.get("/employee/:empNum", (req, res) => {
 // initialize an empty object to store the values
 let viewData = {};
 console.log(req.params.empNum);
 data.getEmployeeByNum(req.params.empNum)
 .then((data) => {
 viewData.data = data; //store employee data in the "viewData" object as "data"
 }).catch(()=>{
 viewData.data = null; // set employee to null if there was an error
 }).then(data.getDepartments)
 .then((data) => {
 viewData.departments = data; // store department data in the "viewData" object as "departments"

 // loop through viewData.departments and once we have found the departmentId that matches
 // the employee's "department" value, add a "selected" property to the matching
 // viewData.departments object
 for (let i = 0; i < viewData.departments.length; i++) {
 if (viewData.departments[i].departmentId == viewData.data.department) {
 viewData.departments[i].selected = true;
 }
 }
 }).catch(()=>{
 viewData.departments=[]; // set departments to empty if there was an error
 }).then(()=>{
 if(viewData.data == null){ // if no employee - return an error
 res.status(404).send("Employee Not Found");
 }else{
 res.render("employee", { viewData: viewData }); // render the "employee" view
 }
 });
});
app.get("/managers", function(req,res){
console.log(req.body);
    data.getManagers().then((data) =>
    {
        res.render("employeeList", { data: data, title: "Employees(Managers)" });
    })

    .catch((err) =>
    {
      res.render("employeeList", { data: {}, title:"Employees (Managers)" });
    });

});

app.get("/departments", function(req,res){
console.log(req.body);
   data.getDepartments().then((dat) =>
    {
        res.render("departmentList", { data: dat, title: "Departments" });
      
    })

    .catch((err) =>
    {
      res.render("departmentList", { data: {}, title: "Departments" });
    });
});

app.get("/employees/add", (req,res) => {
data.getDepartments().then( (data) =>
 {
      res.render("addEmployee", {departments: data});
})
 .catch((err) =>
    {
      res.render("addEmployee", {departments: []});
    });
});

app.post("/employees/add", (req, res) => { 
    console.log(req.body);
    data.addEmployee(req.body).then( () =>
    {
      res.redirect("/employees");
    });
}); 

app.post("/employee/update", (req, res) => { 
    console.log(req.body); 
    data.updateEmployee(req.body).then( () => {
      res.redirect("/employees"); 
    });
});

app.get("/departments/add", (req,res) => {
res.render("addDepartment");
});

app.post("/departments/add", (req, res) => { 
    console.log(req.body);
    data.addDepartment(req.body).then( () =>
    { 
      res.redirect("/departments");
    });
}); 

app.post("/departments/update", (req, res) => { 
    console.log(req.body); 
    data.updateDepartment(req.body).then( () => {
      res.redirect("/departments"); 
    });
});

app.get("/department/:departmentId", (req, res) => {
console.log(req.body); 
  data.getDepartmentById(req.params.departmentId).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department Not Found");
  });

});
app.get("/employee/delete/:empNum", (req,res) => {
    data.deleteEmployeeByNum(req.params.empNum).then( () =>
    {
      res.redirect("/employees");      
    })
    .catch( (errorMsg)=> {
      res.status(500).send("Unable to Remove Employee");        
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});



data.initialize()

.then(() => {
  app.listen(HTTP_PORT, onHttpStart);
 })
 .catch(() => {
   console.log("Unable to read the file");
 });
