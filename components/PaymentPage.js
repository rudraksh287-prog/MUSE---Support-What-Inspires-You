

"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { fetchpayments, initiate } from "@/actions/useractions";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = ({ username, creator }) => {
    const { data: session } = useSession();

    const [paymentform, setpaymentform] = useState({
        name: "",
        message: "",
        amount: "",
    });
    const [currentUser, setcurrentUser] = useState(creator);
    const [payments, setpayments] = useState([]);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            toast('Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            });
            router.push(`/${username}`);
        }
    }, [searchParams, username, router]);

    const handleChange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const getData = async () => {
        let dbpayments = await fetchpayments(username);
        setpayments(dbpayments);
    };

    const handleQuickPay = (amt) => {
        const finalForm = {
            name: paymentform.name || session?.user?.name || "Anonymous",
            message: paymentform.message || "Supported Creator!",
            amount: amt / 100
        };
        pay(amt, finalForm);
    };

    const pay = async (amount, customForm = null) => {
        if (!session) {
            toast.error("Please login to support this creator!");
            router.push("/login");
            return;
        }
        try {
            const sendForm = customForm || paymentform;
            let a = await initiate(amount, username, sendForm);
            let orderId = a.id;

            const razorpayKey = currentUser?.razorpayid || process.env.NEXT_PUBLIC_KEY_ID;

            var options = {
                "key": razorpayKey,
                "amount": amount,
                "currency": "INR",
                "name": "MUSE",
                "description": "Support Creator",
                "order_id": orderId,
                "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                "prefill": {
                    "name": sendForm.name || session?.user?.name || "",
                    "email": session?.user?.email || ""
                },
                "theme": {
                    "color": "#9333ea"
                }
            };

            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            toast.error(error.message || "Failed to initiate payment");
        }
    };
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" 
            />

            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="cover w-full relative aspect-[3/1] sm:aspect-[4/1]">
                <img
                    className="mt-3 absolute inset-0 w-full h-full object-cover"
                    src={currentUser?.coverpic}
                    alt=""
                />

                <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 sm:-bottom-16 border-2 rounded-full overflow-hidden border-white">
                    <img
                        width={100}
                        height={100}
                        className="rounded-full w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] object-cover"
                        src={currentUser?.profilepic}
                        alt=""
                    />
                </div>
            </div>

            <div className="info flex items-center justify-center gap-2 flex-col my-24 mb-32">
                <div className='font-bold text-lg'>
                    @{username}
                </div>
                <div className='text-slate-600'>Let's Help {username}!</div>
                <div className='text-slate-600'>
                    {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} Raised
                </div>

                <div className="payment flex flex-col md:flex-row gap-3 w-[80%] mt-11">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 text-white rounded-lg p-10">
                        <h2 className='font-bold text-2xl my-5'>OUR SUPPORTERS</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.length === 0 && <li>No Payments yet</li>}
                            {payments.map((p) => (
                                <li key={p._id} className='flex gap-2 items-center my-4'>
                                    <img width={30} src="/avatar.gif" alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message "{p.message}"
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="makepayment w-full md:w-1/2 bg-slate-900 text-white rounded-lg p-10">
                        <h2 className="text-2xl font-bold my-5">Make a Payment</h2>

                        <div className="flex flex-col gap-2">
                            <div>
                                <input
                                    name="name"
                                    onChange={handleChange}
                                    value={paymentform.name}
                                    type="text"
                                    className="w-full py-2 px-3 rounded-lg bg-slate-800"
                                    placeholder="Enter Name"
                                />
                            </div>
                            <input
                                onChange={handleChange}
                                value={paymentform.message}
                                name="message"
                                type="text"
                                className="w-full py-2 px-3 rounded-lg bg-slate-800"
                                placeholder="Enter Message"
                            />
                            <input
                                name="amount"
                                onChange={handleChange}
                                value={paymentform.amount}
                                type="text"
                                className="w-full py-2 px-3 rounded-lg bg-slate-800"
                                placeholder="Enter Amount"
                            />
                            <div className="text-center">
                                <button 
                                    onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} 
                                    type="button" 
                                    className="w-30 text-white bg-gradient-to-r from-purple-500 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-300 dark:focus:ring-white font-medium rounded-2xl text-sm px-4 py-2.5 text-center leading-5 mx-1 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600" 
                                    disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}
                                >
                                    PAY
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 mt-5">
                            <button onClick={() => handleQuickPay(1000)} className="bg-slate-800 py-3 px-4 rounded-lg">
                                Pay ₹10
                            </button>
                            <button onClick={() => handleQuickPay(2000)} className="bg-slate-800 py-3 px-4 rounded-lg">
                                Pay ₹20
                            </button>
                            <button onClick={() => handleQuickPay(3000)} className="bg-slate-800 py-3 px-4 rounded-lg">
                                Pay ₹30
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;