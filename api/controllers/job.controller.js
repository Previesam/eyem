
// Handler for creating new job

exports.create = (req, res) => {
    res.json({ message: "Working" });
}

// Handler for Getting all Jobs

exports.findAll = (req, res) => {
    res.json({ message: 'All Found' });
}

// Handler for Getting single Job

exports.findOne = (req, res) => {
    res.json({ message: 'One Found' });
}

// Handler for Updating Job

exports.update = (req, res) => {
    res.json({ message: 'Update Found' });
}

// Handler for Deleting Job

exports.delete = (req, res) => {
    res.json({ message: 'Delete Found' });
}