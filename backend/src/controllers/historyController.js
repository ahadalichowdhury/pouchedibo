const History = require('../model/historyModel');
const userModel = require('../model/userModel');

// Create a new history entry
exports.createHistory = async (req, res) => {
    const email = req.headers.email;
    console.log("User email from middleware:", email);
    const {from, to, date} = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("Found user:", user);

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
    // Validate required fields
    if (!from || !to || !date ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new history entry
    const newHistory = new History({
      from,
      to,
      date,
    });

    // Save the history entry to the database
    const history = await newHistory.save();

    user.history = history._id;

    return res.status(201).json({ message: 'History entry created successfully.', history: newHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


