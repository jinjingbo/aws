import Auth from '@aws-amplify/auth';
import {awsSignIn} from './modules/awsSignIn';
import Amplify from 'aws-amplify';

async function debugFederatedSignInAndOut(
  identityId,
  token,
  tokenAssignedDateString
) {
  console.log('1: Existing credentials ====>');
  try {
    const currentCredentials = await Auth.currentCredentials();
    console.log(currentCredentials);
  } catch (e) {
    console.log('Failed to get Existing credentials');
    console.log(e);
  }

  console.log('2: Start Auth.signOut ====>');
  try {
    const result = await Auth.signOut();
    console.log(result);
  } catch (e) {
    console.log('Auth.signOut failed');
    console.log(e);
  }

  console.log('3: credentials after Auth.signOut ====>');
  try {
    const currentCredentials = await Auth.currentCredentials();
    console.log(currentCredentials);
  } catch (e) {
    console.log('Failed to get currentCredentials after signOut');
    console.log(e);
  }

  console.log('4: Start Auth.federatedSignIn() ====>');
  const loginResult = await awsSignIn(
    identityId,
    token,
    tokenAssignedDateString,
  );
  console.log('5: Auth.federatedSignIn() result ====>');
  console.log(loginResult);

  console.log('6: currentCredentials after federatedSignIn ====>');
  try {
    const currentCredentials = await Auth.currentCredentials();
    console.log(currentCredentials);
  } catch (e) {
    console.log('Failed get currentCredentials after federatedSignIn');
    console.log(e);
  }
}

export async function authUsingCognitoToken(
  cognitoObj,
  showDebugLog,
){
  if (
    !cognitoObj ||
    !cognitoObj['@metadata'] ||
    !cognitoObj['@metadata'].headers ||
    !cognitoObj['@metadata'].headers.date) {
    throw new Error('invaild cognito obj');
  }

  const tokenAssignedDateString = cognitoObj['@metadata'].headers.date;

  if (showDebugLog) {
    await debugFederatedSignInAndOut(
      cognitoObj.IdentityId,
      cognitoObj.Token,
      tokenAssignedDateString,
    );
  } else {
    await awsSignIn(
      cognitoObj.IdentityId,
      cognitoObj.Token,
      tokenAssignedDateString,
    );
  }
}

export async function testFederatedSignInAndOut(awsConfig, cognitoTokenObject) {
  await Amplify.configure(awsConfig);
  await authUsingCognitoToken(cognitoTokenObject, true);
}
