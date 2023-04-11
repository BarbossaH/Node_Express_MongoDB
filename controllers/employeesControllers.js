// const data = {};
// data.employees = require('../model/employees.json');

// const data = {
//   employees: require('../model/employees.json'),
//   setEmployees: function (data) {
//     this.employees = data;
//   },
// };

const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    if (!employees)
      return res.status(204).json({ message: 'No any employee.' });
    res.json(employees);
  } catch (error) {
    console.log(error);
  }
};

const createNewEmployee = async (req, res) => {
  // const newEmployee = {
  //   //to add the new employee at the end of data or create the first one if it's empty
  //   id: data.employees[data.employees.length - 1].id + 1 || 1,
  //   name: req.body.name,
  //   age: req.body.age,
  // };

  if (!req?.body?.name || !req?.body?.gender) {
    return res
      .status(400)
      .json({ message: 'name and gender are both required.' });
  }

  try {
    const result = await Employee.create({
      name: req.body.name,
      gender: req.body.gender,
    });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

//update an employee data
const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter is needed' });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `There is no EmployID ${req.body.id}` });
  }
  if (req.body?.name) employee.name = req.body.name;
  //I'd better set any json value as string not a number, because if the number is 0, it would see it as false value in if conditional syntax
  if (req.body?.gender) employee.gender = req.body.gender;
  //essentially, it's delete the old data and add the new one, then sort the new array after the addition
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: 'EmployID is required' });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee)
    return res
      .status(204)
      .json({ message: `The employee ID${req.body.id} doesn't exist.` });

  const result = await Employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'EmployID is required.' });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee)
    res.status(204).json({ message: `Employee ID ${req.params.id} not found` });

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
};
