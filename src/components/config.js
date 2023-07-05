export const URL = "/"
// export const URL = "http://192.168.31.252:5000/"

export async function POST(to, body){
    let res = await fetch(URL+to, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    return await res.json();
}