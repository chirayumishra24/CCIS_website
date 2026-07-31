import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

const defaultTestimonials = {
  parent: [
    { id: 'p1', img: 'parent1.png', videoId: '3adNiVmDkws' },
    { id: 'p2', img: 'parent2.png', videoId: '57c5x8jQINM' },
    { id: 'p3', img: 'parent3.png', videoId: 'NgG6gWQETqU' },
    { id: 'p4', img: 'parent4.png', videoId: 'Kw_p90p20Ns' }
  ],
  student: [
    { id: 's1', img: 'student1.webp', videoId: 'd66JSRy8GwE' },
    { id: 's2', img: 'student2.webp', videoId: 'XWpU8A4BoHE' },
    { id: 's3', img: 'student3.jpg', videoId: 'YFN2CdfXwHU' }
  ]
};

export async function GET() {
  try {
    if (!firestore) {
      return NextResponse.json(defaultTestimonials);
    }

    const snapshot = await firestore.collection('testimonials').get();
    if (snapshot.empty) {
      return NextResponse.json(defaultTestimonials);
    }

    const parent: any[] = [];
    const student: any[] = [];

    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const item = { id: doc.id, ...data };
      if (data.type === 'parent') parent.push(item);
      else student.push(item);
    });

    return NextResponse.json({
      parent: parent.length > 0 ? parent : defaultTestimonials.parent,
      student: student.length > 0 ? student : defaultTestimonials.student
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(defaultTestimonials);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, img, videoId } = body;

    if (!type || !videoId) {
      return NextResponse.json({ error: 'Type and videoId are required' }, { status: 400 });
    }

    if (!firestore) {
      return NextResponse.json({ success: true, item: { id: `mock_${Date.now()}`, type, img, videoId } });
    }

    const docRef = await firestore.collection('testimonials').add({
      type,
      img: img || (type === 'parent' ? 'parent1.png' : 'student1.webp'),
      videoId,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (firestore) {
      await firestore.collection('testimonials').doc(id).delete();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
