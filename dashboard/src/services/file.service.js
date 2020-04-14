import { decryptSymmtrically } from "./encryption";
import { fetchData } from "./api.service";

export async function getData(dataHash, secretKey) {
    const encryptedData = await fetchData(dataHash)
    download(decryptSymmtrically(encryptedData, secretKey))
}

function download(url) {
    fetch(url).then(function (t) {
        return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", 'data');
            a.click();
        }
        );
    });
}