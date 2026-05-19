const Employee = require('../models/Employee');
const Performance = require('../models/Performance');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const performance = await Performance.find({ employee: req.params.id }).sort({ createdAt: -1 });
    res.json({ employee, performance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role, department, skills } = req.body;
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ message: 'Employee already exists' });

    employee = new Employee({ name, email, role, department, skills });
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    await Performance.deleteMany({ employee: req.params.id });
    res.json({ message: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
