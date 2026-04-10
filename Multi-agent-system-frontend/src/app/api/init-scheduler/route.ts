import { NextRequest, NextResponse } from 'next/server';
import { summaryScheduler } from '@/lib/summary-scheduler';

// Этот маршрут вызывается автоматически при запуске сервера
// через instrumentation или при первом запросе

let initialized = false;

export async function GET(req: NextRequest) {
  if (!initialized) {
    try {
      console.log('🔄 Initializing summary scheduler...');
      summaryScheduler.start();
      initialized = true;
      console.log('✅ Summary scheduler initialized and started');
    } catch (error) {
      console.error('❌ Failed to initialize scheduler:', error);
      return NextResponse.json({ error: 'Failed to initialize scheduler' }, { status: 500 });
    }
  }

  return NextResponse.json({
    message: 'Scheduler initialized',
    initialized,
    timestamp: new Date().toISOString()
  });
}
