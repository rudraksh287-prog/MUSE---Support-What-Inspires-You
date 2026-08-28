import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import connectDb from "../db/connectDb.js";
import User from "../models/User.js";
import creators from "../data/creators.json" with { type: "json" };

const seedCreators = async () => {
    try {
        await connectDb();

        console.log(`Found ${creators.length} creators to import.`);

        for (const creator of creators) {

            await User.updateOne(
                {
                    username: creator.username
                },
                {
                    $set: {
                        name: creator.name,
                        username: creator.username,
                        profilepic: creator.profilepic,
                        coverpic: creator.coverpic,
                        isCreator: true,
                        isDemoCreator: true
                    },
                    $setOnInsert: {
                        email: `${creator.username}@muse-demo.com`
                    }
                },
                {
                    upsert: true
                }
            );

            console.log(`Imported: ${creator.name}`);
        }

        console.log("Creator import completed successfully.");

        process.exit(0);

    } catch (error) {

        console.error("SEED ERROR:", error);

        process.exit(1);
    }
};

seedCreators();