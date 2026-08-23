"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
  

  await connectDb();

  let user = await User.findOne({
    username: to_username,
    isCreator: true
})

if (!user) {
    throw new Error("This user is not accepting payments")
}

const secret = user.razorpaysecret

  var instance = new Razorpay({
    key_id: user.razorpayid,
    key_secret: secret,
  });

  let options = {
    amount: Number.parseInt(amount)
    , currency: "INR",


  }

  let x = await instance.orders.create(options)
  await Payment.create({ oid: x.id, amount: amount / 100, to_user: to_username, name: paymentform.name, message: paymentform.message })
  return x
}



export const fetchuser = async (username) => {
  await connectDb();

  const u = await User.findOne({ username }).lean();

  if (!u) return null;

  return {
    ...u,
    _id: u._id.toString(),
  };
};

export const fetchuserByEmail = async (email) => {
  await connectDb();

  const u = await User.findOne({ email }).lean();

  if (!u) return null;

  return {
    ...u,
    _id: u._id.toString(),
  };
};

export const fetchpayments = async (username) => {



  await connectDb()

  let p = await Payment.find({ to_user: username, done: true })
    .sort({ amount: -1 })
    .limit(4)
    .lean()

  return p.map(payment => ({
    ...payment,
    _id: payment._id.toString(),
  }))
}




export const updateProfile = async (data, email) => {

    await connectDb();

    const ndata = Object.fromEntries(data);

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
        return {
            error: "User not found"
        };
    }

    const oldusername = currentUser.username;
    const newusername = ndata.username;

    // Username is being changed
    if (oldusername !== newusername) {

        const existingUser = await User.findOne({
            username: newusername
        });

        if (existingUser) {
            return {
                error: "Username already exists"
            };
        }

        // Update user
        await User.updateOne(
            { email },
            { $set: ndata }
        );

        // Move all payments to new username
        await Payment.updateMany(
            { to_user: oldusername },
            { $set: { to_user: newusername } }
        );

        return {
            success: true,
            username: newusername
        };
    }

    // Username didn't change
    await User.updateOne(
        { email },
        { $set: ndata }
    );

    return {
        success: true,
        username: newusername
    };
};

export const becomeCreator = async (email) => {
    await connectDb();

    const user = await User.findOne({ email });

    if (!user) {
        return {
            error: "User not found"
        };
    }

    if (user.isCreator) {
        return {
            error: "You are already a creator"
        };
    }

    await User.updateOne(
        { email },
        {
            $set: {
                isCreator: true
            }
        }
    );

    return {
        success: true,
        isCreator: true
    };
};


export const stopBeingCreator = async (email) => {
    await connectDb();

    const user = await User.findOne({ email });

    if (!user) {
        return {
            error: "User not found"
        };
    }

    if (!user.isCreator) {
        return {
            error: "You are not a creator"
        };
    }

    await User.updateOne(
        { email },
        {
            $set: {
                isCreator: false
            }
        }
    );

    return {
        success: true,
        isCreator: false
    };
};