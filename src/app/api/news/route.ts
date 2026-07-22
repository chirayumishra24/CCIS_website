import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

const defaultEvents = [
  {
    id: 'ccis_default_1',
    title: 'CCIS Clinches Gold at National Science & Tech Exhibition 2026',
    date: '2026-07-10',
    category: 'Academic',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    desc: 'Our Senior Division team won first place at the National Science Exposition with a solar-powered water purification design, demonstrating CCIS Innovation.',
    featured: true,
    type: 'news',
    school: 'CCIS'
  },
  {
    id: 'ccis_default_2',
    title: 'Admissions Open for CBSE and IB Boards: Session 2026-27',
    date: '2026-07-08',
    category: 'General',
    img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    desc: 'Cambridge Court International School invites applications for the upcoming academic session. Book a personalized campus walk-through online.',
    type: 'news',
    school: 'CCIS'
  },
  {
    id: 'ccis_default_3',
    title: 'Annual Inter-School Athletic Meet 2026',
    date: '2026-06-25',
    category: 'Sports',
    img: 'https://images.unsplash.com/photo-1517649763962-0c6232662000?auto=format&fit=crop&q=80&w=1200',
    desc: 'CCIS students dominated the track events, securing the championship trophy with 8 gold, 4 silver, and 3 bronze medals.',
    type: 'news',
    school: 'CCIS'
  },
  {
    id: 'ccis_default_notice_1',
    title: 'Term-1 Examination Datesheet & Syllabus Circular',
    date: '2026-09-01',
    category: 'Academic',
    img: '/pdf-placeholder.png',
    desc: 'Detailed assessment schedules and curriculum criteria for Grades III-XII. Click the PDF link below to download.',
    attachmentUrl: 'https://ccischool.org/wp-content/uploads/2026/02/syllabus.pdf',
    attachmentType: 'pdf',
    type: 'notice',
    school: 'CCIS'
  },
  {
    id: 'ccis_default_notice_2',
    title: 'Parent-Teacher Meeting Scheduling (Grade Nursery-XII)',
    date: '2026-08-28',
    category: 'Administrative',
    img: '/pdf-placeholder.png',
    desc: 'Important instructions regarding timeslots for the upcoming PTM. Booking is available in parent portals.',
    attachmentUrl: 'https://ccischool.org/wp-content/uploads/2026/02/circular.pdf',
    attachmentType: 'pdf',
    type: 'notice',
    school: 'CCIS'
  }
];

export async function GET() {
  try {
    const snapshot = await firestore.collection('news_updates')
      .where('school', '==', 'CCIS')
      .orderBy('date', 'desc')
      .get();
      
    const newsItems: Record<string, any>[] = [];
    snapshot.forEach((doc: any) => {
      newsItems.push({ id: doc.id, ...doc.data() });
    });

    if (newsItems.length === 0) {
      return NextResponse.json({ news: defaultEvents, isDefault: true });
    }

    return NextResponse.json({ news: newsItems, isDefault: false });
  } catch (error) {
    console.error('Fetch CCIS News API Error:', error);
    return NextResponse.json({ news: defaultEvents, isDefault: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, category, img, desc, featured, attachmentUrl, attachmentType, type } = body;

    if (!title || !date || !category || !desc) {
      return NextResponse.json({ error: 'Title, date, category, and description are required.' }, { status: 400 });
    }

    const docRef = firestore.collection('news_updates').doc();
    const newEvent = {
      id: docRef.id,
      title,
      date,
      category,
      img: img || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
      desc,
      featured: !!featured,
      attachmentUrl: attachmentUrl || null,
      attachmentType: attachmentType || null,
      type: type || 'news',
      school: 'CCIS',
      createdAt: new Date().toISOString(),
    };

    // If featured is true, turn off featured flag on other CCIS news
    if (featured) {
      const featuredSnapshot = await firestore.collection('news_updates')
        .where('school', '==', 'CCIS')
        .where('featured', '==', true)
        .get();
      
      const batch = firestore.collection('news_updates').firestore.batch();
      featuredSnapshot.forEach((doc: any) => {
        batch.update(doc.ref, { featured: false });
      });
      await batch.commit();
    }

    await docRef.set(newEvent);
    return NextResponse.json({ success: true, newsItem: newEvent });
  } catch (error) {
    console.error('Create CCIS News API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'News ID is required.' }, { status: 400 });
    }

    // Verify it belongs to CCIS before deleting
    const docRef = firestore.collection('news_updates').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'News item not found.' }, { status: 404 });
    }

    if (doc.data()?.school !== 'CCIS') {
      return NextResponse.json({ error: 'Unauthorized to delete this resource.' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: 'News item deleted successfully.' });
  } catch (error) {
    console.error('Delete CCIS News API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
