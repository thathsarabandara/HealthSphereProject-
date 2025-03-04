const { Token } = require("../../models/auth/Token");
const { Review } = require("../../models/content/Review");
const { Patient } = require("../../models/healthcare/Patient");

exports.addReview = async (req, res) => {
    const { doctorid } = req.params;
    const { rating, comment } = req.body;
    
    try {
        const newReview = await Review.create({
            patient_id: req.patientID, 
            doctor_id: doctorid,
            rating,
            comment,
            review_date: new Date()
        });

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};
