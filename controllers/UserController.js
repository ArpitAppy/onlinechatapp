const express = require('express');
const Users = require('../models/Users');
const { ResponseJson } = require('../utils/common');
const jwtGenerator = require('../utils/jwtGenerator');

// Create New User
const registerUser = async (req, res) => {
    try {
        let {fullName, emailAddress, password, mobileNumber} = req.body;
        let user = await Users.findOne({emailAddress});
        let number = await Users.findOne({mobileNumber});
        if (user || number) {
            return ResponseJson(res, 400, false, 'Oops! Email Address or Mobile Number already exists', {}, {});
        }
        let uid = mobileNumber;
        const newUser = new Users({
            fullName, emailAddress, password, uid, mobileNumber
        });
        await newUser.save(async function(err, user) {
            if (err) {
                return ResponseJson(res, 500, false, "Error occured. Please try again !!", {}, {} );
            }

            const token = await jwtGenerator(uid, fullName);
            return ResponseJson(res, 200, true, "User Registered Successfully", {user, token}, {});
        })
    } catch (err) {
        return ResponseJson(res, 500, false, err, {}, err)
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        let users = await Users.find();
        return ResponseJson(res, 200, true, "All users fetched successfully", users, {});
    } catch (err) {
        return ResponseJson(res, 500, false, err, {}, err);
    }
};

// Get User Details
const getUserDetails = async (req, res) => {
    try {
        let { fullName } = req.query;
        let user = await Users.findOne({fullName})
        if (!user) {
            return ResponseJson(res, 400, false, 'No User Found', {}, {})
        }
        return ResponseJson(res, 200, true, 'User Fetch Successfully !!', user, {})
    } catch (err) {
        return ResponseJson(res, 400, false, err, {}, err)
    }
}

// Login User

const loginUser = async (req, res) => {
    try {        
        let {emailAddress, password} = req.body;
        let user = await Users.findOne({emailAddress});
        if (!user) {
            return ResponseJson(res, 400, false, "Email address doesn't exist", {}, {})
        }
        if (user.password !== password) {
            return ResponseJson(res, 401, false, "Unauthorized Users!", {}, {})
        }
        const token = await jwtGenerator(user.uid, user.fullName);
        return ResponseJson(res, 200, true, "User Verified Successfully", {user, token}, {});
    } catch (err) {
        return ResponseJson(res, 500, false, err, {}, err)
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    getUserDetails
}