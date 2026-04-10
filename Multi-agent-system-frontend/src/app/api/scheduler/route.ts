import { NextRequest, NextResponse } from 'next/server';
import { summaryScheduler } from '@/lib/summary-scheduler';

// Глобальная переменная для отслеживания состояния планировщика
let schedulerStarted = false;

export async function POST(req: NextRequest) {
  try {
    if (!schedulerStarted) {
      summaryScheduler.start();
      schedulerStarted = true;
      console.log('🚀 Summary scheduler started via API');
    } else {
      console.log('ℹ️ Summary scheduler already running');
    }

    return NextResponse.json({
      message: 'Summary scheduler started',
      started: schedulerStarted
    });
  } catch (error: any) {
    console.error('Failed to start scheduler:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    summaryScheduler.stop();
    schedulerStarted = false;
    console.log('🛑 Summary scheduler stopped via API');

    return NextResponse.json({
      message: 'Summary scheduler stopped',
      started: false
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    started: schedulerStarted,
    message: schedulerStarted ? 'Scheduler is running' : 'Scheduler is stopped'
  });
}
