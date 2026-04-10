import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        application: true,
        members: {
          include: { user: true }
        },
        tasks: true,
        chatMessages: true,
        documents: true,
        infraResources: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { status, name, endDate, summary } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(summary && { summary }),
      },
      include: {
        application: true,
        members: { include: { user: true } },
        tasks: true,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

