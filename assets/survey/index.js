// const SURVEY_ID = 1;

Survey
    .StylesManager
    .applyTheme("defaultV2");



const survey = new Survey.Model(surveyJson);
var data="";
function getData(){
jsChannel1.postMessage(data);
}
function alertResults (sender) {
    const results = JSON.stringify(sender.data);
    //alert(results);
    data=results;
    jsChannel1.postMessage(data);
    // saveSurveyResults(
    //     "https://your-web-service.com/" + SURVEY_ID,
    //     sender.data
    // )
}

survey.onComplete.add(alertResults);

$(function() {
    $("#surveyContainer").Survey({ model: survey });
});

// function saveSurveyResults(url, json) {
//     const request = new XMLHttpRequest();
//     request.open('POST', url);
//     request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     request.addEventListener('load', () => {
//         // Handle "load"
//     });
//     request.addEventListener('error', () => {
//         // Handle "error"
//     });
//     request.send(JSON.stringify(json));
// }