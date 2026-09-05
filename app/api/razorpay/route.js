

import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    await connectDb();
    let body = await req.formData();
    body = Object.fromEntries(body);

    let p = await Payment.findOne({ oid: body.razorpay_order_id });
    if (!p) {
        return NextResponse.json({ success: false, message: "Order Id not found" });
    }

    let user = await User.findOne({ username: p.to_user });
    if (!user) {
        return NextResponse.json({ success: false, message: "Creator not found" });
    }

    let secret = user.razorpaysecret;
    if (!secret || user.isDemoCreator) {
        secret = process.env.KEY_SECRET;
    }

    if (!secret) {
        return NextResponse.json({ success: false, message: "Invalid payment configuration: Missing secret key." });
    }

    let xx = validatePaymentVerification(
        { "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id },
        body.razorpay_signature,
        secret
    );

    if (xx) {
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: true },
            { new: true }
        );
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`);
    } else {
        return NextResponse.json({ success: false, message: "Payment Verification Failed" });
    }
};