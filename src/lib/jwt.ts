import { SignJWT, jwtVerify, type JWTPayload } from "jose"
const ACCESS_SECRET = new TextEncoder().encode('JWT_ACCESS_SECRET')
type AuthContext = {
    userId:string;
    // valid end date
    expiresAt:string;
}
export interface TokenPayload extends JWTPayload, AuthContext { }
/**
 * 
 * @param context 
 * @param exp secound/string like 7d,4h /Date
 * @returns 
 */
export async function signAccessToken(context: AuthContext,exp: string | number | Date): Promise<string> {
  return new SignJWT(context)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(ACCESS_SECRET)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET)
  return payload as TokenPayload
}
