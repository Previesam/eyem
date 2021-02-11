
// Handler for initializing client list for old software

exports.initialize = (req, res) => {
    res.json({ message: "Working" });
}

// Handler for creating new client

exports.create = (req, res) => {
    res.json({ message: "Working" });
}

// Handler for Getting all clients

exports.findAll = (req, res) => {
    res.json({ message: 'All Found' });
}

// Handler for Getting single client

exports.findOne = (req, res) => {
    res.json({ message: 'One Found' });
}

// Handler for Updating client

exports.update = (req, res) => {
    res.json({ message: 'Update Found' });
}

// Handler for Deleting client

exports.delete = (req, res) => {
    res.json({ message: 'Delete Found' });
}