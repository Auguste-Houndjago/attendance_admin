import { NextResponse } from "next/server"


const rooms=[
    {id:'101', name:'sale 1'},
    {id:'102', name:'sale 2'},
    {id:'103', name:'sale 3'},
]

export async function GET(req:Request) {
// return new Response(JSON.stringify(rooms), {
//     headers: { "Content-Type": "application/json" },
//     status:200,
// })

return NextResponse.json(rooms,{status:200})
}



