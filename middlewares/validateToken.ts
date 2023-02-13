import { NextFunction, Request, RequestHandler, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      authenticated?: boolean
    }
  }
}

const createTokens = (user: any) => {
  const accessToken = sign(
    { username: user.userName, id: user._id },
    process.env.TOKEN_SECRET as string
  )

  return accessToken
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  // return next()
  let cookies: { [key: string]: string } = {}

  const cookiesArray = req.headers.cookie?.split(';')

  cookiesArray?.forEach((cookie) => {
    const [key, value] = cookie.trim().split('=')
    cookies[key] = value
  })

  // get The "accessToken" value:
  const accessToken = cookies['accessToken']

  if (!accessToken)
    return res.status(400).json({ error: 'User not Authenticated!' })

  try {
    const validToken = verify(accessToken, process.env.TOKEN_SECRET as string)
    if (validToken) {
      req.authenticated = true
      return next()
    }
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

export const jwtService = {
  createTokens,
  validateToken,
}
