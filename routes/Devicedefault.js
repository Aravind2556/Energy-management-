const express = require('express')
const Register = require('../model/Register')
const DeviceData = require('../model/Devicedata')

const Devicerouter = express.Router();


Devicerouter.post('/Device_data',async (req,res)=>{
    try{
        let product = await DeviceData.find({})
        let id
        if (product.length !== 0) {
            let lastproduct = product.slice(-1)
            let last = lastproduct[0]
            id = last.Id + 1
        } else {
            id = 1
        }

        let year = new Date().getFullYear(); // Get current year

// Find the latest registered user based on createdAt (descending order)
let lastUser = await DeviceData.findOne(
    { deviceId: new RegExp(`^D-${year}-\\d+$`) }, // Only fetch current year’s IDs
    { deviceId: 1 }, 
    { sort: { createdAt: -1 } } // Get latest user first
);

let newNumber = 1; // Default value if no users exist

if (lastUser && lastUser.deviceId) {
    let lastNumber = parseInt(lastUser.deviceId.split("-")[2], 10); // Extract last number
    newNumber = lastNumber + 1; // Increment
}

// Generate uniqueId in the format: D-YYYY-001
let uniqueId = `Dev-${year}-${String(newNumber).padStart(3, '0')}`;

        const {userId,voltageValue,voltageLow,voltageHigh,currentValue,currentLow,currentHigh,powerValue,powerLow,powerHigh,powerFactorValue,powerFactorLow,powerFactorHigh,temperatureValue,temperatureLow,temperatureHigh,vibrationValue, vibrationLow,vibrationHigh,deviceFlowValue,deviceFlowLow, deviceFlowHigh,energyValue,energyLow,energyHigh,frequencyValue,frequencyLow,frequencyHigh}=req.body
        console.log("device data",userId,voltageValue,voltageLow,voltageHigh,currentValue,currentLow,currentHigh,powerValue,powerLow,powerHigh,powerFactorValue,powerFactorLow,powerFactorHigh,temperatureValue,temperatureLow,temperatureHigh,vibrationValue, vibrationLow,vibrationHigh,deviceFlowValue,deviceFlowLow, deviceFlowHigh,energyValue,energyLow,energyHigh,frequencyValue,frequencyLow,frequencyHigh)
        if( userId || voltageValue || voltageLow || voltageHigh || currentValue || currentLow || currentHigh || powerValue || powerLow || powerHigh || powerFactorValue || powerFactorLow || powerFactorHigh || temperatureValue || temperatureLow || temperatureHigh || vibrationValue || vibrationLow || vibrationHigh || deviceFlowValue || deviceFlowLow || deviceFlowHigh || energyValue || energyLow || energyHigh || frequencyValue || frequencyLow || frequencyHigh){
            const deviceid = await DeviceData.findOne({ deviceId : uniqueId })
            if (deviceid) {
                return res.send({ success: false, message: "A user with this email already exists. Please use a different email to register." })
            }
            const newuser = new DeviceData({ 
                Id: id,
                deviceId: uniqueId,
                userId: userId,
                voltage: {
                    value : voltageValue  ,
                    low :voltageLow ,
                    high : voltageHigh,
                },
                current: {
                    value : currentValue ,
                    low : currentLow ,
                    high : currentHigh,
                }, 
                power: {
                    value : powerValue ,
                    low : powerLow,
                    high : powerHigh,
                }, 
                powerfactor: {
                    value : powerFactorValue  ,
                    low : powerFactorHigh,
                    high : powerFactorLow,
                }, 
                tempeature: {
                    value : temperatureValue ,
                    low : temperatureLow,
                    high : temperatureHigh,
                }, 
                vibration: {
                    value : vibrationValue,
                    low : vibrationLow,
                    high : vibrationHigh,
                }, 
                currentunit: {
                    value : currentValue,
                    low : currentLow ,
                    high : currentHigh,
                },  
                deviceflow: {
                    value : deviceFlowValue,
                    low : deviceFlowLow ,
                    high : deviceFlowHigh,
                },
                energy : {
                    value : energyValue,
                    low : energyLow,
                    high : energyHigh,

                },
                frequency : {
                    value : frequencyValue,
                    low : frequencyLow,
                    high : frequencyHigh,
                },

            })

            const saveuser = await newuser.save()
            if (saveuser) {
                return res.send({ success: true, message: "User registered successfully.", data :  saveuser   })
            }
            else {
                return res.send({ success: false, message: "Registration failed. Please try again later." })
            }

        }
        else{

        }

    }
    catch(err){
        console.log("Trouble in erro to logout", err)
        return res.json({ response: "notok", message: "Trouble error contact admin" })
    }
})



Devicerouter.post('/Device_data', async (req, res) => {
    try {
        let product = await DeviceData.find({});
        let id = product.length !== 0 ? product.slice(-1)[0].Id + 1 : 1;

        let userCount = await Register.countDocuments({});
        let year = new Date().getFullYear();
        let uniqueId = `Dev-${year}-${String(userCount + 1).padStart(3, '0')}`;

        const { 
            userId, voltageValue, voltageLow, voltageHigh, 
            currentValue, currentLow, currentHigh, 
            powerValue, powerLow, powerHigh, 
            powerFactorValue, powerFactorLow, powerFactorHigh, 
            temperatureValue, temperatureLow, temperatureHigh, 
            vibrationValue, vibrationLow, vibrationHigh, 
            deviceFlowValue, deviceFlowLow, deviceFlowHigh, 
            energyValue, energyLow, energyHigh, 
            frequencyValue, frequencyLow, frequencyHigh 
        } = req.body;

        console.log("Device Data:", req.body);

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const existingDevice = await DeviceData.findOne({ deviceId: uniqueId });
        if (existingDevice) {
            return res.status(400).json({ success: false, message: "Device with this ID already exists." });
        }

        const newDevice = new DeviceData({ 
            Id: id,
            deviceId: uniqueId,
            userId: userId,
            voltage: {
                value: voltageValue ?? 0,
                low: voltageLow ?? 0,
                high: voltageHigh ?? 100,
            },
            current: {
                value: currentValue ?? 0,
                low: currentLow ?? 0,
                high: currentHigh ?? 100,
            }, 
            power: {
                value: powerValue ?? 0,
                low: powerLow ?? 0,
                high: powerHigh ?? 100,
            }, 
            powerfactor: {
                value: powerFactorValue ?? 0,
                low: powerFactorLow ?? 0,
                high: powerFactorHigh ?? 100,
            }, 
            temperature: {
                value: temperatureValue ?? 0,
                low: temperatureLow ?? 0,
                high: temperatureHigh ?? 100,
            }, 
            vibration: {
                value: vibrationValue ?? 0,
                low: vibrationLow ?? 0,
                high: vibrationHigh ?? 100,
            },  
            deviceflow: {
                value: deviceFlowValue ?? 0,
                low: deviceFlowLow ?? 0,
                high: deviceFlowHigh ?? 100,
            },
            energy: {
                value: energyValue ?? 0,
                low: energyLow ?? 0,
                high: energyHigh ?? 100,
            },
            frequency: {
                value: frequencyValue ?? 0,
                low: frequencyLow ?? 0,
                high: frequencyHigh ?? 100,
            }
        });

        const savedDevice = await newDevice.save();
        if (savedDevice) {
            return res.status(201).json({ success: true, message: "Device data saved successfully.", data: savedDevice });
        } else {
            return res.status(500).json({ success: false, message: "Failed to save device data." });
        }

    } catch (err) {
        console.error("Error in /Device_data route:", err);
        return res.status(500).json({ success: false, message: "Server error, contact admin." });
    }
});

Devicerouter.get('/fetch-user-device',async (req,res)=>{
    try{

        const usersession =  req.session.profile
        console.log("usersession",usersession)
        if(usersession){
            if(usersession.Role === 'Admin'){
                const isadmin = await DeviceData.find({})
                if(isadmin){
                return res.json({success : true , data : isadmin})
                }
                else{
                    return res.json({success : false ,message : "not"})
    
                }
            }
            else if(usersession.Role === 'User'){
                const isuser = await DeviceData.find({userId : usersession.userid})
                if(isuser){
                return res.json({success : true , data : isuser})
                }
                else{
                    return res.json({success : false , message :"user not"})
    
                }
            }
            
        }
        else{
            return res.json({success : false , message :"please login"})
        }
        }
    catch(err){

        console.log("Trouble in erro to logout", err)
        return res.json({ response: "notok", message: "Trouble error contact admin" })

    }
})

Devicerouter.put(`/Update-device-data/:rangeid`, async (req, res) => {
    try {
        const { rangeid } = req.params;
        console.log("params:", rangeid);

        const { formData } = req.body;
        console.log("formData:", formData);

        if (!formData || Object.keys(formData).length === 0) {
            return res.json({ response: "notok", message: "No update data provided" });
        }

        // Update device data in MongoDB
        const updates = await DeviceData.findOneAndUpdate(
            { deviceId : rangeid }, // Find the document by rangeid
            { $set: formData }, // Update with formData
            { new: true, runValidators: true } // Return updated document and validate fields
        );

        if (!updates) {
            return res.json({ response: "notok", message: "Device not found" });
        }

        return res.json({ response: "ok", message: "Device data updated successfully", updates });

    } catch (err) {
        console.error("Error updating device data:", err);
        return res.json({ response: "notok", message: "Trouble error, contact admin" });
    }
});











module.exports = Devicerouter