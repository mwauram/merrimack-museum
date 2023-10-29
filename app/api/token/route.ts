import { NextApiRequest } from 'next';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const email = data.email;
        if (!email) {
            return NextResponse.json({ error: 'Email is missing in the request body' }, {status: 400});
        }
        const externalApiResponse = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email}),
        });

        if (externalApiResponse.ok) {
            const responseData = await externalApiResponse.json();
            return NextResponse.json(responseData)
        } else {
            console.error('External API request failed');
            return NextResponse.json({ error: 'External API request failed' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' });
    }
}
