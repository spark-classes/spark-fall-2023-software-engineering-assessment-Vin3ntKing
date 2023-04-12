/**
 * This file can be used to store global variables that you need to access across multiple places.
 * We've put a few here that we know you will need.
 * Fill in the blank for each one
 */
export const MY_BU_ID = "U46586498";
export const BASE_API_URL = "https://spark-se-assessment-api.azurewebsites.net/api";
// You can get this from Piazza
export const TOKEN = "SHSHFt8CN3CxKEUGRrPt0hQohqQ3YDWF0DNT0UaQqIALAzFuCzfNfw==";
// This is a helper function to generate the headers with the x-functions-key attached
export const GET_DEFAULT_HEADERS = () => {
  // You will need to add another header here
  // If you do not, the API will reject your request (:
  const header = new Headers({
    'Accept': 'application/json',
    'x-functions-key': TOKEN,
  });
  return header;
};
// I would use this method to construct the specific API endpoint call
// for example: class/GetById/{classID}
// we also need to add the BUID to the end of the API to verfication
export const constructApiUrl = (endpoint: string): string => {
  const apiUrl = `${BASE_API_URL}/${endpoint}?buid=${encodeURIComponent(MY_BU_ID)}`;
  return apiUrl;
};
