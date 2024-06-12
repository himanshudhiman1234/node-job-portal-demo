// controllers/testController.js
const testPostController = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    res.json({ message: `Hello, ${name}` });
};

module.exports = {testPostController};
