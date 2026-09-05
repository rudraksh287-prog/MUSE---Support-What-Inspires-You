"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"
import { auth } from "@/app/api/auth/[...nextauth]/route";

 

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();

    const session = await auth();
    if (!session || !session.user) {
        throw new Error("You must be logged in to make a payment.");
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
        throw new Error("User record not found in database.");
    }

    if (currentUser.username === to_username) {
        throw new Error("You cannot support yourself.");
    }

    let user = await User.findOne({
        username: to_username,
        isCreator: true
    });

    if (!user) {
        throw new Error("This creator is not accepting payments.");
    }

    let key_id = user.razorpayid || process.env.KEY_ID || process.env.NEXT_PUBLIC_KEY_ID;
    let key_secret = user.razorpaysecret || process.env.KEY_SECRET;

    var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
    });

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    };

    let x = await instance.orders.create(options);

    await Payment.create({ 
        oid: x.id, 
        amount: amount / 100, 
        to_user: to_username, 
        from_user: currentUser.username || session.user.name || "Anonymous", 
        supporterId: currentUser._id,
        creatorId: user._id,
        name: paymentform.name || currentUser.name || currentUser.username, 
        message: paymentform.message || "Thanks for your work!",
        done: false
    });

    return x;
};




export const fetchuser = async (username) => {
  await connectDb();

  const u = await User.findOne({
    username,
    isCreator: true
  })
    .select("name username profilepic coverpic isCreator razorpayid")
    .lean();

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
    await connectDb();

    let p = await Payment.find({ to_user: username, done: true })
        .sort({ amount: -1 })
        .limit(4)
        .lean();

    return JSON.parse(JSON.stringify(p));
};



export const updateProfile = async (data, email) => {

    await connectDb();

    
    const session = await auth();
    if (!session || !session.user || session.user.email !== email) {
        return { error: "Unauthorized access" };
    }

    const ndata = Object.fromEntries(data);
    const currentUser = await User.findOne({ email });

    if (!currentUser) {
        return {
            error: "User not found"
        };
    }

    const oldusername = currentUser.username;
    const newusername = ndata.username;

    
    if (oldusername !== newusername) {

        const existingUser = await User.findOne({
            username: newusername
        });

        if (existingUser) {
            return {
                error: "Username already exists"
            };
        }

        await User.updateOne(
            { email },
            { $set: ndata }
        );

        await Payment.updateMany(
            { to_user: oldusername },
            { $set: { to_user: newusername } }
        );

        return {
            success: true,
            username: newusername
        };
    }

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

export const fetchCreators = async (query) => {
    await connectDb();
    if (!query || query.trim() === "") return [];

    const creators = await User.find({
        isCreator: true,
        $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } }
        ]
    })
    .select("name username profilepic category")
    .limit(6)
    .lean();

    return creators.map(creator => ({
        ...creator,
        _id: creator._id.toString()
    }));
};



export const fetchMySupports = async (identifier) => {
    await connectDb();
    if (!identifier) return [];

    const payments = await Payment.find({
        $or: [
            { from_user: identifier },
            { name: { $regex: new RegExp(`^${identifier}$`, "i") } } // Case-insensitive match for name
        ],
        done: true
    })
    .sort({ createdAt: -1 })
    .lean();

    return JSON.parse(JSON.stringify(payments));
};

export const fetchCreatorPayments = async (username) => {
    await connectDb();
    if (!username) return [];

    const payments = await Payment.find({ to_user: username, done: true })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(payments));
};