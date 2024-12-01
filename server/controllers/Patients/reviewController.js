const { Token } = require("../../models/auth/Token");
const { Review } = require("../../models/content/Review");
const { Patient } = require("../../models/healthcare/Patient");

exports.addReview = async (req, res) => {
    const token = req.cookies['token'];
    const { doctorid } = req.params;
    const { rating, comment } = req.body;

    try {
        const isValidToken = await Token.findOne({ where: { token } });
        
        if (!isValidToken) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        const patient = await Patient.findOne({ where: { user_id: isValidToken.user_id } });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const newReview = await Review.create({
            patient_id: patient.id, 
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
