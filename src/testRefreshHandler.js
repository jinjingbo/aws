import Amplify, { Auth } from 'aws-amplify';
import { authUsingCognitoToken } from './testFederatedSignInAndOut';

function refreshToken() {
  console.log('refreshToken handler triggered, page should redirect!');
  window.location.href =
    'https://aws-amplify.github.io/docs/js/authentication#token-refresh';

  return new Promise(res, rej => {
    console.log('refreshToken has a promise return');
  });
}

async function refreshHandlersSetup(awsConfig) {
  // Use both method 1&2 to ensure the refreshHandlers is set up.

  // Method 1: putting into aws config json:
  const awsConfig2 = {
    Auth: {
      identityPoolId: awsConfig.Auth.identityPoolId,
      region: awsConfig.Auth.region,
      mandatorySignIn: awsConfig.Auth.mandatorySignIn,

      // When token become expired:
      // https://aws-amplify.github.io/docs/js/authentication#token-refresh
      // https://github.com/aws-amplify/amplify-js/issues/2529
      // https://github.com/aws-amplify/amplify-js/pull/665
      refreshHandlers: {
        'developer': refreshToken,
      },
    }
  };
  await Amplify.configure(awsConfig2);

  // Method 2: using Auth.configure() as mentioned in here:
  // https://aws-amplify.github.io/docs/js/authentication#federated-with-auth0
  await Auth.configure({
    refreshHandlers: {
      'developer': refreshToken
    }
  });
}

export async function debugRefreshHandler(awsConfig, cognitoTokenObject) {
  await refreshHandlersSetup(awsConfig);
  await Auth.signOut();
  const loginCredentials = await authUsingCognitoToken(cognitoTokenObject, false);
  console.log(loginCredentials);
}
