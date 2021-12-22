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

exports.addLoan = async (loanDetails) => {
    try {
        const loanAdded = await Loan.create(loanDetails);
        return res.status(201).json({
            success: true,
            data: loanAdded
        })
    } catch (error) {
        console.log(req);

        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            
            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: `Error Adding Loan: ${error.message}`
            })
        }
    }
}