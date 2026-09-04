
"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuserByEmail, stopBeingCreator, becomeCreator, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Dashboard = () => {

    const { data: session, update, status } = useSession()
    const router = useRouter()

    const [form, setform] = useState({})
    const [saving, setsaving] = useState(false)
    const [becomingCreator, setBecomingCreator] = useState(false)
    const [stoppingCreator, setStoppingCreator] = useState(false)
    

    useEffect(() => {

        if (status === "loading") return

        if (status === "unauthenticated") {
            router.push("/login")
            return
        }

        if (status === "authenticated") {
            getData()
        }

    }, [status])


    const getData = async () => {

        if (!session?.user?.email) return

        const u = await fetchuserByEmail(session.user.email)

        if (u) {
            setform(u)
        }
    }

    

    const handleChange = (e) => {

        setform({
            ...form,
            [e.target.name]: e.target.value
        })

    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        if (saving) return

        setsaving(true)

        try {

            const oldusername = session.user.name

            const formData = new FormData()

            Object.entries(form).forEach(([key, value]) => {

                if (value !== undefined && value !== null) {
                    formData.append(key, value)
                }

            })

            const result = await updateProfile(
                formData,
                session.user.email
            )

            if (result?.error) {

                toast.error(result.error)

                setsaving(false)

                return
            }

            // Update local dashboard immediately
            setform(prev => ({
                ...prev,
                username: result.username
            }))

            // Update NextAuth session
            await update({
                name: result.username
            })

            toast.success('Profile Updated')

        } catch (error) {

            console.error("UPDATE PROFILE ERROR:", error)

            toast.error("Something went wrong while updating profile")

        } finally {

            setsaving(false)

        }
    }


    const handleBecomeCreator = async () => {

        if (becomingCreator) return

        setBecomingCreator(true)

        try {

            const result = await becomeCreator(session.user.email)

            if (result?.error) {
                toast.error(result.error)
                return
            }

            setform(prev => ({
                ...prev,
                isCreator: true
            }))

            await update({
                isCreator: true
            })

            toast.success("You are now a creator!")

        } catch (error) {

            console.error("BECOME CREATOR ERROR:", error)

            toast.error("Something went wrong")

        } finally {

            setBecomingCreator(false)

        }
    }


    const handleStopBeingCreator = async () => {

        if (stoppingCreator) return

        const confirmed = window.confirm(
            "Are you sure you want to stop being a creator? You will no longer receive new payments through MUSE."
        )

        if (!confirmed) return

        setStoppingCreator(true)

        try {

            const result = await stopBeingCreator(session.user.email)

            if (result?.error) {
                toast.error(result.error)
                return
            }

            setform(prev => ({
                ...prev,
                isCreator: false
            }))

            await update({
                isCreator: false
            })

            toast.success("You are no longer a creator")

        } catch (error) {

            console.error("STOP CREATOR ERROR:", error)

            toast.error("Something went wrong")

        } finally {

            setStoppingCreator(false)

        }
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
                theme="dark"
            />

            <div className='container mx-auto py-5 px-6'>

                <h1 className='text-center my-5 text-3xl font-bold'>
                    Welcome to your Dashboard
                </h1>

                {!form.isCreator ? (

                    <div className="my-6 p-6 border rounded-xl">

                        <h2 className="text-xl font-bold">
                            Become a Creator
                        </h2>

                        <p className="text-gray-600 my-2">
                            Create your public MUSE page and start receiving support.
                        </p>

                        <button
                            type="button"
                            onClick={handleBecomeCreator}
                            disabled={becomingCreator}
                            className="block w-48 p-2 text-white bg-purple-600 rounded-2xl hover:bg-purple-700 font-medium text-sm disabled:bg-gray-400"
                        >
                            {becomingCreator ? "Setting up..." : "Become a Creator"}
                        </button>

                    </div>

                ) : (

                    <div className="my-6 p-6 border rounded-xl">

                        <h2 className="text-xl font-bold">
                            Creator Account
                        </h2>

                        <p className="text-gray-600 my-2">
                            Your creator profile is active.
                        </p>

                        <p className="text-sm text-gray-500 mb-4">
                            You can receive support through your public MUSE page.
                        </p>

                        <button
                            type="button"
                            onClick={handleStopBeingCreator}
                            disabled={stoppingCreator}
                            className="block w-52 p-2 text-white bg-red-500 rounded-2xl hover:bg-red-600 font-medium text-sm disabled:bg-gray-400"
                        >
                            {stoppingCreator ? "Disabling..." : "Stop Being a Creator"}
                        </button>

                    </div>

                )}

                <form
                    className="max-w-2xl mx-auto"
                    onSubmit={handleSubmit}
                >

                    <div className='my-2'>

                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Name
                        </label>

                        <input
                            value={form.name || ""}
                            onChange={handleChange}
                            type="text"
                            name='name'
                            id="name"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                        />

                    </div>


                    <div className="my-2">

                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Email
                        </label>

                        <input
                            value={form.email || ""}
                            onChange={handleChange}
                            type="email"
                            name='email'
                            id="email"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                        />

                    </div>


                    <div className='my-2'>

                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Username
                        </label>

                        <input
                            value={form.username || ""}
                            onChange={handleChange}
                            type="text"
                            name='username'
                            id="username"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                        />

                    </div>


                    <div className="my-2">

                        <label
                            htmlFor="profilepic"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Profile Picture
                        </label>

                        <input
                            value={form.profilepic || ""}
                            onChange={handleChange}
                            type="text"
                            name='profilepic'
                            id="profilepic"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                        />

                    </div>


                    <div className="my-2">

                        <label
                            htmlFor="coverpic"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Cover Picture
                        </label>

                        <input
                            value={form.coverpic || ""}
                            onChange={handleChange}
                            type="text"
                            name='coverpic'
                            id="coverpic"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                        />

                    </div>

                    {form.isCreator && (
                        <>
                            
                            <div className="my-2">

                                <label
                                    htmlFor="razorpayid"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Razorpay Id
                                </label>

                                <input
                                    value={form.razorpayid || ""}
                                    onChange={handleChange}
                                    type="text"
                                    name='razorpayid'
                                    id='razorpayid'
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                                />

                            </div>


                            <div className="my-2">

                                <label
                                    htmlFor="razorpaysecret"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Razorpay Secret
                                </label>

                                <input
                                    value={form.razorpaysecret || ""}
                                    onChange={handleChange}
                                    type="text"
                                    name='razorpaysecret'
                                    id='razorpaysecret'
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                                />

                            </div>
                        </>
                    )}

                    <div className="my-6">

                        <button
                            type="submit"
                            disabled={saving}
                            className="block w-60 p-2 text-white bg-blue-500 rounded-2xl hover:bg-blue-600 font-medium text-sm disabled:bg-gray-400"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>

                    </div>

                </form>

            </div>

        </>
    )
}

export default Dashboard