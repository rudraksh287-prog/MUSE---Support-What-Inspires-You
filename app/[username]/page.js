



import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import connectDb from '@/db/connectDb'
import User from '@/models/User'

const Page = async ({ params }) => {
    const { username } = await params;

    await connectDb();

    const user = await User.findOne({
        username,
        isCreator: true
    })
    .select("name username profilepic coverpic isCreator razorpayid")
    .lean();

    if (!user) {
        notFound();
    }

    return (
        <PaymentPage
            username={username}
            creator={{
                name: user.name,
                username: user.username,
                profilepic: user.profilepic,
                coverpic: user.coverpic,
                isCreator: user.isCreator,
                razorpayid: user.razorpayid,
            }}
        />
    );
}

export default Page;

export async function generateMetadata({ params }) {
    const { username } = await params;

    return {
        title: `Support ${username} - MUSE`,
    };
}