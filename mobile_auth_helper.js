const AWS = require("aws-sdk");

// AWS Services
AWS.config.update({ region: "us-east-1" });

const COGNITO_USER_POOL_MOBILE = process.env.COGNITO_USER_POOL_MOBILE;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});


// ******************************* HELPERS FOR MOBILE AUTHETICATION AND AUTORIZATION *********************************

/**
 * SignUpUserWithEmail 
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.signupUserWithEmail = async function(user) {
  const { firstName, email, passsword } = user;
  var params = {
    ClientId: COGNITO_USER_POOL_MOBILE,
    Password: passsword,
    Username: email,
    // AnalyticsMetadata: {
    //   AnalyticsEndpointId: 'STRING_VALUE'
    // },
    UserAttributes: [
      {
        Name: given_name,
        Value: firstName
      },
      {
        Name: email,
        Value: email
      },
    ],
    UserContextData: {
      EncodedData: 'STRING_VALUE'
    },
    ValidationData: []
  };
  try {
    const response = cognitoidentityserviceprovider.signUp(params);
    return response;
  }catch(error){
    return error;
  }
}

/**
 * SignOut the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.export.signupUserWithFacebook = async function(user) {
  FB.login(function (response) {

    // Check if the user logged in successfully.
    if (response.authResponse) {
  
      console.log('You are now logged in.');
  
      // Add the Facebook access token to the Cognito credentials login map.
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'IDENTITY_POOL_ID',
        Logins: {
          'graph.facebook.com': response.authResponse.accessToken
        }
      });
  
      // Obtain AWS credentials
      AWS.config.credentials.get(function(){
          // Access AWS resources here.
      });
  
    } else {
      console.log('There was a problem logging you in.');
    }
  
  });
}

/**
 * SignOut the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.signupUserWithGoogle = function(user) {
  function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
  
       // Add the Google access token to the Cognito credentials login map.
       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'IDENTITY_POOL_ID',
          Logins: {
             'accounts.google.com': authResult['id_token']
          }
       });
  
       // Obtain AWS credentials
       AWS.config.credentials.get(function(){
          // Access AWS resources here.
       });
    }
  }
}

/**
 * SignOut the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.signinUser = async function(user) {

}

/**
 * SignOut the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.signoutUser = async function(user) {
    const { email } = user;
    var params = {
      UserPoolId: COGNITO_USER_POOL_MOBILE,
      Username: email
    };
    try {
      const response = cognitoidentityserviceprovider.adminUserGlobalSignOut(
        params
      );
      return response;
    } catch (error) {
      return error;
    }
}

/**
 * Reset the tenant password
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.resetUserPassword = async function(user) {
    const { accessToken, previousPassword, newPassword } = user;
    var params = {
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: newPassword
    };
    try {
      const response = cognitoidentityserviceprovider.changePassword(params);
      return response; // successful response
    } catch (error) {
      return error; // an error occurred
    }
}

/**
 * Save the tenant data to FaunaDB
 * @param tenant Data for the tenant to be created
 * @returns {Promise} The created tenant
 */
module.exports.forgotUserPassword = async function(user) {
    const { email } = user;
    var params = {
      ClientId: CLIENT_APP_ID,
      Username: email,
      // AnalyticsMetadata: {
      //   AnalyticsEndpointId: 'STRING_VALUE'
      // },
      UserContextData: {
        EncodedData: "STRING_VALUE"
      }
    };
    try {
      const response = cognitoidentityserviceprovider.forgotPassword(params);
      return response; // successful response
    } catch (error) {
      return error; // an error occurred
    }
}


