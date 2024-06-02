import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const jwksUrl = process.env.JSON_WEB_KEY_SET
const auth0Secret = process.env.AUTH0_SECRET

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User was authorized', {
      jwtToken
    })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  // const jwt = jsonwebtoken.decode(token, { complete: true })

  // Implement token verification
  const cert = await getCertificate()

  // return jsonwebtoken.verify(token, auth0Secret);
  return jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getCertificate() {
  const response = await Axios.get(jwksUrl)
  const pub = response.data.keys[0].x5c[0]
  const cert = `-----BEGIN CERTIFICATE-----\n${pub}\n-----END CERTIFICATE-----\n`

  return cert
}
