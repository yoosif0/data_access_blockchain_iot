const {initiate, addNewDataPoint, getAllData} = require('./ipfs');

(async function (){
    await initiate()

    setInterval(async ()=>{
        const obj = {
            date: Date.now().toLocaleString(),
            temperature: Math.floor(Math.random() * (45 - 3 + 1)) + 3
        }
        await addNewDataPoint(obj)
    }, 3000)

    // setTimeout(async ()=>{
    //     const allData = await getAllData()
    //     console.log(allData)
    // }, 4000)
})()