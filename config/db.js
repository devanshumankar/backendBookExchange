import mongoose from "mongoose"
import dns from "dns"

// Force Google DNS to resolve MongoDB Atlas hostnames (system DNS blocks *.mongodb.net)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    }
    catch (err) {
        console.error("MongoDB Connection Failed");
        console.error(err);
        process.exit(1);
    }
}
export default connectDB;