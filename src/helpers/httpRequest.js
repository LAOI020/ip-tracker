
export const httpGetMyIP = async () => {
    
    let result;
    
    await fetch('https://freegeoip.app/json/').then(async response =>{
        const data = await response.json();

        const objectResult = {
            ...data,
            status: 'success'
        }

        result = objectResult;
    });

    return result;
};


export const httpSearchIP = async (ipAdress) => {

    let result;
    
    await fetch(`https://freegeoip.app/json/${ipAdress}`)
        .then(async response =>{
            const data = await response.json();

            const objectResult = {
                ...data,
                status: 'success'
            }

            result = objectResult;
            
        }).catch(err => {
            result = { status: 'error'}
        })

    return result;
}