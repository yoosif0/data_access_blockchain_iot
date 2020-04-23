const {initiate, addNewDataPoint} = require('./storage');

(async function (){
    await initiate()

    setInterval(async ()=>{
        const obj = {
            date: Date.now().toLocaleString(),
            temperature: Math.floor(Math.random() * (45 - 3 + 1)) + 3
        }
        await addNewDataPoint(obj)
    }, 3000)
})()