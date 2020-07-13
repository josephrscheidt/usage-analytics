var Event = require('./event.js');
var axios = require('axios');
// const https = require('https');

exports.handler = async (event) => {
    
    var instance = axios.create({
        baseURL: 'https://api.avioranalytics.net/',
        timeout: 1000,
    });
    
    var data = event;
    if (data.properties.traits) {
        var traits = JSON.parse(data.properties.traits);
    }else{
        console.warn("Something is wrong with this event: ", data);
    }
    let response = {};

    if (data.type == "page") {
        traits.url = data.properties.url;
        traits.pageName = data.name;
        // console.warn('PAGE NAME: ', data.name);
        response = new Event("pv", traits.userId, traits.clinic_id, traits.role_id, traits);

    } else if (data.type == "track") {
        if (data.event == "Goal Added") {
            traits.goal = data.properties.goal;
            response = new Event("ga", traits.userId, traits.clinic_id, traits.role_id, traits);

        } else if (data.event == "Goal Compleated") {
            traits.id = data.properties.goal_id;
            response = new Event("gc", traits.userId, traits.clinic_id, traits.role_id, traits);
  
        } else if (data.event == "Patient Added") {
            traits.templateId = data.properties.template_id;
            response = new Event("pa", traits.userId, traits.clinic_id, traits.role_id, traits);

        } else if (data.event == "Patient Edited") {
            traits.templateId = data.properties.template_id;
            traits.treatmentId  = data.properties.treatment_id;
            response = new Event("pe", traits.userId, traits.clinic_id, traits.role_id, traits);
        } else if (data.event == "Google Review") {
            response = new Event("gr", traits.userId, traits.clinic_id, traits.role_id, traits);
        } else if (data.event == "Review Rejected") {
            response = new Event("rr", traits.userId, traits.clinic_id, traits.role_id, traits);
        }
        
    } else if (data.type == "identify") {
        response = new Event("lg", traits.userId, traits.clinic_id, traits.role_id, traits);
    } else {
        let id = (traits.userId)?traits.userId:"";
        let clinicId = (traits.clinic_id)?traits.clinic_id:"";
        let roleId = (traits.role_id)?traits.role_id:"";
        response = new Event("misc", id, clinicId, roleId, traits);
    }
    
   return instance.post('analytics', {
       event: response
   })
   .then(function(response){
       console.log(response.response.data);
   }).catch(function(error){
       console.log(error.response.data);
   });
 
};
