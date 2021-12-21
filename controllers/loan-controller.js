const Loan = require('../models/Loan');

exports.getLoan = async (req, res, next) => {
    try {
        const loan = await Loan.find();

        return res.status(200).json({
            success: true,
            data: loan
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting Loan: ${error.message}`
        })
    }
}

exports.getLoanById = async (req, res, next) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json( {
                success: false,
                error: 'Loan Not Found'
            })
        }
        return res.status(200).json({
            success: true,
            data: loan
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting Loan ${req.params.id}: ${error.message}`
        })
    }
}