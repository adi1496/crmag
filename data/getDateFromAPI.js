const https = require('https');

//  https://dog.ceo/api/breeds/list/all
//  https://ali-express1.p.rapidapi.com/categories

const getDataFromAPI = async () =>{
    const result = await new Promise((resolve, reject) => {
        const options = {
            hostname: 'ali-express1.p.rapidapi.com',
            port: 443,
            path: '/productsByCategory/200216675',
            method: 'GET',
            headers: {
                "x-rapidapi-key": "08067c0e2bmsh099db15e7a00a35p16e89ajsnb81f8cd889c5",
                "x-rapidapi-host": "ali-express1.p.rapidapi.com",
                "useQueryString": true
            }
        };
        
        const req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
        
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });
        
        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    })


    // const result = await fetch('https://ali-express1.p.rapidapi.com/categories', {
    //     method: 'GET',
    //     headers: {
    //         "x-rapidapi-key": "08067c0e2bmsh099db15e7a00a35p16e89ajsnb81f8cd889c5",
    //         "x-rapidapi-host": "ali-express1.p.rapidapi.com",
    //         "useQueryString": true
    //     }
    // });

    // console.log(result);
}

getDataFromAPI();