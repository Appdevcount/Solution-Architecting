/* istanbul ignore file */
type EnvConfig = {
    apiUrl: string;
    appInsightsKey: string;
};


type AppConfig = EnvConfig & {
    menuListAndPermissions: any,
    USstates: any,
    apiKey : string
}

const staticConfig = {
    menuListAndPermissions: [
        { to: '/', label: 'Dashboard', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
        { to: '/createrequest', label: 'Request Care Coordination', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
        { to: '/searchrequest', label: 'Search Request', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
        { to: '/searchhistoricalrequest', label: 'Search Historical Request', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
    ],
    USstates: [
        { "value": "AL", "label": "Alabama" },
        { "value": "AK", "label": "Alaska" },
        { "value": "AZ", "label": "Arizona" },
        { "value": "AR", "label": "Arkansas" },
        { "value": "CA", "label": "California" },
        { "value": "CO", "label": "Colorado" },
        { "value": "CT", "label": "Connecticut" },
        { "value": "DE", "label": "Delaware" },
        { "value": "FL", "label": "Florida" },
        { "value": "GA", "label": "Georgia" },
        { "value": "HI", "label": "Hawaii" },
        { "value": "ID", "label": "Idaho" },
        { "value": "IL", "label": "Illinois" },
        { "value": "IN", "label": "Indiana" },
        { "value": "IA", "label": "Iowa" },
        { "value": "KS", "label": "Kansas" },
        { "value": "KY", "label": "Kentucky" },
        { "value": "LA", "label": "Louisiana" },
        { "value": "ME", "label": "Maine" },
        { "value": "MD", "label": "Maryland" },
        { "value": "MA", "label": "Massachusetts" },
        { "value": "MI", "label": "Michigan" },
        { "value": "MN", "label": "Minnesota" },
        { "value": "MS", "label": "Mississippi" },
        { "value": "MO", "label": "Missouri" },
        { "value": "MT", "label": "Montana" },
        { "value": "NE", "label": "Nebraska" },
        { "value": "NV", "label": "Nevada" },
        { "value": "NH", "label": "New Hampshire" },
        { "value": "NJ", "label": "New Jersey" },
        { "value": "NM", "label": "New Mexico" },
        { "value": "NY", "label": "New York" },
        { "value": "NC", "label": "North Carolina" },
        { "value": "ND", "label": "North Dakota" },
        { "value": "OH", "label": "Ohio" },
        { "value": "OK", "label": "Oklahoma" },
        { "value": "OR", "label": "Oregon" },
        { "value": "PA", "label": "Pennsylvania" },
        { "value": "RI", "label": "Rhode Island" },
        { "value": "SC", "label": "South Carolina" },
        { "value": "SD", "label": "South Dakota" },
        { "value": "TN", "label": "Tennessee" },
        { "value": "TX", "label": "Texas" },
        { "value": "UT", "label": "Utah" },
        { "value": "VT", "label": "Vermont" },
        { "value": "VA", "label": "Virginia" },
        { "value": "WA", "label": "Washington" },
        { "value": "WV", "label": "West Virginia" },
        { "value": "WI", "label": "Wisconsin" },
        { "value": "WY", "label": "Wyoming" }
    ]
}

let envConfig: EnvConfig;

if (process.env.REACT_APP_STAGE === 'dv1') {
    envConfig = {
        apiUrl:"https://imageone.carecorenational.com/CareCoordinationAPI/api/",
        appInsightsKey:""
    }
} else if (process.env.REACT_APP_STAGE === 'qa') {
    envConfig = {
        apiUrl:"",
        appInsightsKey:""
    }
} else if (process.env.REACT_APP_STAGE === 'in1') {
    envConfig = {
        apiUrl:"",
        appInsightsKey:""
    }
} else if (process.env.REACT_APP_STAGE === 'uat') {
    envConfig = {
        apiUrl:"",
        appInsightsKey:""
    }
} else if (process.env.REACT_APP_STAGE === 'pd1') {
    envConfig = {
        apiUrl:"",
        appInsightsKey:""
    }
} else {
    envConfig = {
        apiUrl:"https://localhost:7036/api/",
        appInsightsKey:""
    }
}

const config: AppConfig = {
    ...staticConfig,
    ...envConfig,
    apiKey :"MyAPIKey7347627",
}

// let config:any={};

// config.menuListAndPermissions =[
//     { to: '/', label: 'Dashboard', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
//     { to: '/createrequest', label: 'Request Care Coordination', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
//     { to: '/searchrequest', label: 'Search Request', roles: ['MD', 'CCCordSup', 'CCCord', 'NCCCord', 'NCCCordSup'] },
// ];
// config.USstates = [
//     { "value": "AL", "label": "Alabama" },
//     { "value": "AK", "label": "Alaska" },
//     { "value": "AZ", "label": "Arizona" },
//     { "value": "AR", "label": "Arkansas" },
//     { "value": "CA", "label": "California" },
//     { "value": "CO", "label": "Colorado" },
//     { "value": "CT", "label": "Connecticut" },
//     { "value": "DE", "label": "Delaware" },
//     { "value": "FL", "label": "Florida" },
//     { "value": "GA", "label": "Georgia" },
//     { "value": "HI", "label": "Hawaii" },
//     { "value": "ID", "label": "Idaho" },
//     { "value": "IL", "label": "Illinois" },
//     { "value": "IN", "label": "Indiana" },
//     { "value": "IA", "label": "Iowa" },
//     { "value": "KS", "label": "Kansas" },
//     { "value": "KY", "label": "Kentucky" },
//     { "value": "LA", "label": "Louisiana" },
//     { "value": "ME", "label": "Maine" },
//     { "value": "MD", "label": "Maryland" },
//     { "value": "MA", "label": "Massachusetts" },
//     { "value": "MI", "label": "Michigan" },
//     { "value": "MN", "label": "Minnesota" },
//     { "value": "MS", "label": "Mississippi" },
//     { "value": "MO", "label": "Missouri" },
//     { "value": "MT", "label": "Montana" },
//     { "value": "NE", "label": "Nebraska" },
//     { "value": "NV", "label": "Nevada" },
//     { "value": "NH", "label": "New Hampshire" },
//     { "value": "NJ", "label": "New Jersey" },
//     { "value": "NM", "label": "New Mexico" },
//     { "value": "NY", "label": "New York" },
//     { "value": "NC", "label": "North Carolina" },
//     { "value": "ND", "label": "North Dakota" },
//     { "value": "OH", "label": "Ohio" },
//     { "value": "OK", "label": "Oklahoma" },
//     { "value": "OR", "label": "Oregon" },
//     { "value": "PA", "label": "Pennsylvania" },
//     { "value": "RI", "label": "Rhode Island" },
//     { "value": "SC", "label": "South Carolina" },
//     { "value": "SD", "label": "South Dakota" },
//     { "value": "TN", "label": "Tennessee" },
//     { "value": "TX", "label": "Texas" },
//     { "value": "UT", "label": "Utah" },
//     { "value": "VT", "label": "Vermont" },
//     { "value": "VA", "label": "Virginia" },
//     { "value": "WA", "label": "Washington" },
//     { "value": "WV", "label": "West Virginia" },
//     { "value": "WI", "label": "Wisconsin" },
//     { "value": "WY", "label": "Wyoming" }
// ];


// const dv1 = {
//     apiUrl:"",
//     appInsightsKey:""
// }
// const qa = {
//     apiUrl:"",
//     appInsightsKey:""
// }
// const in1 = {
//     apiUrl:"",
//     appInsightsKey:""
// }
// const uat = {
//     apiUrl:"",
//     appInsightsKey:""
// }
// const pd1 = {
//     apiUrl:"",
//     appInsightsKey:""
// }
// const local = {
//     apiUrl:"https://imageone.carecorenational.com/CareCoordinationAPI/api/",
//     appInsightsKey:""
// }
// const Keys = {
//    apiKey :"MyAPIKey7347627",
// }

// if (process.env.REACT_APP_STAGE === 'dv1') {
//     config.envValues = dv1;
// } else if (process.env.REACT_APP_STAGE === 'qa') {
//     config.envValues = qa
// } else if (process.env.REACT_APP_STAGE === 'in1') {
//     config.envValues = in1;
// } else if (process.env.REACT_APP_STAGE === 'uat') {
//     config.envValues = uat;
// } else if (process.env.REACT_APP_STAGE === 'pd1') {
//     config.envValues = pd1;
// } else {
//     config = local;
// }

export default config;
