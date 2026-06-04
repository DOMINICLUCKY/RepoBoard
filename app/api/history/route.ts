import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Analysis from '../../../models/Analysis';

export async function GET() {
  try {
    await dbConnect();

    const records = await Analysis.find({})
      .sort({ analyzedAt: -1 })
      .limit(5)
      .select({
        _id: 1,
        repoUrl: 1,
        owner: 1,
        repoName: 1,
        analyzedAt: 1,
        'analysis.architectureType': 1,
        'analysis.complexityScore': 1,
        'analysis.summary': 1,
      })
      .lean();

    const recentScans = records.map((record) => ({
      id: String(record._id),
      repoUrl: record.repoUrl,
      owner: record.owner,
      repoName: record.repoName,
      analyzedAt: record.analyzedAt,
      architectureType: record.analysis?.architectureType ?? null,
      complexityScore: record.analysis?.complexityScore ?? null,
      summary: record.analysis?.summary ?? null,
    }));

    return NextResponse.json({ recentScans }, { status: 200 });
  } catch {
    // Database not available, return empty list
    return NextResponse.json({ recentScans: [] }, { status: 200 });
  }
}
