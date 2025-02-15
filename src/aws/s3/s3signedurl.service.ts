import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import { SsmService } from '../ssm/ssm.service';

@Injectable()
export class SignedUrlService {

  constructor(
    private readonly ssmService: SsmService
) {}  
  private readonly logger = new Logger(SignedUrlService.name);
  private readonly hardCodedPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAxHegemRTlzS3mBemM/EAAfZF3SfwcXuJPMH+L7QCWPU/+ANE
vV+x3/DxZ3PelYtHqZToEUyucWUml2zIyZ6snl/RsjJEa20+Ny36xvnj3vRDbuJq
ZQH/g6nfRuzsroTvkSVdAE/02S5QtTD4RVdS7WTYAddx1cGaICYCJqkZ+n/X5Lqv
swzeccq3rlp294Wxs/UhyCMtfAT47zfYQLR7G9l2YE61wTX9NLabUZ8j4h9QJwxQ
Ayu2TJbB9BNgsyCGt7SyAoZ0MUyk/Q7nGejwBFzDxlEkWgscxd2QXr6VPnnGsKF1
A58pCsrsCB7J7tPy0ma0k9/3RyJonKf6f/vx/wIDAQABAoIBAGUSMbGlOUeZbDXH
PM6N1fYsbsaWTGDlL7XdCtoZnfeLu6voao2N1GEjf907w69lJqm8HCMCMt/NLKxL
34OxqJYVLzigGYi2e4JBmjiQx8SkHqjFu/xYqc1fL6k6K4yggOpHsW9+srSj2gtM
tPxfLx9HeMSBxGM2JQcS5ppi9iVihTrKJcjyEuR4+RzbsxhV6umUAVZYDXSJwTtG
Tm1grBlNfybh+ZpDH98nOWINBjtUH4/7w8OhGNEQfuZPPufpWKgTk61h1QSPcDzD
Wj9wboaBEFfkJO6eBE5of50AjB2qS5zwVpd/nUyZAPb19cFRGBY4pSAS2VuFvrSR
wdE9IYECgYEA+2FuIKkozWLlSShL53qNGx7qOuUXtLvNBzdg3vx76Zp1MYxLdeM0
EGuDBQmqAoIZowt/7qqZ/fzWP2mRdBan++CIa4ZLijsDNf22Yuh+sPJDojuTUp4R
t5z4koF87rwc8mnr9p6A6U8L5Bw4kXm5zCYUDXpqA1X1pqhccSgb3b8CgYEAyBPe
ODn6kt1voOmYgQP5vY+q1czDiVwn1V99i377n3Q+Wm9lZroInvpOGwNljwQkuZzR
VbH6giYlsf/H/csJhRjSHgHJxjfyut+UW3FSFeTekxLfrZXlOJHwOLywR8jBNwWs
vhRH5/DZiqi3a0iEUGzLNIHT2l2n9fy0ZMpRe8ECgYBz/eDy8RsCqj9iIlXj2YiC
myE5S7xEiONyEPuB6L7Ea6Dn2/R10QCVEwbBrFPmFGH/+a5uUgn8SE4TtIKJLmsU
reZEtxLkFZbFsuwVd3H988uBcDvqQ0Wpk6Se9WDQR7yTnoxin4CcJv01pE/10FUK
/gcCsRl5sJBI9iaxj/BLwQKBgD4oLfk5yeamdG+BIqeyHHwPjfstyfF6d8WKDO6x
XGqFKnnd8ZqgYN1C1dD+lSaBGweu+DmvOSwFveA2nmLyGNsIgv5ff9fcucPkgaqG
4gF7QMpgKq06zCNu8zotJHaon54AXVIP6ubbpDm3gIQL209A/UAqtS45ulxpTYGi
eP4BAoGATWm6bxxFeOLNf0UYSIso/v8JHSFPXrWzQKpFWSCpEJrvTmH1dUFqtkyh
QzxR2/Qen6Q3tk5vw/zTWG2Y4iAirDlh/iRKl0FO82/bB2UqrElvrQoCwpmswW4s
Kot0Qy0hq7uzgrv14hrU71LycSOAhY7XTBIsWwifkk/D3e7A5Uw=
-----END RSA PRIVATE KEY-----`




rsaSigner(message: string): string {
    const sign = crypto.createSign('SHA1');
    sign.update(message);
    return sign.sign(this.hardCodedPrivateKey, 'base64');
  }

  public async resolveGetSignedUrl(filePath: string): Promise<string> {
    try {
      this.logger.log(`Generating signed URL for: ${filePath}`);
      const paramName = 'scanitsimple-cdn-keypair';
      const cdnConfig = await this.ssmService.getParams(paramName);
  
      if (!cdnConfig) {
        throw new Error('CDN configuration is missing from SSM Parameter Store.');
      }
  
      console.log('cdn url', cdnConfig);
  
      const expireDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiration
      const privateKeyId = cdnConfig.key_id;
      const cdnUrl = cdnConfig.cdn_url;
  
      if (!privateKeyId || !cdnUrl) {
        throw new Error('Missing required keys in CDN configuration.');
      }
  
      const url = `${cdnUrl}${filePath}`;

      // ✅ Step 1: Create a policy for CloudFront
      const policy = JSON.stringify({
        Statement: [
          {
            Resource: url,
            Condition: {
              DateLessThan: { 'AWS:EpochTime': expireDate },
            },
          },
        ],
      });

      // ✅ Step 2: Sign the policy using RSA private key
      const signedPolicy = this.rsaSigner(policy);

      // ✅ Step 3: Encode signature in Base64 & construct signed URL
      const signedUrl = `${url}?Expires=${expireDate}&Signature=${encodeURIComponent(signedPolicy)}&Key-Pair-Id=${privateKeyId}`;

      this.logger.log(`Signed URL: ${signedUrl}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
    }
  }
}
