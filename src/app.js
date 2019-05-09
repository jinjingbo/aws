import { testFederatedSignInAndOut } from './testFederatedSignInAndOut';
import { debugRefreshHandler } from './testRefreshHandler';

// !! Put you own AWS setting below:
const awsConfig = {
  Auth: {
    identityPoolId: 'us-west-2:aaaaaa-bbbbbb-cccccc-dddd-eeeeeeee',
    region: 'us-west-2',
    mandatorySignIn: true,
  }
};

// !! Put you own AWS CognitoToken below:
const cognitoTokenObject = {
  "IdentityId":
    "us-west-2:aaaaaa-bbbbbb-cccccc-dddd-eeeeeeee",
  "Token":
    "fdsakfjkl;dsajklfjsda;jfasdjkfasd",
  "@metadata":
    {
      "statusCode":
        200, "effectiveUri":
        "https://cognito-identity.us-west-2.amazonaws.com",
      "headers":
        {
          "date": "Thu,+09+May+2019+01:19:27+GMT",
          "content-type": "application/x-amz-json-1.1",
          "content-length": "1098",
          "connection": "keep-alive",
          "x-amzn-requestid": "aaaaaa-bbbbbb-cccccc-dddd-eeeeeeee"
        }
      ,
      "transferStats":
        {
          "http":
            [[]]
        }
    }
};

async function demo() {
  console.log("**** A: Below test for FederatedSignInAndOut ****");
  // 1. Issue about FederatedSignInAndOut:
  // Got misleading Error message:
  // [ERROR] AuthClass - Cannot get the current user because the user pool is
  // missing. Please make sure the Auth module is configured with a valid
  // Cognito User Pool ID
  await testFederatedSignInAndOut(awsConfig, cognitoTokenObject);

  // 2. Issue about refreshHandlers:
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("**** B: Below test for refreshHandlers ****");
  await debugRefreshHandler(awsConfig, cognitoTokenObject);
}

demo();
