exports.login = async(req,res) =>{
    const {username, password} = req.body;
    return res.status(200).json({data: username});
}
exports.register = async(req,res) =>{

}