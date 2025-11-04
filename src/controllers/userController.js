const User = require('../models/user');
const Helper = require("../utils/helper");

//add user by admin
exports.addUser = async (req,res) =>{

    const { organization_id , name , email , role , password } = req.body;

    if(!organization_id || !name || !email || !role || !password){
        return res.status(400).json({'message' : "all fields are neccesary."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_data = Helper.getCurrentUserInfo(req);
    if(!user_data){
        return res.status(400).json({'message' : "No user data found."});
    }

    try{

        const user = await User.create(
            {
                organization_id: organization_id,
                name: name,
                email: email,
                password_hash: hashedPassword,
                role: role,
                created_by: user_data.userId
            }
        )

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error in adding user.', error: error.message });
    }

    res.status(200).json({ message: 'User added successfully'});

}

exports.disableUser = async(req,res) => {

    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({"message":"No user found."});
    }

    current_user = await User.findByPk(user_id);
    if(!current_user){
        return res.status(400).json({"message":"No user found."});
    }

    //disable the user

    const aff_row = await User.update(
        {
            active_flag : 0
        },
        {
            where : {
                id : user_id
            }
        }
    );

    return res.status(200).message("User successfully disabled");

}

exports.enableUser = async(req,res) => {

    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({"message":"No user found."});
    }

    current_user = await User.findByPk(user_id);
    if(!current_user){
        return res.status(400).json({"message":"No user found."});
    }

    //disable the user

    const aff_row = await User.update(
        {
            active_flag : 1
        },
        {
            where : {
                id : user_id
            }
        }
    );

    return res.status(200).message("User successfully enabled");

}