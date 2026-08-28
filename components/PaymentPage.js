"use client";
import React from "react";
import Script from "next/script";
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import Razorpay from "razorpay";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation"


const PaymentPage = ({ username, creator }) => {
    // const {data: session} = useSession()

    // const [paymentform, setpaymentform] = useState({})
    const [paymentform, setpaymentform] = useState({
        name: "",
        message: "",
        amount: "",
    })
    const [currentUser, setcurrentUser] = useState(creator)
    const [payments, setpayments] = useState([])
    const searchParams= useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getData()



    }, [])

 useEffect(() => {
        if(searchParams.get("paymentdone") == "true"){
        toast('Thanks for your donation!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
            });
        }
        router.push(`/${username}`)
     
    }, [])


    const handleChange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const getData = async () => {
        // let u = await fetchuser(username)
        // setcurrentUser(u)
        let dbpayments = await fetchpayments(username)
        setpayments(dbpayments)
    }


    
    const pay = async (amount) => {
        let a = await initiate(amount, username, paymentform)
        let orderId = a.id;
        var options = {
            "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "MUSE", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        // var rzp1=new Razorpay(options)
        var rzp1 = new window.Razorpay(options)
        rzp1.open();
    }

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
                theme="dark" />
            {/* Same as */}

            <Script src="https://checkout.razorpay.com/v1/checkout.js" />


           
            <div className="cover w-full relative aspect-[3/1] sm:aspect-[4/1]">
    <img
        className="mt-3 absolute inset-0 w-full h-full object-cover"
        src={currentUser.coverpic}
        alt=""
    />

    <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 sm:-bottom-16 border-2 rounded-full overflow-hidden border-white">
        <img
            width={100}
            height={100}
            className="rounded-full w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] object-cover"
            src={currentUser.profilepic}
            alt=""
        />
    </div>
</div>
            <div className="info flex items-center justify-center gap-2 flex-col my-24 mb-32">
                <div className='font-bold text-lg'>
                    @{username}
                </div>
                <div className='text-slate-600'>LEt'S Help {username}!</div>
                <div className='text-slate-600'>{payments.length} Payments .   ₹{payments.reduce((a, b) => a + b.amount, 0)} Raised </div>

                <div className="payment flex flex-col md:flex-row gap-3 w-[80%] mt-11">
                    <div className="supporters w-full md:w-1/2  bg-slate-900 text-white rounded-lg p-10 ">
                        <h2 className='font-bold text-2xl my-5'>OUR SUPporterS</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.length == 0 && <li>No Payments yet</li>}
                            {payments.map((p, i) => {
                                return <li key={p._id} className='flex gap-2 items-center my-4'>
                                    <img width={30} src="/avatar.gif" alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> witha message " {p.message} "
                                    </span>
                                </li>
                            })}
                            

                        </ul>
                    </div>

                    <div className="makepayment w-full  md:w-1/2 bg-slate-900 text-white rounded-lg p-10">
                        <h2 className="text-2xl font-bold my-5">Make a Payment</h2>

                        <div className="flex  flex-col gap-2">
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
                                className="w-full  py-2 px-3 rounded-lg bg-slate-800"
                                placeholder="Enter Message"
                            />
                            <input
                                name="amount"
                                onChange={handleChange}
                                value={paymentform.amount}
                                type="text"
                                className="w-full  py-2 px-3 rounded-lg bg-slate-800"
                                placeholder="Enter Amount"
                            />
                            <div className="text-center">

                                <button onClick={() => { pay(Number.parseInt(paymentform.amount) * 100) }} type="button" className="w-30 text-white bg-gradient-to-r from-purple-500 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-purple-300 dark:focus:ring-white font-medium rounded-2xl text-sm px-4 py-2.5 text-center leading-5 mx-1 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length< 1}>PAY</button>
                            </div>

                            
                        </div>
                        {/* OR CHOOSE FROM THESE AMOUNTs */}
                        <div className=" flex flex-col md:flex-row gap-2 mt-5">
                            <button onClick={() => { pay(1000) }} className="bg-slate-800 py-3 px-4 rounded-lg">
                                Pay ₹10
                            </button>

                            <button onClick={() => { pay(2000) }} className="bg-slate-800 py-3 px-4 rounded-lg">
                                Pay ₹20
                            </button>

                            <button onClick={() => { pay(3000) }} className="bg-slate-800 py-3 px-4 rounded-lg">
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