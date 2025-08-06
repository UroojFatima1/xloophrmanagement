
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyJwtToken(token)
{


    try
    {
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        return decoded;
    } catch (err)
    {
        console.error("Invalid token:", err);
        return null;
    }


}