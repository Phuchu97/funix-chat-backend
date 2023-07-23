const bcrypt = require('bcryptjs');
const User = require('../models/user');
const EmailModel = require('../models/email');

class UserController {
    async addUser (req, res) {
        try {
            const {username,email,role,courses} = req.body;
            const user = await User.findOne({email});
            if(user) {
                return res.status(422).json({message: 'Your email must be a unique!', statusCode: 500})
            }
            const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            const string_length = 8;
            let randomstring = '';
            for (var i=0; i<string_length; i++) {
                let rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            const newUser = await User.create({
                username: username,
                password: randomstring,
                email: email,
                role: role,
                courses: courses
            });
            EmailModel.api.emailsPost(EmailModel.email(newUser), (error, data, response) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log('Email send successfully.');
                }
            });
            res.json({message: 'Add User Successfully!', data: newUser, statusCode: 200});
        }
        catch (e) {
            res.status(422).json(e)
        }
    }

    async getListUser(req, res) {
        try {
            const listUser = await User.find({});
            res.json({message: 'Get List User Successfully!', data: listUser, statusCode: 200});
        }
        catch (e) {
            res.status(422).json(e)
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.body;
            await User.deleteOne({_id: id});
            res.json({message: 'Delete User Successfully!', statusCode: 200});
        }
        catch (e) {
            res.status(422).json(e)
        }
    }

    async editImageUser(req, res) {
        try {
            const { user,url } = req.body;
            await User.updateOne({_id: user. _id}, {
                ...user,
                file: url
            })
            res.json({message: 'Edit image User Successfully!', statusCode: 200});
        }
        catch (e) {
            res.status(422).json(e)
        }
    }

    async getUserDetail(req, res) {
        try {
            const { id } = req.body;
            const userDetail = await User.findOne({_id: id});
            res.json({message: 'Get User Detail Successfully!',data: userDetail, statusCode: 200});
        }
        catch (e) {
            res.status(422).json(e)
        }
    }
}

module.exports = new UserController;