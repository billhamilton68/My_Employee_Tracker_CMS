// users are prompted with questions to add departments, roles, employees, and update employee roles
const departmentQuestions = [
  {
    type: "input",
    name: "department",
    message: "What is the name of the department?",
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return "Please enter a valid department name.";
      }
    },
  },
];

const roleQuestions = (departmentNames) => departmentNames.length
  ? [
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "departmentName",
      message: "Which department does the role belong to?",
      choices: departmentNames,
    },
  ]
  : [
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "input",
      name: "departmentName",
      message: "Enter the department that the role belongs to:",
    },
  ];

const employeeQuestions = (roleTitles, managerNames) => roleTitles.length && managerNames.length
  ? [
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleTitle",
      message: "What is the employee's role?",
      choices: roleTitles,
    },
    {
      type: "list",
      name: "managerName",
      message: "Who is the employee's manager?",
      choices: [...managerNames, "None"],
    },
  ]
  : [
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "input",
      name: "roleTitle",
      message: "Enter the employee's role:",
    },
    {
      type: "input",
      name: "managerName",
      message: "Enter the employee's manager:",
    },
  ];

const updateRoleQuestions = (employeeNames, roleTitles) => employeeNames.length && roleTitles.length
  ? [
    {
      type: "list",
      name: "employeeName",
      message: "Which employee's role do you want to update?",
      choices: employeeNames,
    },
    {
      type: "list",
      name: "roleTitle",
      message: "What is the employee's new role?",
      choices: roleTitles,
    },
  ]
  : [
    {
      type: "input",
      name: "employeeName",
      message: "Enter the employee's name:",
    },
    {
      type: "input",
      name: "roleTitle",
      message: "Enter the employee's new role:",
    },
  ];

const mainQuestion = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Exit",
    ],
  },
];

module.exports = {
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateRoleQuestions,
  mainQuestion,
};