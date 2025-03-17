import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const response = await fetch(`${process.env.APP_URL}/api/notifications/schedule`, {
    method: 'POST',
  })

  return NextResponse.json(await response.json())
} 