/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  

  // accesses the consen cycle set in the action secrets
  const currentCycle = event.secrets.consentCycle;
  event.user.app_metadata = event.user.app_metadata || {};
  
  let userConsentCycle = event.user.app_metadata[currentCycle];

  if (!userConsentCycle?.consentGiven) {
    const options = {
      query: {
        cycle: currentCycle,
      },
    };
    
    api.redirect.sendUserTo("http://localhost:3001/terms", options);
  }
};

// if user clicks 'I agree' on the consent form, save it to their profile so they don't get prompted again
exports.onContinuePostLogin = async (event, api) => {
  
  //data contains the consent result base64 encoded
  //in a production app this should be encrypted or encoded in a JWT
  if (event.request.query.data) {    
    
    // base64 decode data
    let buff = new Buffer(event.request.query.data, "base64");
    let decodedData = JSON.parse(buff.toString("ascii"));
    

    const cycleName = {
      consentGiven: decodedData.consentGiven,
      consentTimestamp: decodedData.consentTimestamp,
    };

    api.user.setAppMetadata(event.secrets.consentCycle, cycleName);

    return;
  } else {
    return api.access.deny("User choice unavailable");
  }
};
