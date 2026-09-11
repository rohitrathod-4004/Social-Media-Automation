import zernio from "../config/zernio.js"
import { Response } from "express"; 
import { AuthRequest } from "../middlewares/authMiddleware.js";
import {User} from "../models/User.js";
import {Account} from "../models/Account.js";

//Helper to ensure user has a zernio profile



const getOrCreateZernioProfile = async (user:any) : Promise<String> => {
    try{
        const result = await zernio.profiles.listProfiles();   // list all profiles associated with the API key
        const data = result.data as any;
        const profiles : any[] = Array.isArray(data) ? data : data?.profiles || [];

        if(profiles.length > 0){
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
            return pid;
        }

        const createResult = await zernio.profiles.createProfile({
            body :{ name : `${ user.name || user.email }'s workspace` } as any
        });

        const created =  (createResult.data as any)?.profile || (createResult.data as any);

        const pid = created?._id || created?.id;

        if(!pid){
            throw new Error("Failed to profile Zernio profile - no ID returned")
        }

        await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
        return pid;
    }
    catch(error:any){
        console.error("getOrCreateZernioProfile Error:", error?.message || error);
        throw error;
    }
}

// Generate Oauth authorization URL
// GET /api/auth/:platform

export const generateOauthUrl = async (req:AuthRequest, res:Response) : Promise<void> => {

    try{
        const {platform}=req.params;
        const profileId = await getOrCreateZernioProfile(req.user);

        const origin = req.headers.origin ;
        const redirectUrl = `${origin}/accounts`;

        const result  = await zernio.connect.getConnectUrl({
            path:{platform: platform as any},
            query:{
                profileId , 
                redirect_url: redirectUrl
            }
        })

        const data = result.data as any;
        console.log("generateAuthUrl response:", JSON.stringify(data,null,2));

        const authUrl = data.authUrl;

        if(!authUrl){
            throw new Error(`Zernio returned no authUrl. Full response: ${JSON.stringify(data,null,2)}`)
        }

        res.json({url: authUrl})
    }
    catch(error:any){
        res.status(500).json({message: error?.response?.data?.message || error?.message || "Server error"});
    }
}


//Sync connected accounts form Zernio into mongoDB
// GET/api/auth/sync
export const syncAccounts = async (req:AuthRequest, res:Response) : Promise<void> => {
    try{
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query:{profileId} as any
        });

        const data = result.data as any;
        const zernioAccounts : any[] = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
        const syncedAccounts = [];

        for(const zAccount of zernioAccounts){
            const zid = zAccount._id || zAccount.id;

            if(!zid){
                console.warn("Skipping account with no ID:", zAccount);
                continue;
            }

            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            const normalizedPlatform = supportedPlatforms.find((p) => rawPlatform.includes(p));

            if(!normalizedPlatform){
                console.log(`Skipping unsupported platform: ${rawPlatform}`);
                continue;
            }

            const account = await Account.findOneAndUpdate(
                {zernioAccountId: zid},
                {
                    user: req.user._id,
                    platform: normalizedPlatform,
                    handle: zAccount.username || zAccount.name || zAccount.handle || "Unknown",
                    zernioAccountId: zid,
                    status: "connected",
                    avatarUrl:  zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url,
                },
                {upsert:true, returnDocument: "after"}
            );
            syncedAccounts.push(account);
        }
        res.json(syncedAccounts);
    }
    catch(error:any){
        res.status(500).json({message: error?.response?.data?.message || error?.message || "Server error"});
    }

}