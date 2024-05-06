import type { NextRequest } from 'next/server';
import { headers } from 'next/headers'

import { Client } from "@upstash/qstash";
import BASE_URL from '@/app/utils/baseURL';

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

export async function POST(req: NextRequest) {
    const data = await req.json();
    const authHeader = headers().get('authorization') || headers().get('Authorization');

    let cron;
    switch (data.routineDigestionInterval) {
        case "minutes":
            cron = `*/${data.routineDigestionNum} * * * *`;
            break;
        case "hours":
            cron = `0 */${data.routineDigestionNum} * * *`;
            break;
    }
    
    const schedules = client.schedules;
    const allSchedules = await schedules.list();
    for (let i = 0; i < allSchedules.length; i++) {
        if (allSchedules[i].destination === `${BASE_URL}/api/routine-digestion`) {
            await schedules.delete(allSchedules[i].scheduleId);
        }
    }

    await schedules.create({
        destination: `${BASE_URL}/api/routine-digestion`,
        headers: { "Authorization": authHeader as string},
        cron: data.cron,
    });


    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";