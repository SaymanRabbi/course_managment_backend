exports.ErrorHandaler = (err, req, res, next) => {
    console.log(err.stack.red.bold);
    res.status(500).send({ error: err.message });
}