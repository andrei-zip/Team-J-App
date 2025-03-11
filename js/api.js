export const BASE_URL = 'https://codecyprus.org/th/api/';

export async function apiList() {
    let url = `${BASE_URL} + list`;
    const response = await fetch(url, { method: "GET" , mode: "no-cors" });
    return response.json();
}



async function apiQuestion(sessionId) {
    let url = `${BASE_URL}question?session=${sessionId}`;
    const response = await fetch(url, { method: "GET", mode: "cors" });
    const data = await response.json();
    console.log(data);
    return data;

    //}
    // catch (error) {
    //     console.error("Error fetching question:", error);
    // }
}