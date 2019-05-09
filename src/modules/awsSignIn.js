import moment from 'moment';
import Auth from '@aws-amplify/auth';

export async function awsSignIn(
  identityId,
  token,
  tokenAssignedDateString,
){
  // We need to replace `+` with space in below string:
  //          Mon,+21+Jan+2019+01:03:26+GMT
  // This is to follow the moment acceptable format, check
  // `The RFC 2822 date time format` in below page:
  // http://momentjs.com/docs/#/parsing/string/
  const validDateTimeFormattedString = tokenAssignedDateString.replace(
    new RegExp('\\+', 'g'),
    ' '
  );

  const tokenAssignedMoment = moment(validDateTimeFormattedString);
  const tokenAssignedDateInUnixTimeStampInMilliseconds = tokenAssignedMoment.valueOf();

  // You can verify this token-assigned-time by this link:
  // https://www.epochconverter.com/
  // console.log(tokenAssignedDateInUnixTimeStampInMilliseconds);

  const devAuthToken = {
    // https://aws-amplify.github.io/docs/js/authentication#federated-with-auth0
    // https://github.com/aws-amplify/amplify-js/issues/2529
    // Set up to be expired 60 seconds after the token-assigned-time:
    // So the refreshHandler should be kick in:
    expires_at: (60) * 1000 + tokenAssignedDateInUnixTimeStampInMilliseconds,
    identity_id: identityId,
    token,
  };

  try {
    // aws temp key
    const credentials = await Auth.federatedSignIn(
      'developer',
      devAuthToken,
    );
    return credentials;
  } catch (e) {
    console.log('Auth.federatedSignIn failed.');
    return false;
  }
}
