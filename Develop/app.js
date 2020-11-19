const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = []; // array to hold the manager, engineer(s), and intern(s); will be passed into render() function
let engineer = {}; // object to hold each created engineer
let intern = {}; // object to hold each created intern

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function getManagerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter name of the manager",
        },
        {
            type: "input",
            name: "id",
            message: "enter id for the manager"
        },
        {
            type: "input",
            name: "email",
            message: "enter email for the manager"
        },
        {
            type: "input",
            name: "officeNumber",
            message: "enter office number for the manager"
        },
        {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true,
          },
          {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function (answers) {
              return answers.addMore;
            },
          },
        ]);
      }
      
      function getEngineerInfo() {
        return inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "enter the engineer's NAME",
            
          },
          {
            type: "input",
            name: "id",
            message: "enter the engineer's ID NUMBER",
            
          },
          {
            type: "input",
            name: "email",
            message: "enter the engineer's EMAIL ADDRESS",
            
          },
          {
            type: "input",
            name: "github",
            message: "enter the engineer's GITHUB USERNAME",
         
          },
          {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true,
          },
          {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function (answers) {
              return answers.addMore;
            },
          },
        ]);
      }
      
      function getInternInfo() {
        return inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "enter the intern's NAME",
            
          },
          {
            type: "input",
            name: "id",
            message: "enter the intern's ID NUMBER",
            
          },
          {
            type: "input",
            name: "email",
            message: "enter the intern's EMAIL ADDRESS",
           
          },
          {
            type: "input",
            name: "school",
            message: "enter the intern's SCHOOL",
            
          },
          {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true,
          },
          {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function (answers) {
              return answers.addMore;
            },
          },
        ]);
}
// ===============================================================================
// FUNCTIONS:
// ===============================================================================
// create ENGINEER(s) based on user's answers to getEngineerInfo() prompt
async function createEngineer() {
    engineer = await getEngineerInfo();
    employees.push(
      new Engineer(engineer.name, engineer.id, engineer.email, engineer.github)
    );
  }
  
  // create INTERN(s) based on user's answers to getInternInfo() prompt
  async function createIntern() {
    intern = await getInternInfo();
    employees.push(
      new Intern(intern.name, intern.id, intern.email, intern.school)
    );
  }
  
  // function to compile all employee info and generate HTML page
  async function generateHtmlPage() {
    try {
      // create MANAGER based on user's answers to getManagerInfo() prompt
      manager = await getManagerInfo();
      employees.push(
        new Manager(manager.name, manager.id, manager.email, manager.officeNumber)
      );
  
      // create a situation (executed with while-loop) for when to allow user to add more engineers/interns
      let addMoreEmployees = true;
      while (addMoreEmployees) {
        // user adds manager, but no other employees
        if (manager.addMore === false) {
          addMoreEmployees = false;
        }
        // user also adds engineer(s)
        if (
          manager.newMember === "Engineer" ||
          engineer.newMember === "Engineer" ||
          intern.newMember === "Engineer"
        ) {
          intern.newMember = manager.newMember = engineer.newMember = "NONE";
          await createEngineer();
          // user stops adding employees
          if (engineer.addMore === false) {
            addMoreEmployees = false;
          }
        }
        // user also adds intern(s)
        if (
          manager.newMember === "Intern" ||
          engineer.newMember === "Intern" ||
          intern.newMember === "Intern"
        ) {
          intern.newMember = manager.newMember = engineer.newMember = "NONE";
          await createIntern();
          // user stops adding employees
          if (intern.addMore === false) {
            addMoreEmployees = false;
          }
        }
      }
  
      console.log("generated employees:", employees);
  
      // call the render function, passing in the employees array as an argument
      const renderedTeam = render(employees);
      // write file ("team.html" will be generated inside the 'output' directory)
      await fs.writeFile(outputPath, renderedTeam, "utf8", (err) => {
        if (err) throw err;
        console.log(
          "SUCCESS! Your team profiles have been generated.\nGo check the 'output' directory for the 'team.html' file."
        );
      });
    } catch (err) {
      console.log("ERROR!", err);
    }
  }
  
  // ===============================================================================
  // CALL FUNCTION:
  // ===============================================================================
  generateHtmlPage();
  
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
